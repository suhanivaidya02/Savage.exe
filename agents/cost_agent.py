"""
Virexa - Agent 5: CostAgent
Manages Time-of-Day (ToD) tariffs, electricity pricing schedules, and slot-by-slot economic signals.
"""

from typing import Dict, List, Any


class CostAgent:
    def __init__(self, time_step_hours: float = 0.5):
        self.name = "CostAgent"
        self.role = "Energy Economics & Tariff Strategist"
        self.time_step_hours = time_step_hours
        self.total_slots = int(24 / time_step_hours)

    def process(self, fleet_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parses 24-hour tariff schedule and produces 30-min slot pricing curves with tier analytics.
        """
        hourly_tariff = fleet_data.get("tariff", [])
        tariff_map = {t["hour"]: t for t in hourly_tariff}

        slot_costs = []
        tier_counts = {}

        for slot_idx in range(self.total_slots):
            hour = int(slot_idx * self.time_step_hours)
            t_info = tariff_map.get(hour, {
                "rate_inr_per_kwh": 8.0,
                "tier": "Standard Normal"
            })
            rate = t_info["rate_inr_per_kwh"]
            tier = t_info["tier"]

            tier_counts[tier] = tier_counts.get(tier, 0) + 1

            slot_costs.append({
                "slot": slot_idx,
                "hour": hour,
                "time_str": f"{hour:02d}:{'30' if slot_idx % 2 == 1 else '00'}",
                "rate_inr_per_kwh": rate,
                "tier": tier,
                "relative_cost_factor": round(rate / 5.0, 2)  # Relative to off-peak cheapest rate
            })

        min_rate = min(t["rate_inr_per_kwh"] for t in hourly_tariff) if hourly_tariff else 5.0
        max_rate = max(t["rate_inr_per_kwh"] for t in hourly_tariff) if hourly_tariff else 11.0
        avg_rate = round(sum(t["rate_inr_per_kwh"] for t in hourly_tariff) / max(1, len(hourly_tariff)), 2) if hourly_tariff else 7.5

        provenance = {
            "given": [],
            "assumed": [
                "Time-of-Day (ToD) hourly tariff structure in INR/kWh",
                "Off-peak night rate: ₹5.00/kWh (00:00 - 06:00)",
                "Solar generation rate: ₹6.00/kWh (10:00 - 16:00)",
                "Standard normal rate: ₹8.00/kWh",
                "Evening peak grid stress rate: ₹11.00/kWh (18:00 - 22:00)"
            ]
        }

        return {
            "status": "READY",
            "min_rate_inr": min_rate,
            "max_rate_inr": max_rate,
            "avg_rate_inr": avg_rate,
            "peak_to_offpeak_spread_pct": round(((max_rate - min_rate) / min_rate) * 100, 1),
            "tier_distribution_slots": tier_counts,
            "slot_pricing": slot_costs,
            "provenance": provenance
        }
