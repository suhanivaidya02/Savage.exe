import { MOCK_DATA } from '../mock/mockData';
import {
  Vehicle,
  Station,
  Shift,
  TariffSlot,
  KPIs,
  Weights,
  ChargingEvent,
  VehicleSummary,
  AgentTelemetry,
  VehicleExplanation,
  DataProvenance,
  DisruptionDiff
} from '../types';

const API_BASE = 'http://localhost:8000/api';

// Configurable mock mode: defaults to auto-detecting backend, falls back gracefully
let forceMockMode = false;

export const setForceMockMode = (enabled: boolean) => {
  forceMockMode = enabled;
};

export const getForceMockMode = () => forceMockMode;

export interface FleetDataResponse {
  metadata: Record<string, any>;
  vehicles: Vehicle[];
  stations: Station[];
  shifts: Shift[];
  tariff: TariffSlot[];
  approval_status: string;
}

export interface OptimizeResponse {
  status: string;
  weights: Weights;
  kpis: KPIs;
  schedules: Record<string, ChargingEvent[]>;
  vehicle_summary: Record<string, VehicleSummary>;
  agent_telemetry: AgentTelemetry[];
  data_provenance: DataProvenance;
}

export interface DisruptResponse {
  status: "APPROVED" | "PENDING_APPROVAL" | "AUTO_APPROVED";
  diff: DisruptionDiff;
  proposed_plan: {
    kpis: KPIs;
    schedules: Record<string, ChargingEvent[]>;
    vehicle_summary: Record<string, VehicleSummary>;
    agent_telemetry: AgentTelemetry[];
    explanations: Record<string, VehicleExplanation>;
  };
}

export interface ApproveResponse {
  status: string;
  message: string;
  kpis: KPIs;
  diff_summary?: DisruptionDiff;
}

export const fetchFleetData = async (): Promise<FleetDataResponse> => {
  if (forceMockMode) {
    return {
      metadata: MOCK_DATA.fleet_data.metadata as any,
      vehicles: MOCK_DATA.fleet_data.vehicles as any,
      stations: MOCK_DATA.fleet_data.stations as any,
      shifts: MOCK_DATA.fleet_data.shifts as any,
      tariff: MOCK_DATA.fleet_data.tariff as any,
      approval_status: "APPROVED"
    };
  }

  try {
    const res = await fetch(`${API_BASE}/data`, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend unavailable, using bundled high-fidelity mock data:", err);
    return {
      metadata: MOCK_DATA.fleet_data.metadata as any,
      vehicles: MOCK_DATA.fleet_data.vehicles as any,
      stations: MOCK_DATA.fleet_data.stations as any,
      shifts: MOCK_DATA.fleet_data.shifts as any,
      tariff: MOCK_DATA.fleet_data.tariff as any,
      approval_status: "APPROVED"
    };
  }
};

export const runOptimize = async (weights: Weights): Promise<OptimizeResponse> => {
  if (forceMockMode) {
    return {
      status: "SUCCESS",
      weights,
      kpis: MOCK_DATA.plan.kpis as any,
      schedules: MOCK_DATA.plan.schedules as any,
      vehicle_summary: MOCK_DATA.plan.vehicle_summary as any,
      agent_telemetry: MOCK_DATA.plan.agent_telemetry as any,
      data_provenance: MOCK_DATA.plan.data_provenance as any
    };
  }

  try {
    const res = await fetch(`${API_BASE}/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(weights),
      signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend optimize call failed, falling back to local simulation:", err);
    // Adjust mock KPIs slightly based on weights to demonstrate slider interactivity
    const baseKpis = MOCK_DATA.plan.kpis;
    const costMultiplier = weights.w_cost > 1.5 ? 0.92 : weights.w_cost < 0.5 ? 1.08 : 1.0;
    const simulatedCost = Math.round(baseKpis.total_optimized_cost_inr * costMultiplier);
    const simulatedSavings = Math.round(baseKpis.naive_cost_inr - simulatedCost);

    return {
      status: "SUCCESS",
      weights,
      kpis: {
        ...baseKpis,
        total_optimized_cost_inr: simulatedCost,
        savings_inr: simulatedSavings,
        savings_percent: Math.round((simulatedSavings / baseKpis.naive_cost_inr) * 1000) / 10
      } as any,
      schedules: MOCK_DATA.plan.schedules as any,
      vehicle_summary: MOCK_DATA.plan.vehicle_summary as any,
      agent_telemetry: MOCK_DATA.plan.agent_telemetry as any,
      data_provenance: MOCK_DATA.plan.data_provenance as any
    };
  }
};

export const triggerDisruption = async (type: string, params: Record<string, any>): Promise<DisruptResponse> => {
  if (forceMockMode) {
    return createMockDisruption(type, params);
  }

  try {
    const res = await fetch(`${API_BASE}/disrupt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, params }),
      signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend disrupt call failed, using mock replan diff:", err);
    return createMockDisruption(type, params);
  }
};

