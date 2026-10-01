export interface Vehicle {
  id: string;
  name: string;
  type: "e-rickshaw" | "delivery-van" | "campus-shuttle";
  battery_capacity_kwh: number;
  max_charge_kw: number;
  current_soc: number;
  battery_health: number;
  kwh_per_km: number;
  description: string;
  provenance: string;
}

export interface Shift {
  vehicle_id: string;
  start_hour: number;
  end_hour: number;
  planned_km: number;
  load_factor: number;
  shift_name: string;
  provenance: string;
}

export interface Station {
  id: string;
  name: string;
  type: string;
  slots: number;
  max_power_kw: number;
  down_hours: number[];
  location: string;
  provenance: string;
}

export interface TariffSlot {
  hour: number;
  rate_inr_per_kwh: number;
  tier: string;
  provenance: string;
}

export interface TariffRates {
  night: number;
  solar: number;
  peak: number;
  normal: number;
}

export interface ChargingEvent {
  slot: number;
  hour: number;
  time_str: string;
  station_id: string;
  station_name: string;
  power_kw: number;
  energy_kwh: number;
  tariff_rate: number;
  cost_inr: number;
  c_rate: number;
}

export interface VehicleSummary {
  id: string;
  name: string;
  type: string;
  initial_soc: number;
  target_soc: number;
  soc_at_shift_start: number;
  energy_charged_kwh: number;
  charging_cost_inr: number;
  ready_on_time: boolean;
  charging_events_count: number;
}

export interface KPIs {
  total_optimized_cost_inr: number;
  naive_cost_inr: number;
  savings_inr: number;
  savings_percent: number;
  total_energy_kwh: number;
  avg_cost_per_kwh: number;
  ready_on_time_pct: number;
  fast_charge_degradations_prevented: number;
}

export interface Weights {
  w_cost: number;
  w_health: number;
  w_avail: number;
}

export interface AgentTelemetry {
  gate: number;
  agent: string;
  role: string;
  status: string;
  duration_sec: number;
  summary: string;
}

export interface DataProvenance {
  given: string[];
  assumed: string[];
}

export interface VehicleExplanation {
  vehicle_id: string;
  headline: string;
  explanation: string;
  strategy: string;
  key_factors: string[];
  data_provenance: DataProvenance;
}

export interface VehicleDiff {
  vehicle_id: string;
  change_type: string;
  old_charging_slots: number;
  new_charging_slots: number;
  old_energy_kwh: number;
  new_energy_kwh: number;
  energy_delta_kwh: number;
  old_stations: string[];
  new_stations: string[];
}

export interface DisruptionDiff {
  disruption: {
    type: string;
    params: Record<string, any>;
    summary: string;
  };
  approval_status: "APPROVED" | "PENDING_APPROVAL" | "AUTO_APPROVED";
  requires_approval: boolean;
  cost_delta_inr: number;
  cost_delta_percent: number;
  availability_delta_percent: number;
  vehicles_moved_count: number;
  vehicles_moved: string[];
  vehicle_diffs: VehicleDiff[];
  old_kpis: KPIs;
  new_kpis: KPIs;
}
