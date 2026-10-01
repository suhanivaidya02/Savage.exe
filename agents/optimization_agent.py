"""
Virexa - Agent 6: OptimizationAgent (Strictly Algorithmic / NO LLM)
Executes the PuLP Mixed-Integer Linear Program (MILP) to find the globally optimal
schedule balancing cost, battery health, and operational readiness.
"""

from typing import Dict, List, Any
from optimizer.engine import solve_fleet_charging


class OptimizationAgent:
    def __init__(self):
        self.name = "OptimizationAgent"
        self.role = "Mathematical MILP Optimizer"

    def process(
        self,
        fleet_data: Dict[str, Any],
        w_cost: float = 1.0,
        w_health: float = 1.0,
        w_avail: float = 1.0,
        time_limit_sec: int = 10,
        time_step_hours: float = 0.5,
        traffic_weather_multiplier: float = 1.10
    ) -> Dict[str, Any]:
        """
        Executes the deterministic mathematical optimizer.
        """
        result = solve_fleet_charging(
            fleet_data=fleet_data,
            w_cost=w_cost,
            w_health=w_health,
            w_avail=w_avail,
            time_limit_sec=time_limit_sec,
            time_step_hours=time_step_hours,
            traffic_weather_multiplier=traffic_weather_multiplier
        )

        provenance = {
            "given": [
                "Vehicle battery capacities and max charging power",
                "Shift operating windows (no-charge periods)",
                "Station charging slots and physical power limits"
            ],
            "assumed": [
                f"Multi-objective tradeoff weights (Cost: {w_cost}, Health: {w_health}, Availability: {w_avail})",
                "Battery degradation penalty coefficient for C-rate > 0.8C",
                "Linear energy transfer within 30-minute discretization steps"
            ]
        }

        return {
            "status": result["status"],
            "solver_duration_sec": result["solver_duration_sec"],
            "weights": result["weights"],
            "kpis": result["kpis"],
            "schedules": result["schedules"],
            "vehicle_summary": result["vehicle_summary"],
            "naive_baseline": result["naive_baseline"],
            "provenance": provenance
        }
