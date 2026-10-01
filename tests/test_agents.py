"""
Unit and Integration Tests for Virexa Multi-Agent Pipeline & Data Provenance
"""

import pytest
from data_gen.generate import generate_fleet_data
from agents.pipeline import VirexaPipeline


@pytest.fixture
def sample_fleet():
    return generate_fleet_data(seed=42)


def test_full_pipeline_execution(sample_fleet):
    pipeline = VirexaPipeline()
    out = pipeline.run(sample_fleet)

    assert out["pipeline_status"] == "SUCCESS"
    assert len(out["agent_telemetry"]) == 7

    # Verify gates in sequence
    gates = [t["agent"] for t in out["agent_telemetry"]]
    assert "FleetAgent" in gates
    assert "BatteryAgent" in gates
    assert "RouteAgent" in gates
    assert "ChargingAgent" in gates
    assert "CostAgent" in gates
    assert "OptimizationAgent" in gates
    assert "RecommendationAgent" in gates

    # Verify explanations & provenance
    assert len(out["explanations"]) == 20
    for vid, exp in out["explanations"].items():
        assert "headline" in exp
        assert "explanation" in exp
        assert "data_provenance" in exp
        assert "given" in exp["data_provenance"]
        assert "assumed" in exp["data_provenance"]
        assert len(exp["data_provenance"]["given"]) > 0
        assert len(exp["data_provenance"]["assumed"]) > 0

    # Verify overall provenance
    assert "given" in out["data_provenance"]
    assert "assumed" in out["data_provenance"]
