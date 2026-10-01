"""
Integration Tests for Virexa FastAPI REST Endpoints
Tests:
  - GET / (health check)
  - GET /api/data (fleet inventory, stations, shifts, tariff)
  - POST /api/optimize (parameter weights responsiveness)
  - POST /api/disrupt (disruption simulation, diff calculation, PENDING_APPROVAL status)
  - POST /api/approve (human-in-the-loop commit flow)
  - GET /api/explanations (natural language explanations & provenance)
  - GET /api/summary (top-level KPIs)
  - POST /api/reset (resetting state)
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Virexa API"
    assert data["status"] == "HEALTHY"


def test_get_fleet_data():
    response = client.get("/api/data")
    assert response.status_code == 200
    data = response.json()
    assert len(data["vehicles"]) == 20
    assert len(data["stations"]) == 3
    assert len(data["shifts"]) == 20
    assert len(data["tariff"]) == 24
    assert data["approval_status"] in ("APPROVED", "PENDING_APPROVAL")


def test_post_optimize_with_custom_weights():
    payload = {
        "w_cost": 2.0,
        "w_health": 0.5,
        "w_avail": 1.5
    }
    response = client.post("/api/optimize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert data["weights"]["w_cost"] == 2.0
    assert "kpis" in data
    assert data["kpis"]["savings_inr"] >= 0
    assert "schedules" in data
    assert len(data["schedules"]) == 20


def test_disruption_and_approval_flow():
    # 1. Reset first to have clean baseline
    reset_resp = client.post("/api/reset", json={"seed": 42})
    assert reset_resp.status_code == 200

    # 2. Inject station outage disruption (Station S1 down for 4 hours)
    disrupt_payload = {
        "type": "station_down",
        "params": {
            "station_id": "S1",
            "duration_hours": 4,
            "start_hour": 0
        }
    }
    disrupt_resp = client.post("/api/disrupt", json=disrupt_payload)
    assert disrupt_resp.status_code == 200
    disrupt_data = disrupt_resp.json()

    assert "diff" in disrupt_data
    diff = disrupt_data["diff"]
    assert "vehicles_moved" in diff
    assert "cost_delta_inr" in diff
    assert "availability_delta_percent" in diff
    assert disrupt_data["status"] == "PENDING_APPROVAL"

    # 3. Verify summary reflects pending approval
    summary_resp = client.get("/api/summary")
    assert summary_resp.status_code == 200
    summary_data = summary_resp.json()
    assert summary_data["has_pending_approval"] is True

    # 4. Human-in-the-loop: Approve the plan
    approve_resp = client.post("/api/approve")
    assert approve_resp.status_code == 200
    approve_data = approve_resp.json()
    assert approve_data["status"] == "APPROVED"

    # 5. Verify summary now confirms approved
    summary_after = client.get("/api/summary").json()
    assert summary_after["has_pending_approval"] is False
    assert summary_after["approval_status"] == "APPROVED"


def test_get_explanations():
    response = client.get("/api/explanations")
    assert response.status_code == 200
    data = response.json()
    assert "explanations" in data
    assert len(data["explanations"]) == 20

    v01_exp = data["explanations"]["V01"]
    assert "headline" in v01_exp
    assert "explanation" in v01_exp
    assert "data_provenance" in v01_exp
    assert len(v01_exp["data_provenance"]["given"]) > 0
    assert len(v01_exp["data_provenance"]["assumed"]) > 0


def test_get_kpi_summary():
    response = client.get("/api/summary")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert "total_optimized_cost_inr" in data["kpis"]
    assert "savings_inr" in data["kpis"]
    assert "ready_on_time_pct" in data["kpis"]
    assert data["fleet_size"] == 20
    assert data["station_count"] == 3
