"""
Virexa - AI Energy & EV Fleet Optimization API
FastAPI backend service coordinating multi-agent optimization, real-time disruptions,
schedule diffing, explainability, and human-in-the-loop approvals.
"""

import os
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from data_gen.generate import generate_fleet_data
from agents.pipeline import VirexaPipeline
from backend.replan import apply_disruption_and_replan

# Initialize FastAPI application
app = FastAPI(
    title="Virexa API",
    description="AI Energy & EV Fleet Optimization Agent REST API. Charge smart. Run longer. Spend less.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory singleton state
class SystemState:
    def __init__(self):
        self.pipeline = VirexaPipeline()
        self.base_fleet_data = generate_fleet_data(seed=42)
        self.current_fleet_data = copy_dict(self.base_fleet_data)
        self.weights = {"w_cost": 1.0, "w_health": 1.0, "w_avail": 1.0}
        # Initial optimization run
        self.active_plan = self.pipeline.run(
            self.current_fleet_data,
            w_cost=self.weights["w_cost"],
            w_health=self.weights["w_health"],
            w_avail=self.weights["w_avail"]
        )
        self.pending_replan: Optional[Dict[str, Any]] = None
        self.disruption_history: List[Dict[str, Any]] = []
        self.approval_status: str = "APPROVED"


def copy_dict(d: Dict[str, Any]) -> Dict[str, Any]:
    import copy
    return copy.deepcopy(d)


state = SystemState()


# ==================== Pydantic Request Models ====================

class OptimizeRequest(BaseModel):
    w_cost: float = Field(default=1.0, ge=0.0, le=5.0, description="Cost minimization priority weight")
    w_health: float = Field(default=1.0, ge=0.0, le=5.0, description="Battery health preservation weight")
    w_avail: float = Field(default=1.0, ge=0.0, le=5.0, description="Shift readiness availability weight")


class DisruptionRequest(BaseModel):
    type: str = Field(..., description="Disruption type: vehicle_breakdown, tariff_spike, station_down, longer_route")
    params: Dict[str, Any] = Field(default_factory=dict, description="Parameters tailored to the disruption type")


class ResetRequest(BaseModel):
    seed: int = Field(default=42, description="RNG Seed for fleet data")


# ==================== API Endpoints ====================

@app.get("/")
def root():
    return {
        "name": "Virexa API",
        "tagline": "Charge smart. Run longer. Spend less.",
        "version": "1.0.0",
        "status": "HEALTHY",
        "docs": "/docs"
    }


@app.get("/api/data")
def get_fleet_data():
    """Returns the current fleet data (vehicles, stations, shifts, tariff)."""
    return {
        "metadata": state.current_fleet_data["metadata"],
        "vehicles": state.current_fleet_data["vehicles"],
        "stations": state.current_fleet_data["stations"],
        "shifts": state.current_fleet_data["shifts"],
        "tariff": state.current_fleet_data["tariff"],
        "approval_status": state.approval_status
    }


@app.post("/api/optimize")
def run_optimization(req: OptimizeRequest):
    """Re-runs the multi-agent optimization pipeline with custom weights."""
    state.weights = {
        "w_cost": req.w_cost,
        "w_health": req.w_health,
        "w_avail": req.w_avail
    }

    plan = state.pipeline.run(
        fleet_data=state.current_fleet_data,
        w_cost=req.w_cost,
        w_health=req.w_health,
        w_avail=req.w_avail
    )
    state.active_plan = plan
    state.approval_status = "APPROVED"
    state.pending_replan = None

    return {
        "status": "SUCCESS",
        "weights": state.weights,
        "kpis": plan["kpis"],
        "schedules": plan["schedules"],
        "vehicle_summary": plan["vehicle_summary"],
        "agent_telemetry": plan["agent_telemetry"],
        "data_provenance": plan["data_provenance"]
    }


@app.post("/api/disrupt")
def inject_disruption(req: DisruptionRequest):
    """
    Simulates a fleet disruption and generates an optimized replan with a diff.
    If the changes are significant, requires human approval (status PENDING_APPROVAL).
    """
    valid_types = ["vehicle_breakdown", "tariff_spike", "station_down", "longer_route"]
    if req.type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid disruption type '{req.type}'. Must be one of {valid_types}."
        )

    replan_result = apply_disruption_and_replan(
        base_fleet_data=state.current_fleet_data,
        previous_plan=state.active_plan,
        disruption_type=req.type,
        params=req.params,
        pipeline=state.pipeline,
        weights=state.weights
    )

    state.pending_replan = replan_result
    state.approval_status = replan_result["status"]
    state.disruption_history.append({
        "type": req.type,
        "params": req.params,
        "diff_summary": replan_result["diff"]
    })

    return {
        "status": replan_result["status"],
        "diff": replan_result["diff"],
        "proposed_plan": {
            "kpis": replan_result["new_plan"]["kpis"],
            "schedules": replan_result["new_plan"]["schedules"],
            "vehicle_summary": replan_result["new_plan"]["vehicle_summary"],
            "agent_telemetry": replan_result["new_plan"]["agent_telemetry"],
            "explanations": replan_result["new_plan"]["explanations"]
        }
    }


@app.post("/api/approve")
def approve_pending_plan():
    """
    Human-in-the-loop approval: Confirms and commits the pending disruption replan.
    Updates the active schedule and marks plan as fully applied.
    """
    if not state.pending_replan:
        return {
            "status": "NO_PENDING_PLAN",
            "message": "No pending replan to approve. Active plan is already up to date.",
            "approval_status": state.approval_status
        }

    # Commit pending plan
    state.current_fleet_data = state.pending_replan["disrupted_fleet_data"]
    state.active_plan = state.pending_replan["new_plan"]
    state.approval_status = "APPROVED"
    committed_diff = state.pending_replan["diff"]
    state.pending_replan = None

    return {
        "status": "APPROVED",
        "message": "Replan successfully approved by fleet operator. Active schedules updated.",
        "kpis": state.active_plan["kpis"],
        "diff_summary": committed_diff
    }


@app.get("/api/explanations")
def get_explanations():
    """Returns plain language explanations and data provenance for all vehicles."""
    plan = state.active_plan
    return {
        "explanations": plan.get("explanations", {}),
        "data_provenance": plan.get("data_provenance", {}),
        "approval_status": state.approval_status
    }


@app.get("/api/summary")
def get_kpi_summary():
    """Returns top-level KPIs, financial savings, readiness metrics, and status."""
    kpis = state.active_plan.get("kpis", {})
    return {
        "kpis": kpis,
        "approval_status": state.approval_status,
        "has_pending_approval": state.approval_status == "PENDING_APPROVAL",
        "active_weights": state.weights,
        "fleet_size": len(state.current_fleet_data["vehicles"]),
        "station_count": len(state.current_fleet_data["stations"]),
        "disruption_count": len(state.disruption_history)
    }


@app.post("/api/reset")
def reset_fleet(req: ResetRequest):
    """Resets the fleet and disruptions back to default clean baseline."""
    state.current_fleet_data = generate_fleet_data(seed=req.seed)
    state.weights = {"w_cost": 1.0, "w_health": 1.0, "w_avail": 1.0}
    state.active_plan = state.pipeline.run(
        state.current_fleet_data,
        w_cost=1.0,
        w_health=1.0,
        w_avail=1.0
    )
    state.pending_replan = None
    state.disruption_history = []
    state.approval_status = "APPROVED"

    return {
        "status": "RESET_SUCCESS",
        "kpis": state.active_plan["kpis"],
        "approval_status": state.approval_status
    }