export const approveReplan = async (): Promise<ApproveResponse> => {
  if (forceMockMode) {
    return {
      status: "APPROVED",
      message: "Replan approved in mock mode.",
      kpis: MOCK_DATA.plan.kpis as any
    };
  }

  try {
    const res = await fetch(`${API_BASE}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend approve failed, returning mock approval:", err);
    return {
      status: "APPROVED",
      message: "Replan approved (Offline Mode).",
      kpis: MOCK_DATA.plan.kpis as any
    };
  }
};

export const fetchExplanations = async () => {
  if (forceMockMode) {
    return {
      explanations: MOCK_DATA.plan.explanations,
      data_provenance: MOCK_DATA.plan.data_provenance,
      approval_status: "APPROVED"
    };
  }

  try {
    const res = await fetch(`${API_BASE}/explanations`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      explanations: MOCK_DATA.plan.explanations,
      data_provenance: MOCK_DATA.plan.data_provenance,
      approval_status: "APPROVED"
    };
  }
};

function createMockDisruption(type: string, params: Record<string, any>): DisruptResponse {
  const baseKpis = MOCK_DATA.plan.kpis;
  const costDelta = type === "tariff_spike" ? 142.50 : type === "station_down" ? 68.20 : -35.40;
  const moved = type === "vehicle_breakdown" ? ["V03"] : type === "station_down" ? ["V01", "V05", "V07"] : ["V07", "V09"];

  return {
    status: "PENDING_APPROVAL",
    diff: {
      disruption: {
        type,
        params,
        summary: `Simulated disruption event: ${type.replace('_', ' ').toUpperCase()}`
      },
      approval_status: "PENDING_APPROVAL",
      requires_approval: true,
      cost_delta_inr: costDelta,
      cost_delta_percent: Math.round((costDelta / baseKpis.total_optimized_cost_inr) * 1000) / 10,
      availability_delta_percent: 0.0,
      vehicles_moved_count: moved.length,
      vehicles_moved: moved,
      vehicle_diffs: moved.map(vid => ({
        vehicle_id: vid,
        change_type: "REALLOCATED",
        old_charging_slots: 3,
        new_charging_slots: 3,
        old_energy_kwh: 5.2,
        new_energy_kwh: 5.2,
        energy_delta_kwh: 0,
        old_stations: ["Depot Main Hub"],
        new_stations: ["Depot Solar Canopy"]
      })),
      old_kpis: baseKpis as any,
      new_kpis: {
        ...baseKpis,
        total_optimized_cost_inr: baseKpis.total_optimized_cost_inr + costDelta
      } as any
    },
    proposed_plan: {
      kpis: {
        ...baseKpis,
        total_optimized_cost_inr: baseKpis.total_optimized_cost_inr + costDelta
      } as any,
      schedules: MOCK_DATA.plan.schedules as any,
      vehicle_summary: MOCK_DATA.plan.vehicle_summary as any,
      agent_telemetry: MOCK_DATA.plan.agent_telemetry as any,
      explanations: MOCK_DATA.plan.explanations as any
    }
  };
}
