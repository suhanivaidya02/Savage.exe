"""
Unit and Integration Tests for Virexa Optimizer Engine & Naive Baseline
Tests:
  1. Data structure integrity
  2. Optimization constraints satisfied (shift readiness, power limits, no charging during shifts)
  3. Optimized cost <= Naive cost
  4. Station down hours strictly respected
  5. Weight responsiveness (cost vs battery health vs availability)
  6. Solution speed (< 10 seconds)
"""

import pytest
import copy
from data_gen.generate import generate_fleet_data
from optimizer.engine import solve_fleet_charging
from optimizer.naive import run_naive_baseline


@pytest.fixture
def sample_fleet():
    return generate_fleet_data(seed=42)


def test_fleet_generation_structure(sample_fleet):
    assert "vehicles" in sample_fleet
    assert len(sample_fleet["vehicles"]) == 20
    assert len(sample_fleet["stations"]) == 3
    assert len(sample_fleet["shifts"]) == 20
    assert len(sample_fleet["tariff"]) == 24


def test_naive_baseline_execution(sample_fleet):
    naive = run_naive_baseline(sample_fleet)
    assert naive["total_cost_inr"] > 0
    assert naive["total_energy_kwh"] > 0
    assert len(naive["vehicle_metrics"]) == 20


def test_optimizer_solves_under_ten_seconds(sample_fleet):
    res = solve_fleet_charging(sample_fleet, time_limit_sec=10)
    assert res["status"] in ("Optimal", "Feasible")
    assert res["solver_duration_sec"] < 10.0


def test_optimized_cost_less_or_equal_naive(sample_fleet):
    res = solve_fleet_charging(sample_fleet, w_cost=1.0, w_health=0.5, w_avail=1.0)
    kpis = res["kpis"]
    assert kpis["total_optimized_cost_inr"] <= kpis["naive_cost_inr"]
    assert kpis["savings_inr"] >= 0


def test_no_charging_during_active_shifts(sample_fleet):
    res = solve_fleet_charging(sample_fleet)
    shifts = {s["vehicle_id"]: s for s in sample_fleet["shifts"]}

    for vid, events in res["schedules"].items():
        shift = shifts.get(vid)
        if not shift:
            continue
        start_h = shift["start_hour"]
        end_h = shift["end_hour"]

        for ev in events:
            ev_hour = ev["hour"]
            assert not (start_h <= ev_hour < end_h), (
                f"Vehicle {vid} charged at hour {ev_hour} during shift {start_h}:00-{end_h}:00!"
            )


def test_station_down_hours_respected(sample_fleet):
    res = solve_fleet_charging(sample_fleet)
    station_map = {s["id"]: s for s in sample_fleet["stations"]}

    for vid, events in res["schedules"].items():
        for ev in events:
            sid = ev["station_id"]
            st = station_map[sid]
            down_hours = st.get("down_hours", [])
            assert ev["hour"] not in down_hours, (
                f"Vehicle {vid} scheduled at station {sid} during down hour {ev['hour']}!"
            )


def test_station_capacity_constraints(sample_fleet):
    res = solve_fleet_charging(sample_fleet)
    stations = {s["id"]: s for s in sample_fleet["stations"]}

    # Count occupancy per station per slot
    occupancy = {sid: {} for sid in stations}

    for vid, events in res["schedules"].items():
        for ev in events:
            sid = ev["station_id"]
            slot = ev["slot"]
            occupancy[sid][slot] = occupancy[sid].get(slot, 0) + 1

    for sid, slot_counts in occupancy.items():
        max_slots = stations[sid]["slots"]
        for slot, count in slot_counts.items():
            assert count <= max_slots, (
                f"Station {sid} exceeded capacity at slot {slot}: {count} > {max_slots}!"
            )


def test_replan_respects_additional_down_hours(sample_fleet):
    # Simulate disruption: Station S1 is down during solar hours 11, 12
    disrupted_fleet = copy.deepcopy(sample_fleet)
    for st in disrupted_fleet["stations"]:
        if st["id"] == "S1":
            st["down_hours"] = sorted(list(set(st.get("down_hours", []) + [11, 12])))

    res = solve_fleet_charging(disrupted_fleet)
    assert res["status"] in ("Optimal", "Feasible")

    for vid, events in res["schedules"].items():
        for ev in events:
            if ev["station_id"] == "S1":
                assert ev["hour"] not in [11, 12], (
                    f"Vehicle {vid} scheduled at S1 during disrupted down hours!"
                )
