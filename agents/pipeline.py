"""
Virexa - Multi-Agent Orchestrator Pipeline
Sequentially executes the 7 specialized agents:
  1. FleetAgent -> 2. BatteryAgent -> 3. RouteAgent -> 4. ChargingAgent ->
  5. CostAgent -> 6. OptimizationAgent -> 7. RecommendationAgent
Gathers telemetry, execution timing, data provenance, and unified schedule outputs.
"""

import time
from typing import Dict, List, Any, Optional

from .fleet_agent import FleetAgent
from .battery_agent import BatteryAgent
from .route_agent import RouteAgent
from .charging_agent import ChargingAgent
from .cost_agent import CostAgent
from .optimization_agent import OptimizationAgent
from .recommendation_agent import RecommendationAgent


class VirexaPipeline:
    def __init__(self):
        self.fleet_agent = FleetAgent()
        self.battery_agent = BatteryAgent(safety_buffer_ratio=0.15)
        self.route_agent = RouteAgent(traffic_weather_multiplier=1.10)
        self.charging_agent = ChargingAgent(time_step_hours=0.5)
        self.cost_agent = CostAgent(time_step_hours=0.5)
        self.optimization_agent = OptimizationAgent()
        self.recommendation_agent = RecommendationAgent()

    def run(
        self,
        fleet_data: Dict[str, Any],
        w_cost: float = 1.0,
        w_health: float = 1.0,
        w_avail: float = 1.0,
        time_limit_sec: int = 10
    ) -> Dict[str, Any]:
        """
        Executes the entire 7-agent pipeline sequentially with execution telemetry.
        """
        pipeline_start = time.time()
        agent_telemetry = []

        # 1. FleetAgent
        t0 = time.time()
        fleet_out = self.fleet_agent.process(fleet_data)
        d1 = round(time.time() - t0, 4)
        agent_telemetry.append({
            "gate": 1,
            "agent": "FleetAgent",
            "role": self.fleet_agent.role,
            "status": "COMPLETED",
            "duration_sec": d1,
            "summary": f"Ingested {fleet_out['fleet_stats']['total_vehicles']} vehicles across {len(fleet_out['shifts'])} shifts."
        })

        # 2. RouteAgent (run demand before battery target sizing)
        t0 = time.time()
        route_out = self.route_agent.process(fleet_out)
        d2 = round(time.time() - t0, 4)
        agent_telemetry.append({
            "gate": 3,
            "agent": "RouteAgent",
            "role": self.route_agent.role,
            "status": "COMPLETED",
            "duration_sec": d2,
            "summary": f"Calculated route demands for {len(route_out['route_demands'])} active shifts with 1.10x traffic multiplier."
        })

        # 3. BatteryAgent
        t0 = time.time()
        battery_out = self.battery_agent.process(fleet_out, route_out)
        d3 = round(time.time() - t0, 4)
        agent_telemetry.append({
            "gate": 2,
            "agent": "BatteryAgent",
            "role": self.battery_agent.role,
            "status": "COMPLETED",
            "duration_sec": d3,
            "summary": "Computed minimum target SoC at shift start with 15% safety buffer & degradation wear factors."
        })

        # 4. ChargingAgent
        t0 = time.time()
        charging_out = self.charging_agent.process(fleet_data)
        d4 = round(time.time() - t0, 4)
        agent_telemetry.append({
            "gate": 4,
            "agent": "ChargingAgent",
            "role": self.charging_agent.role,
            "status": "COMPLETED",
            "duration_sec": d4,
            "summary": f"Built 48-slot availability matrices across {len(charging_out['station_grid'])} depot & public stations."
        })

        # 5. CostAgent
        t0 = time.time()
        cost_out = self.cost_agent.process(fleet_data)
        d5 = round(time.time() - t0, 4)
        agent_telemetry.append({
            "gate": 5,
            "agent": "CostAgent",
            "role": self.cost_agent.role,
            "status": "COMPLETED",
            "duration_sec": d5,
            "summary": f"Mapped time-of-day tariff curve (₹{cost_out['min_rate_inr']} - ₹{cost_out['max_rate_inr']}/kWh)."
        })

        # 6. OptimizationAgent
        t0 = time.time()
        opt_out = self.optimization_agent.process(
            fleet_data=fleet_data,
            w_cost=w_cost,
            w_health=w_health,
            w_avail=w_avail,
            time_limit_sec=time_limit_sec,
            time_step_hours=0.5,
            traffic_weather_multiplier=1.10
        )
        d6 = round(time.time() - t0, 4)
        agent_telemetry.append({
            "gate": 6,
            "agent": "OptimizationAgent",
            "role": self.optimization_agent.role,
            "status": "COMPLETED",
            "duration_sec": d6,
            "summary": f"MILP solved ({opt_out['status']}) in {opt_out['solver_duration_sec']}s. Savings: ₹{opt_out['kpis']['savings_inr']} ({opt_out['kpis']['savings_percent']}%)."
        })

        # 7. RecommendationAgent
        t0 = time.time()
        rec_out = self.recommendation_agent.process(
            fleet_data=fleet_data,
            optimization_results=opt_out
        )
        d7 = round(time.time() - t0, 4)
        agent_telemetry.append({
            "gate": 7,
            "agent": "RecommendationAgent",
            "role": self.recommendation_agent.role,
            "status": "COMPLETED",
            "duration_sec": d7,
            "summary": f"Generated plain-language explainability and GIVEN vs ASSUMED provenance for {len(rec_out['explanations'])} vehicles."
        })

        total_duration = round(time.time() - pipeline_start, 3)

        # Merge overall provenance
        overall_provenance = {
            "given": sorted(list(set(
                fleet_out["provenance"]["given"] +
                battery_out["provenance"]["given"] +
                route_out["provenance"]["given"] +
                charging_out["provenance"]["given"] +
                opt_out["provenance"]["given"]
            ))),
            "assumed": sorted(list(set(
                battery_out["provenance"]["assumed"] +
                route_out["provenance"]["assumed"] +
                charging_out["provenance"]["assumed"] +
                cost_out["provenance"]["assumed"] +
                opt_out["provenance"]["assumed"]
            )))
        }

        return {
            "pipeline_status": "SUCCESS",
            "total_duration_sec": total_duration,
            "agent_telemetry": agent_telemetry,
            "weights": {
                "w_cost": w_cost,
                "w_health": w_health,
                "w_avail": w_avail
            },
            "kpis": opt_out["kpis"],
            "schedules": opt_out["schedules"],
            "vehicle_summary": opt_out["vehicle_summary"],
            "explanations": rec_out["explanations"],
            "data_provenance": overall_provenance,
            "naive_baseline": opt_out["naive_baseline"]
        }
