"""
Virexa - Agent 3: RouteAgent
Calculates dynamic route energy consumption based on planned kilometers, vehicle efficiency (kWh/km),
load factors, and assumed traffic/weather multipliers.
"""

from typing import Dict, List, Any


class RouteAgent:
    def __init__(self, traffic_weather_multiplier: float = 1.10):
        self.name = "RouteAgent"
        self.role = "Route Consumption & Demand Forecaster"
        self.traffic_weather_multiplier = traffic_weather_multiplier

    def process(self, fleet_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Computes energy requirements for all scheduled vehicle routes.
        Formula:
          Demand = planned_km * kwh_per_km * (1.0 + 0.15 * (load_factor - 0.70)) * traffic_weather_multiplier
        """
        vehicles = {v["id"]: v for v in fleet_context["vehicles"]}
        shifts = fleet_context.get("shifts", [])

        route_demands = {}
        for s in shifts:
            vid = s["vehicle_id"]
            v = vehicles.get(vid)
            if not v:
                continue

            planned_km = s["planned_km"]
            load_factor = s.get("load_factor", 0.80)
            base_kwh_per_km = v.get("kwh_per_km", 0.20)

            # Load penalty: heavier loads increase consumption above 70% baseline
            load_modifier = 1.0 + 0.15 * (load_factor - 0.70)
            total_kwh = planned_km * base_kwh_per_km * load_modifier * self.traffic_weather_multiplier

            route_demands[vid] = {
                "vehicle_id": vid,
                "shift_name": s.get("shift_name", "Standard Shift"),
                "start_hour": s["start_hour"],
                "end_hour": s["end_hour"],
                "planned_km": planned_km,
                "load_factor": load_factor,
                "base_kwh_per_km": base_kwh_per_km,
                "effective_kwh_per_km": round(base_kwh_per_km * load_modifier * self.traffic_weather_multiplier, 3),
                "total_energy_kwh": round(total_kwh, 2),
                "traffic_weather_multiplier": self.traffic_weather_multiplier
            }

        provenance = {
            "given": [
                "Planned route distance (km)",
                "Vehicle base consumption rate (kWh/km)",
                "Cargo / passenger load factor (0.60 - 1.00)"
            ],
            "assumed": [
                f"Traffic & weather congestion multiplier ({self.traffic_weather_multiplier}x)",
                "Load factor sensitivity slope (+15% per 100% load delta above baseline)"
            ]
        }

        return {
            "status": "READY",
            "route_demands": route_demands,
            "provenance": provenance
        }
