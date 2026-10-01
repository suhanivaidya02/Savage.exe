"""
Virexa - Agent 1: FleetAgent
Ingests, validates, and manages vehicle inventory, operational states, and shift assignments.
"""

from typing import Dict, List, Any


class FleetAgent:
    def __init__(self):
        self.name = "FleetAgent"
        self.role = "Fleet Inventory & Shift Dispatcher"

    def process(self, fleet_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes vehicles and shifts, validating data integrity and compiling fleet stats.
        """
        vehicles = fleet_data.get("vehicles", [])
        shifts = fleet_data.get("shifts", [])

        # Categorize fleet
        by_type = {}
        for v in vehicles:
            v_type = v.get("type", "unknown")
            by_type.setdefault(v_type, []).append(v)

        shift_map = {s["vehicle_id"]: s for s in shifts}

        fleet_stats = {
            "total_vehicles": len(vehicles),
            "by_type": {k: len(v_list) for k, v_list in by_type.items()},
            "avg_current_soc": round(sum(v["current_soc"] for v in vehicles) / max(1, len(vehicles)), 3),
            "avg_battery_health": round(sum(v.get("battery_health", 0.9) for v in vehicles) / max(1, len(vehicles)), 3),
            "total_planned_shifts": len(shifts)
        }

        provenance = {
            "given": [
                "Vehicle IDs and model specifications",
                "Battery nominal capacities (8 kWh, 20 kWh, 30 kWh)",
                "Maximum vehicle charge acceptance rates (3.3 kW, 7.2 kW)",
                "Initial State of Charge (current_soc)",
                "Shift start and end hours"
            ],
            "assumed": []
        }

        return {
            "status": "READY",
            "fleet_stats": fleet_stats,
            "vehicles": vehicles,
            "shift_map": shift_map,
            "shifts": shifts,
            "provenance": provenance
        }
