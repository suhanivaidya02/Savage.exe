"""
Virexa - Replan & What-If Disruption Engine
Handles real-time fleet disruptions:
  1. Vehicle breakdown (vehicle removed from service/charging)
  2. Tariff spike (unforeseen price surge in specified time window)
  3. Station outage (charging hub offline for N hours)
  4. Longer route (extended delivery route / traffic detour)
Calculates high-fidelity diff vs previous plan (vehicles moved, cost delta, availability delta)
and flags plans requiring human-in-the-loop approval.
"""

import copy
from typing import Dict, List, Any, Optional
from agents.pipeline import VirexaPipeline


def compute_schedule_diff(
    old_plan: Dict[str, Any],
    new_plan: Dict[str, Any],
    disruption_info: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Compares two optimization plans and calculates detailed diff metrics.
    """
    old_kpis = old_plan.get("kpis", {})
    new_kpis = new_plan.get("kpis", {})

    old_cost = old_kpis.get("total_optimized_cost_inr", 0.0)
    new_cost = new_kpis.get("total_optimized_cost_inr", 0.0)
    cost_delta = round(new_cost - old_cost, 2)
    cost_delta_pct = round(((new_cost - old_cost) / max(1.0, old_cost)) * 100, 1)

    old_ready = old_kpis.get("ready_on_time_pct", 100.0)
    new_ready = new_kpis.get("ready_on_time_pct", 100.0)
    ready_delta = round(new_ready - old_ready, 1)

    old_schedules = old_plan.get("schedules", {})
    new_schedules = new_plan.get("schedules", {})

    vehicles_moved = []
    vehicle_diffs = []

    all_vids = sorted(list(set(list(old_schedules.keys()) + list(new_schedules.keys()))))

    for vid in all_vids:
        old_evs = old_schedules.get(vid, [])
        new_evs = new_schedules.get(vid, [])

        old_slots = {(ev["slot"], ev["station_id"]) for ev in old_evs}
        new_slots = {(ev["slot"], ev["station_id"]) for ev in new_evs}

        old_kwh = round(sum(ev.get("energy_kwh", 0) for ev in old_evs), 2)
        new_kwh = round(sum(ev.get("energy_kwh", 0) for ev in new_evs), 2)

        has_slot_change = (old_slots != new_slots)
        has_kwh_change = abs(old_kwh - new_kwh) > 0.1

        if has_slot_change or has_kwh_change:
            vehicles_moved.append(vid)

            # Details
            old_stations = sorted(list({ev["station_name"] for ev in old_evs}))
            new_stations = sorted(list({ev["station_name"] for ev in new_evs}))

            vehicle_diffs.append({
                "vehicle_id": vid,
                "change_type": "REALLOCATED" if new_evs else "SUSPENDED",
                "old_charging_slots": len(old_evs),
                "new_charging_slots": len(new_evs),
                "old_energy_kwh": old_kwh,
                "new_energy_kwh": new_kwh,
                "energy_delta_kwh": round(new_kwh - old_kwh, 2),
                "old_stations": old_stations,
                "new_stations": new_stations
            })

    # Human-in-the-loop approval rule:
    # Any major disruption or reallocation of >1 vehicle or cost delta > ₹50 requires manual approval
    requires_approval = (
        len(vehicles_moved) > 0 or
        abs(cost_delta) > 50.0 or
        ready_delta < 0
    )

    approval_status = "PENDING_APPROVAL" if requires_approval else "AUTO_APPROVED"

    return {
        "disruption": disruption_info,
        "approval_status": approval_status,
        "requires_approval": requires_approval,
        "cost_delta_inr": cost_delta,
        "cost_delta_percent": cost_delta_pct,
        "availability_delta_percent": ready_delta,
        "vehicles_moved_count": len(vehicles_moved),
        "vehicles_moved": vehicles_moved,
        "vehicle_diffs": vehicle_diffs,
        "old_kpis": old_kpis,
        "new_kpis": new_kpis
    }


def apply_disruption_and_replan(
    base_fleet_data: Dict[str, Any],
    previous_plan: Dict[str, Any],
    disruption_type: str,
    params: Dict[str, Any],
    pipeline: Optional[VirexaPipeline] = None,
    weights: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Applies disruption to fleet data and re-runs the multi-agent pipeline.
    Disruption Types:
      - 'vehicle_breakdown': params={'vehicle_id': 'V03'}
      - 'tariff_spike': params={'start_hour': 10, 'end_hour': 15, 'multiplier': 2.5}
      - 'station_down': params={'station_id': 'S1', 'duration_hours': 4, 'start_hour': 0}
      - 'longer_route': params={'vehicle_id': 'V07', 'extra_km': 35}
    """
    if pipeline is None:
        pipeline = VirexaPipeline()

    w = weights or previous_plan.get("weights", {"w_cost": 1.0, "w_health": 1.0, "w_avail": 1.0})
    disrupted_fleet = copy.deepcopy(base_fleet_data)
    disruption_summary = ""

    # Disruption A: Vehicle Breakdown
    if disruption_type == "vehicle_breakdown":
        vid = params.get("vehicle_id", "V03")
        # Remove vehicle from active vehicles or set current_soc to 0 and shift km to 0
        disrupted_fleet["vehicles"] = [v for v in disrupted_fleet["vehicles"] if v["id"] != vid]
        disrupted_fleet["shifts"] = [s for s in disrupted_fleet["shifts"] if s["vehicle_id"] != vid]
        disruption_summary = f"Mechanical breakdown reported on {vid}. Vehicle pulled from service and quarantined from charging bays."

    # Disruption B: Tariff Spike
    elif disruption_type == "tariff_spike":
        start_h = int(params.get("start_hour", 10))
        end_h = int(params.get("end_hour", 16))
        multiplier = float(params.get("multiplier", 2.0))
        for t in disrupted_fleet["tariff"]:
            if start_h <= t["hour"] < end_h:
                t["rate_inr_per_kwh"] = round(t["rate_inr_per_kwh"] * multiplier, 2)
                t["tier"] = "SURGE PRICING"
        disruption_summary = f"Grid peak event: {multiplier}x tariff surge between {start_h:02d}:00 and {end_h:02d}:00."

    # Disruption C: Station Outage
    elif disruption_type == "station_down":
        sid = params.get("station_id", "S1")
        duration = int(params.get("duration_hours", 4))
        start_h = int(params.get("start_hour", 0))
        end_h = min(24, start_h + duration)
        down_range = list(range(start_h, end_h))

        for st in disrupted_fleet["stations"]:
            if st["id"] == sid:
                st["down_hours"] = sorted(list(set(st.get("down_hours", []) + down_range)))
        disruption_summary = f"Hardware failure at Station {sid}. Off-line from {start_h:02d}:00 to {end_h:02d}:00 ({duration} hrs)."

    # Disruption D: Longer Route
    elif disruption_type == "longer_route":
        vid = params.get("vehicle_id", "V07")
        extra_km = float(params.get("extra_km", 40.0))
        for s in disrupted_fleet["shifts"]:
            if s["vehicle_id"] == vid:
                s["planned_km"] = round(s["planned_km"] + extra_km, 1)
        disruption_summary = f"Unscheduled route extension for {vid}: added +{extra_km} km due to traffic diversions."

    else:
        disruption_summary = f"Unknown disruption type '{disruption_type}'. Re-running standard baseline."

    # Execute Pipeline on disrupted scenario
    new_plan = pipeline.run(
        fleet_data=disrupted_fleet,
        w_cost=w.get("w_cost", 1.0),
        w_health=w.get("w_health", 1.0),
        w_avail=w.get("w_avail", 1.0)
    )

    disruption_info = {
        "type": disruption_type,
        "params": params,
        "summary": disruption_summary
    }

    # Compute DIFF vs previous plan
    diff = compute_schedule_diff(previous_plan, new_plan, disruption_info)

    return {
        "status": diff["approval_status"],
        "disrupted_fleet_data": disrupted_fleet,
        "new_plan": new_plan,
        "diff": diff
    }
