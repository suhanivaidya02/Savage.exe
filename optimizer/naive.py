"""
Virexa - Naive Charging Baseline
Simulates the standard unmanaged charging behavior:
Every vehicle begins charging immediately at t=0 at the first available station until fully charged,
ignoring time-of-day tariffs, solar windows, and battery health degradation.
"""

from typing import Dict, List, Any


def run_naive_baseline(
    fleet_data: Dict[str, Any],
    time_step_hours: float = 0.5
) -> Dict[str, Any]:
    """
    Computes naive charging schedule and metrics.
    Rule:
    - Each vehicle with SoC < 1.0 attempts to charge immediately starting at slot 0.
    - If vehicle has a shift at slot t, it cannot charge during shift.
    - Station slot limits and station down hours are respected.
    - Charges until target 100% SoC is reached.
    """
    vehicles = fleet_data["vehicles"]
    shifts = {s["vehicle_id"]: s for s in fleet_data["shifts"]}
    stations = fleet_data["stations"]
    tariff = {t["hour"]: t["rate_inr_per_kwh"] for t in fleet_data["tariff"]}

    total_slots = int(24 / time_step_hours)  # 48 slots

    # Track station occupancy per slot: station_id -> list of vehicle count per slot
    station_occupancy = {s["id"]: [0] * total_slots for s in stations}
    station_map = {s["id"]: s for s in stations}

    # Station priority for naive: Depot Main (S1), Depot Solar (S2), Public Fast (S3)
    station_priority = ["S1", "S2", "S3"]

    vehicle_schedules = {v["id"]: [] for v in vehicles}
    vehicle_soc = {v["id"]: v["current_soc"] for v in vehicles}
    total_naive_cost = 0.0
    total_energy_charged = 0.0
    degradation_events = 0
    vehicle_metrics = {}

    for v in vehicles:
        vid = v["id"]
        v_type = v["type"]
        cap = v["battery_capacity_kwh"]
        max_v_kw = v["max_charge_kw"]
        current_soc = v["current_soc"]
        shift = shifts.get(vid)
        shift_start = shift["start_hour"] if shift else 24
        shift_end = shift["end_hour"] if shift else 24

        needed_energy = max(0.0, (1.0 - current_soc) * cap)
        charged_so_far = 0.0
        v_cost = 0.0
        v_schedule = []

        for slot in range(total_slots):
            hour = int(slot * time_step_hours)

            # Check if vehicle is on shift
            if shift and (shift_start <= hour < shift_end):
                # Vehicle is operating, discharge battery
                continue

            if charged_so_far >= needed_energy - 1e-4:
                # Fully charged
                break

            # Find first available station
            chosen_station = None
            for sid in station_priority:
                st = station_map[sid]
                # Check down hours
                if hour in st.get("down_hours", []):
                    continue
                # Check slot capacity
                if station_occupancy[sid][slot] < st["slots"]:
                    chosen_station = st
                    break

            if chosen_station:
                sid = chosen_station["id"]
                charge_power = min(max_v_kw, chosen_station["max_power_kw"])
                energy_kwh = charge_power * time_step_hours
                # Don't overcharge
                energy_kwh = min(energy_kwh, needed_energy - charged_so_far)

                charged_so_far += energy_kwh
                rate = tariff.get(hour, 8.0)
                slot_cost = energy_kwh * rate
                v_cost += slot_cost
                total_naive_cost += slot_cost
                total_energy_charged += energy_kwh
                station_occupancy[sid][slot] += 1

                # Fast charge degradation check (> 0.8C)
                c_rate = charge_power / cap
                if c_rate > 0.8:
                    degradation_events += 1

                v_schedule.append({
                    "slot": slot,
                    "hour": hour,
                    "time_str": f"{hour:02d}:{'30' if slot % 2 == 1 else '00'}",
                    "station_id": sid,
                    "power_kw": charge_power,
                    "energy_kwh": round(energy_kwh, 3),
                    "tariff_rate": rate,
                    "cost_inr": round(slot_cost, 2),
                    "c_rate": round(c_rate, 2)
                })

        final_soc = min(1.0, current_soc + (charged_so_far / cap))
        vehicle_metrics[vid] = {
            "initial_soc": current_soc,
            "final_soc": round(final_soc, 2),
            "energy_charged_kwh": round(charged_so_far, 2),
            "charging_cost_inr": round(v_cost, 2),
            "charging_slots_count": len(v_schedule)
        }
        vehicle_schedules[vid] = v_schedule

    return {
        "strategy": "Naive (Immediate Plug-in)",
        "total_cost_inr": round(total_naive_cost, 2),
        "total_energy_kwh": round(total_energy_charged, 2),
        "avg_cost_per_kwh": round(total_naive_cost / max(1.0, total_energy_charged), 2),
        "fast_charge_degradations": degradation_events,
        "vehicle_metrics": vehicle_metrics,
        "schedules": vehicle_schedules
    }
