"""
Virexa - Agent 4: ChargingAgent
Builds high-resolution station availability grids over 24 hours (48 slots of 30 mins),
incorporating station power limits, bay/slot limits, and maintenance down-hours.
"""

from typing import Dict, List, Any


class ChargingAgent:
    def __init__(self, time_step_hours: float = 0.5):
        self.name = "ChargingAgent"
        self.role = "Charging Infrastructure & Grid Manager"
        self.time_step_hours = time_step_hours
        self.total_slots = int(24 / time_step_hours)

    def process(self, fleet_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates 48-slot availability and capacity matrices for all charging stations.
        """
        stations = fleet_data.get("stations", [])

        station_grid = {}
        total_capacity_kwh_day = 0.0

        for st in stations:
            sid = st["id"]
            slots = st["slots"]
            power_kw = st["max_power_kw"]
            down_hours = set(st.get("down_hours", []))

            slot_availability = []
            for slot_idx in range(self.total_slots):
                hour = int(slot_idx * self.time_step_hours)
                is_down = hour in down_hours
                available_slots = 0 if is_down else slots
                max_energy_slot = available_slots * power_kw * self.time_step_hours

                if not is_down:
                    total_capacity_kwh_day += max_energy_slot

                slot_availability.append({
                    "slot": slot_idx,
                    "hour": hour,
                    "time_str": f"{hour:02d}:{'30' if slot_idx % 2 == 1 else '00'}",
                    "available_slots": available_slots,
                    "is_down": is_down,
                    "max_power_kw": power_kw,
                    "max_slot_energy_kwh": round(max_energy_slot, 2)
                })

            station_grid[sid] = {
                "station_id": sid,
                "name": st["name"],
                "type": st["type"],
                "slots": slots,
                "max_power_kw": power_kw,
                "down_hours": sorted(list(down_hours)),
                "location": st.get("location", "Depot"),
                "availability": slot_availability
            }

        provenance = {
            "given": [
                "Charging station slot capacities (S1: 6 slots, S2: 4 slots, S3: 2 slots)",
                "Station rated charging power (7.2 kW AC, 22 kW DC Fast)",
                "Depot geographical hubs and hardware types"
            ],
            "assumed": [
                "Scheduled station maintenance downtime windows",
                "Constant grid line voltage and power factor = 1.0"
            ]
        }

        return {
            "status": "READY",
            "total_slots": self.total_slots,
            "time_step_hours": self.time_step_hours,
            "station_grid": station_grid,
            "total_depot_daily_capacity_kwh": round(total_capacity_kwh_day, 2),
            "provenance": provenance
        }
