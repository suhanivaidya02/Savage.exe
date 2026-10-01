"""
Virexa - Mathematical Optimization Engine (MILP using PuLP)
Solves multi-objective optimal EV fleet charging and allocation:
Objectives:
  1. Total electricity cost (INR)
  2. Battery health degradation penalty (discouraging fast charge > 0.8C and high cycle wear)
  3. Vehicle availability penalty (ensuring target SoC with 15% safety margin before shift start)
Constraints:
  - Required SoC reached before shift start
  - Station slot capacity limits
  - Charging power limits min(P_vehicle, P_station)
  - No charging during active shifts
  - Station down hours respected
  - Solver time limit <= 10 seconds
"""

import time
from typing import Dict, List, Any
import pulp
from .naive import run_naive_baseline


def solve_fleet_charging(
    fleet_data: Dict[str, Any],
    w_cost: float = 1.0,
    w_health: float = 1.0,
    w_avail: float = 1.0,
    time_limit_sec: int = 10,
    time_step_hours: float = 0.5,
    traffic_weather_multiplier: float = 1.10
) -> Dict[str, Any]:
    """
    Formulates and solves the PuLP MILP optimization problem.
    Uses binary slot allocation x[v, s, t] and continuous energy flow e[v, s, t].
    """
    start_solve_time = time.time()

    vehicles = fleet_data["vehicles"]
    shifts = {s["vehicle_id"]: s for s in fleet_data["shifts"]}
    stations = fleet_data["stations"]
    tariff_dict = {t["hour"]: t["rate_inr_per_kwh"] for t in fleet_data["tariff"]}

    total_slots = int(24 / time_step_hours)  # 48 slots

    # Sets
    V = [v["id"] for v in vehicles]
    S = [s["id"] for s in stations]
    T = list(range(total_slots))

    v_map = {v["id"]: v for v in vehicles}
    s_map = {s["id"]: s for s in stations}

    # Precalculate vehicle energy requirements and shift slots
    required_energy_pre_shift = {}
    target_soc = {}
    shift_slots = {}
    pre_shift_slots = {}

    for v in vehicles:
        vid = v["id"]
        cap = v["battery_capacity_kwh"]
        cur_soc = v["current_soc"]
        shift = shifts.get(vid)

        if shift:
            start_h = shift["start_hour"]
            end_h = shift["end_hour"]
            planned_km = shift["planned_km"]
            load_factor = shift["load_factor"]
            kwh_per_km = v["kwh_per_km"]

            # Route demand calculation with load factor and traffic multiplier
            shift_demand_kwh = planned_km * kwh_per_km * (1.0 + 0.15 * (load_factor - 0.70)) * traffic_weather_multiplier
            
            # Required SoC before shift start: energy demand / capacity + 15% safety buffer
            needed_soc = min(1.0, (shift_demand_kwh / cap) + 0.15)
            # Ensure at least 65% SoC for fleet resilience
            needed_soc = max(needed_soc, 0.65)
            target_soc[vid] = round(needed_soc, 3)

            # Energy needed to reach target SoC
            current_energy = cur_soc * cap
            target_energy = needed_soc * cap
            energy_deficit = max(0.0, target_energy - current_energy)
            required_energy_pre_shift[vid] = energy_deficit

            # Time slot mapping
            start_slot = int(start_h / time_step_hours)
            end_slot = int(end_h / time_step_hours)
            shift_slots[vid] = set(range(start_slot, end_slot))
            pre_shift_slots[vid] = set(range(0, start_slot))
        else:
            target_soc[vid] = 0.80
            required_energy_pre_shift[vid] = max(0.0, (0.80 - cur_soc) * cap)
            shift_slots[vid] = set()
            pre_shift_slots[vid] = set(T)

    # Effective charging power and C-rate for each pair (v, s)
    p_eff = {}
    c_rate = {}
    degradation_coeff = {}

    for vid in V:
        v = v_map[vid]
        cap = v["battery_capacity_kwh"]
        v_max = v["max_charge_kw"]
        soh = v.get("battery_health", 0.90)

        for sid in S:
            st = s_map[sid]
            power = min(v_max, st["max_power_kw"])
            p_eff[(vid, sid)] = power
            crate = power / cap
            c_rate[(vid, sid)] = crate

            # Battery degradation penalty:
            # Fast charge (> 0.8C) damages battery.
            # Degraded batteries (SoH < 0.9) suffer more wear.
            wear_factor = (1.0 / max(0.70, soh))
            if crate > 0.8:
                fast_pen = (crate - 0.8) * 8.0
            else:
                fast_pen = crate * 0.2
            degradation_coeff[(vid, sid)] = round(fast_pen * wear_factor, 3)

    # 1. PuLP Model Definition
    model = pulp.LpProblem("Virexa_Fleet_Optimization", pulp.LpMinimize)

    # 2. Decision Variables
    # x[v, s, t]: binary variable whether vehicle v occupies station s at slot t
    x = {
        (vid, sid, t): pulp.LpVariable(f"x_{vid}_{sid}_{t}", cat=pulp.LpBinary)
        for vid in V for sid in S for t in T
    }

    # e[v, s, t]: continuous energy charged (kWh) during slot t
    e = {
        (vid, sid, t): pulp.LpVariable(f"e_{vid}_{sid}_{t}", lowBound=0, cat=pulp.LpContinuous)
        for vid in V for sid in S for t in T
    }

    # Unavailability slack variable (deficit in kWh)
    unavail_slack = {
        vid: pulp.LpVariable(f"unavail_{vid}", lowBound=0, cat=pulp.LpContinuous)
        for vid in V
    }

    # 3. Objective Function Terms
    cost_terms = []
    health_terms = []
    avail_terms = []

    for vid in V:
        for sid in S:
            for t in T:
                hour = int(t * time_step_hours)
                tariff = tariff_dict.get(hour, 8.0)

                # Electricity cost: actual kWh charged * INR/kWh
                cost_terms.append(e[(vid, sid, t)] * tariff)

                # Battery health degradation penalty
                health_terms.append(e[(vid, sid, t)] * degradation_coeff[(vid, sid)])

        # Availability shortfall penalty (heavy penalty to prioritize shift readiness)
        avail_terms.append(unavail_slack[vid] * 150.0)

    total_cost_expr = pulp.lpSum(cost_terms)
    total_health_expr = pulp.lpSum(health_terms)
    total_avail_expr = pulp.lpSum(avail_terms)

    model += (
        w_cost * total_cost_expr +
        w_health * total_health_expr +
        w_avail * total_avail_expr,
        "Total_Multi_Objective"
    )

    # 4. Constraints

    # Constraint A: Energy upper bounded by charger power when slot is occupied
    for vid in V:
        for sid in S:
            max_e_slot = p_eff[(vid, sid)] * time_step_hours
            for t in T:
                model += (
                    e[(vid, sid, t)] <= max_e_slot * x[(vid, sid, t)],
                    f"Power_Cap_{vid}_{sid}_{t}"
                )

    # Constraint B: At most 1 station per vehicle at any time slot
    for vid in V:
        for t in T:
            model += (
                pulp.lpSum(x[(vid, sid, t)] for sid in S) <= 1,
                f"Single_Station_{vid}_{t}"
            )

    # Constraint C: Station slot capacity limits & down hours
    for sid in S:
        st = s_map[sid]
        max_slots = st["slots"]
        down_hours = set(st.get("down_hours", []))

        for t in T:
            hour = int(t * time_step_hours)
            if hour in down_hours:
                # Station is down: capacity is 0
                model += (
                    pulp.lpSum(x[(vid, sid, t)] for vid in V) == 0,
                    f"Station_Down_{sid}_{t}"
                )
            else:
                model += (
                    pulp.lpSum(x[(vid, sid, t)] for vid in V) <= max_slots,
                    f"Station_Capacity_{sid}_{t}"
                )

    # Constraint D: No charging during active shifts
    for vid in V:
        for t in shift_slots[vid]:
            for sid in S:
                model += (
                    x[(vid, sid, t)] == 0,
                    f"No_Charge_On_Shift_{vid}_{sid}_{t}"
                )

    # Constraint E: Required energy before shift start (with availability slack)
    for vid in V:
        req_energy = required_energy_pre_shift[vid]
        pre_slots = pre_shift_slots[vid]
        if req_energy > 0 and pre_slots:
            energy_charged_pre = pulp.lpSum(
                e[(vid, sid, t)]
                for sid in S
                for t in pre_slots
            )
            model += (
                energy_charged_pre + unavail_slack[vid] >= req_energy,
                f"Shift_Readiness_{vid}"
            )
        else:
            model += unavail_slack[vid] == 0, f"No_Deficit_{vid}"

    # Constraint F: Max battery capacity limit (cannot exceed 100% SoC before shift)
    for vid in V:
        v = v_map[vid]
        cap = v["battery_capacity_kwh"]
        cur_soc = v["current_soc"]
        max_chargeable_pre = max(0.0, (1.0 - cur_soc) * cap)
        pre_slots = pre_shift_slots[vid]

        if pre_slots:
            model += (
                pulp.lpSum(
                    e[(vid, sid, t)]
                    for sid in S
                    for t in pre_slots
                ) <= max_chargeable_pre,
                f"Battery_Capacity_Pre_{vid}"
            )

    # 5. Solve with CBC solver and strict time limit
    solver = pulp.PULP_CBC_CMD(timeLimit=time_limit_sec, msg=False)
    status = model.solve(solver)
    status_str = pulp.LpStatus[status]
    solve_duration = time.time() - start_solve_time

    # 6. Extract Optimized Schedules and Metrics
    optimized_schedules = {vid: [] for vid in V}
    vehicle_summary = {}
    total_opt_cost = 0.0
    total_opt_energy = 0.0
    fast_charge_count = 0
    ready_on_time_count = 0

    for vid in V:
        v = v_map[vid]
        cap = v["battery_capacity_kwh"]
        cur_soc = v["current_soc"]
        v_cost = 0.0
        v_energy = 0.0
        v_events = []

        pre_charged = 0.0
        pre_slots = pre_shift_slots[vid]

        for t in T:
            for sid in S:
                x_val = pulp.value(x[(vid, sid, t)])
                e_val = pulp.value(e[(vid, sid, t)])

                if x_val is not None and x_val > 0.5 and e_val is not None and e_val > 0.01:
                    hour = int(t * time_step_hours)
                    tariff = tariff_dict.get(hour, 8.0)
                    cost = e_val * tariff
                    crate = c_rate[(vid, sid)]

                    v_cost += cost
                    v_energy += e_val
                    total_opt_cost += cost
                    total_opt_energy += e_val

                    if t in pre_slots:
                        pre_charged += e_val

                    if crate > 0.8:
                        fast_charge_count += 1

                    v_events.append({
                        "slot": t,
                        "hour": hour,
                        "time_str": f"{hour:02d}:{'30' if t % 2 == 1 else '00'}",
                        "station_id": sid,
                        "station_name": s_map[sid]["name"],
                        "power_kw": round(e_val / time_step_hours, 2),
                        "energy_kwh": round(e_val, 3),
                        "tariff_rate": tariff,
                        "cost_inr": round(cost, 2),
                        "c_rate": round(crate, 2)
                    })

        soc_at_shift_start = min(1.0, cur_soc + (pre_charged / cap))
        target = target_soc[vid]
        is_ready = (soc_at_shift_start >= target - 0.01)
        if is_ready:
            ready_on_time_count += 1

        optimized_schedules[vid] = v_events
        vehicle_summary[vid] = {
            "id": vid,
            "name": v["name"],
            "type": v["type"],
            "initial_soc": cur_soc,
            "target_soc": target,
            "soc_at_shift_start": round(soc_at_shift_start, 2),
            "energy_charged_kwh": round(v_energy, 2),
            "charging_cost_inr": round(v_cost, 2),
            "ready_on_time": is_ready,
            "charging_events_count": len(v_events)
        }

    # 7. Run Naive Baseline Comparison
    naive_results = run_naive_baseline(fleet_data, time_step_hours)
    naive_cost = naive_results["total_cost_inr"]
    savings_inr = round(max(0.0, naive_cost - total_opt_cost), 2)
    savings_percent = round((savings_inr / max(1.0, naive_cost)) * 100.0, 1)

    return {
        "status": status_str,
        "solver_duration_sec": round(solve_duration, 3),
        "weights": {
            "w_cost": w_cost,
            "w_health": w_health,
            "w_avail": w_avail
        },
        "kpis": {
            "total_optimized_cost_inr": round(total_opt_cost, 2),
            "naive_cost_inr": round(naive_cost, 2),
            "savings_inr": savings_inr,
            "savings_percent": savings_percent,
            "total_energy_kwh": round(total_opt_energy, 2),
            "avg_cost_per_kwh": round(total_opt_cost / max(1.0, total_opt_energy), 2),
            "ready_on_time_pct": round((ready_on_time_count / len(V)) * 100.0, 1),
            "fast_charge_degradations_prevented": max(0, naive_results["fast_charge_degradations"] - fast_charge_count)
        },
        "schedules": optimized_schedules,
        "vehicle_summary": vehicle_summary,
        "naive_baseline": naive_results
    }
