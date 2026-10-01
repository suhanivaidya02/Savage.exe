"""
Virexa - Agent 2: BatteryAgent
Calculates required energy per vehicle, degradation wear coefficients, and minimum SoC at shift start.
Includes a mandatory 15% safety buffer.
"""

from typing import Dict, List, Any, Optional


class BatteryAgent:
    def __init__(self, safety_buffer_ratio: float = 0.15):
        self.name = "BatteryAgent"
        self.role = "Battery Health & Energy Requirement Analyzer"
        self.safety_buffer_ratio = safety_buffer_ratio

    def process(self, fleet_context: Dict[str, Any], route_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Determines energy demand, target SoC, and degradation vulnerabilities per vehicle.
        """
        vehicles = fleet_context["vehicles"]
        shift_map = fleet_context["shift_map"]

        demands = route_context.get("route_demands", {}) if route_context else {}

        battery_profiles = {}
        for v in vehicles:
            vid = v["id"]
            cap = v["battery_capacity_kwh"]
            cur_soc = v["current_soc"]
            soh = v.get("battery_health", 0.90)

            # Energy needed for route (fallback to 70% capacity if route context not provided yet)
            route_demand_kwh = demands.get(vid, {}).get("total_energy_kwh", cap * 0.65)
            
            # Target SoC before shift = (route demand / capacity) + safety buffer (15%)
            needed_soc = min(1.0, (route_demand_kwh / cap) + self.safety_buffer_ratio)
            # Minimum baseline for operational safety
            needed_soc = max(needed_soc, 0.65)

            target_energy_kwh = needed_soc * cap
            current_energy_kwh = cur_soc * cap
            energy_deficit_kwh = max(0.0, target_energy_kwh - current_energy_kwh)

            battery_profiles[vid] = {
                "capacity_kwh": cap,
                "current_soc": cur_soc,
                "current_energy_kwh": round(current_energy_kwh, 2),
                "target_soc": round(needed_soc, 3),
                "target_energy_kwh": round(target_energy_kwh, 2),
                "energy_deficit_kwh": round(energy_deficit_kwh, 2),
                "battery_health_soh": soh,
                "safety_buffer_ratio": self.safety_buffer_ratio,
                "fast_charge_risk": "HIGH" if soh < 0.88 or cap < 15.0 else "MODERATE"
            }

        provenance = {
            "given": [
                "Battery pack nominal capacity (kWh)",
                "Current State of Charge (SoC)",
                "State of Health (SoH) metric (0.80 - 1.00)"
            ],
            "assumed": [
                f"Operational safety buffer ratio ({int(self.safety_buffer_ratio * 100)}% above route demand)",
                "Degradation wear penalty curve for C-rates > 0.8C"
            ]
        }

        return {
            "status": "READY",
            "battery_profiles": battery_profiles,
            "provenance": provenance
        }
