"""
Virexa - AI Energy & EV Fleet Optimization Agent
Data Generation Module
Generates seeded, deterministic simulated EV fleet data, shifts, charging stations, and tariffs.
"""

import json
import random
from pathlib import Path
from typing import Dict, List, Any


def get_default_tariff() -> List[Dict[str, Any]]:
    """
    Returns 24-hour tariff schedule in INR/kWh:
    - 00:00 - 06:00: 5 INR/kWh (Off-peak Night cheap)
    - 10:00 - 16:00: 6 INR/kWh (Solar hours cheaper)
    - 18:00 - 22:00: 11 INR/kWh (Evening peak expensive)
    - Else: 8 INR/kWh (Standard normal rate)
    Tagged as ASSUMED.
    """
    tariff = []
    for hour in range(24):
        if 0 <= hour < 6:
            rate = 5.0
            tier = "Off-Peak Night"
        elif 10 <= hour < 16:
            rate = 6.0
            tier = "Solar Hours"
        elif 18 <= hour < 22:
            rate = 11.0
            tier = "Evening Peak"
        else:
            rate = 8.0
            tier = "Standard Normal"
        tariff.append({
            "hour": hour,
            "rate_inr_per_kwh": rate,
            "tier": tier,
            "provenance": "ASSUMED"
        })
    return tariff


def get_stations() -> List[Dict[str, Any]]:
    """
    Returns charging stations:
    - S1 Depot Main: 6 slots, 7.2 kW AC Type 2, down_hours [13]
    - S2 Depot Solar: 4 slots, 7.2 kW Solar-tied, down_hours []
    - S3 Public Fast: 2 slots, 22 kW DC Fast, down_hours [19, 20]
    """
    return [
        {
            "id": "S1",
            "name": "Depot Main Hub",
            "type": "depot_ac",
            "slots": 6,
            "max_power_kw": 7.2,
            "down_hours": [13],  # 13:00 - 14:00 maintenance
            "location": "North Fleet Yard",
            "provenance": "GIVEN"
        },
        {
            "id": "S2",
            "name": "Depot Solar Canopy",
            "type": "solar_ac",
            "slots": 4,
            "max_power_kw": 7.2,
            "down_hours": [],  # fully available
            "location": "Central Green Terminal",
            "provenance": "GIVEN"
        },
        {
            "id": "S3",
            "name": "Public Fast Charge Station",
            "type": "public_dc",
            "slots": 2,
            "max_power_kw": 22.0,
            "down_hours": [19, 20],  # 19:00 - 21:00 grid stress moratorium
            "location": "Ring Road Hub",
            "provenance": "GIVEN"
        }
    ]


VEHICLE_SPECS = {
    "e-rickshaw": {
        "battery_capacity_kwh": 8.0,
        "max_charge_kw": 3.3,
        "kwh_per_km": 0.09,
        "description": "Mahindra Treo / Piaggio Ape E-City class 3-wheeler"
    },
    "delivery-van": {
        "battery_capacity_kwh": 30.0,
        "max_charge_kw": 7.2,
        "kwh_per_km": 0.30,
        "description": "Tata Ace EV / Euler Storm class urban delivery van"
    },
    "campus-shuttle": {
        "battery_capacity_kwh": 20.0,
        "max_charge_kw": 7.2,
        "kwh_per_km": 0.20,
        "description": "Campus Electric Minibus (IIT / Tech Park feeder)"
    }
}


def generate_fleet_data(seed: int = 42) -> Dict[str, Any]:
    """
    Generates deterministic, seeded fleet data for 20 vehicles.
    - 8 e-rickshaws (V01 - V08)
    - 7 delivery vans (V09 - V15)
    - 5 campus shuttles (V16 - V20)
    """
    rng = random.Random(seed)

    vehicles = []
    shifts = []

    # 1. 8 E-Rickshaws (Urban last-mile passenger & parcel)
    for i in range(1, 9):
        vid = f"V{i:02d}"
        spec = VEHICLE_SPECS["e-rickshaw"]
        soc = round(rng.uniform(0.25, 0.65), 2)
        soh = round(rng.uniform(0.84, 0.98), 2)
        # Shift timings: morning or afternoon rush
        if i % 2 == 1:
            start_h = 8
            end_h = 14
            planned_km = rng.randint(45, 65)
        else:
            start_h = 14
            end_h = 20
            planned_km = rng.randint(50, 70)
        load_f = round(rng.uniform(0.70, 0.95), 2)

        vehicles.append({
            "id": vid,
            "name": f"E-Rickshaw {vid}",
            "type": "e-rickshaw",
            "battery_capacity_kwh": spec["battery_capacity_kwh"],
            "max_charge_kw": spec["max_charge_kw"],
            "current_soc": soc,
            "battery_health": soh,
            "kwh_per_km": spec["kwh_per_km"],
            "description": spec["description"],
            "provenance": "GIVEN"
        })

        shifts.append({
            "vehicle_id": vid,
            "start_hour": start_h,
            "end_hour": end_h,
            "planned_km": planned_km,
            "load_factor": load_f,
            "shift_name": f"{'Morning' if start_h < 12 else 'Evening'} Urban Corridor",
            "provenance": "GIVEN"
        })

    # 2. 7 Delivery Vans (E-commerce delivery)
    for i in range(9, 16):
        vid = f"V{i:02d}"
        spec = VEHICLE_SPECS["delivery-van"]
        soc = round(rng.uniform(0.20, 0.55), 2)
        soh = round(rng.uniform(0.82, 0.96), 2)
        # Delivery shifts typically 09:00 - 18:00 or 10:00 - 19:00
        start_h = rng.choice([9, 10])
        end_h = start_h + 8  # 8-hour shift
        planned_km = rng.randint(75, 110)
        load_f = round(rng.uniform(0.75, 1.0), 2)

        vehicles.append({
            "id": vid,
            "name": f"Express Van {vid}",
            "type": "delivery-van",
            "battery_capacity_kwh": spec["battery_capacity_kwh"],
            "max_charge_kw": spec["max_charge_kw"],
            "current_soc": soc,
            "battery_health": soh,
            "kwh_per_km": spec["kwh_per_km"],
            "description": spec["description"],
            "provenance": "GIVEN"
        })

        shifts.append({
            "vehicle_id": vid,
            "start_hour": start_h,
            "end_hour": end_h,
            "planned_km": planned_km,
            "load_factor": load_f,
            "shift_name": f"Hub-to-Spoke Dispatch {start_h}:00-{end_h}:00",
            "provenance": "GIVEN"
        })

    # 3. 5 Campus Shuttles (Tech Park / University loops)
    for i in range(16, 21):
        vid = f"V{i:02d}"
        spec = VEHICLE_SPECS["campus-shuttle"]
        soc = round(rng.uniform(0.30, 0.70), 2)
        soh = round(rng.uniform(0.85, 0.99), 2)
        # Shuttle shifts: Peak commuter hours
        if i in (16, 17):
            start_h = 7
            end_h = 13
        elif i in (18, 19):
            start_h = 15
            end_h = 21
        else:
            start_h = 11
            end_h = 17
        planned_km = rng.randint(55, 85)
        load_f = round(rng.uniform(0.65, 0.90), 2)

        vehicles.append({
            "id": vid,
            "name": f"Campus Shuttle {vid}",
            "type": "campus-shuttle",
            "battery_capacity_kwh": spec["battery_capacity_kwh"],
            "max_charge_kw": spec["max_charge_kw"],
            "current_soc": soc,
            "battery_health": soh,
            "kwh_per_km": spec["kwh_per_km"],
            "description": spec["description"],
            "provenance": "GIVEN"
        })

        shifts.append({
            "vehicle_id": vid,
            "start_hour": start_h,
            "end_hour": end_h,
            "planned_km": planned_km,
            "load_factor": load_f,
            "shift_name": f"Campus Transit Ring {start_h}:00-{end_h}:00",
            "provenance": "GIVEN"
        })

    stations = get_stations()
    tariff = get_default_tariff()

    return {
        "metadata": {
            "project": "Virexa",
            "version": "1.0.0",
            "currency": "INR",
            "location_context": "NCR / Delhi Fleet Depot",
            "vehicle_count": len(vehicles),
            "station_count": len(stations),
            "seed": seed
        },
        "vehicles": vehicles,
        "shifts": shifts,
        "stations": stations,
        "tariff": tariff
    }


def save_sample_data(filepath: Path = None) -> Path:
    """Saves the generated sample data to JSON."""
    if filepath is None:
        filepath = Path(__file__).resolve().parent / "sample_fleet.json"
    data = generate_fleet_data()
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    return filepath


if __name__ == "__main__":
    out_path = save_sample_data()
    print(f"Sample fleet data generated at: {out_path}")
