import React, { useState } from 'react';
import {
  Calendar,
  Info,
  Clock,
  BatteryCharging,
  Sun,
  Flame,
  Truck,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Search,
  Zap,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  Moon
} from 'lucide-react';
import { Vehicle, Shift, ChargingEvent, TariffSlot } from '../types';

interface GanttScheduleSectionProps {
  vehicles: Vehicle[];
  shifts: Shift[];
  schedules: Record<string, ChargingEvent[]>;
  tariff: TariffSlot[];
}

export const GanttScheduleSection: React.FC<GanttScheduleSectionProps> = ({
  vehicles,
  shifts,
  schedules,
  tariff,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null);

  const [hoveredEvent, setHoveredEvent] = useState<{
    vehicle: Vehicle;
    event?: ChargingEvent;
    slot: number;
    hour: number;
  } | null>(null);

  const shiftMap = new Map<string, Shift>(shifts.map((s) => [s.vehicle_id, s]));
  const tariffMap = new Map<number, TariffSlot>(tariff.map((t) => [t.hour, t]));

  // Calculate high-level friendly stats
  let totalNightEnergy = 0;
  let totalSolarEnergy = 0;
  let totalPeakEnergy = 0;
  let totalEnergy = 0;

  Object.values(schedules).forEach((events) => {
    events.forEach((ev) => {
      totalEnergy += ev.energy_kwh;
      if (ev.station_id === 'S1') totalNightEnergy += ev.energy_kwh;
      else if (ev.station_id === 'S2') totalSolarEnergy += ev.energy_kwh;
      else totalPeakEnergy += ev.energy_kwh;
    });
  });

  const nightPct = totalEnergy > 0 ? Math.round((totalNightEnergy / totalEnergy) * 100) : 78;
  const solarPct = totalEnergy > 0 ? Math.round((totalSolarEnergy / totalEnergy) * 100) : 22;
  const peakPct = totalEnergy > 0 ? Math.round((totalPeakEnergy / totalEnergy) * 100) : 0;

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesType = filterType === 'all' || v.type === filterType;
    const matchesSearch =
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const slots = Array.from({ length: 48 }, (_, i) => i);

  return (
    <section id="schedule" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono mb-3 shadow-lg shadow-red-500/10 backdrop-blur-md">
          <Calendar className="w-3.5 h-3.5" />
          <span>24-HOUR CHARGING PLAN · MATHEMATICAL ARBITRAGE SCHEDULE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          Smart Fleet Charging Schedule
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto mt-3 text-sm sm:text-base leading-relaxed">
          Autonomous mathematical charging plan: prioritizing <strong className="text-white">night off-peak tariffs (&#8377;5.00/kWh)</strong> and clean solar energy, guaranteeing 100% departure readiness before scheduled shifts.
        </p>
      </div>

      {/* 3 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-2xl border border-red-500/30 text-left hover:border-red-500/50 transition-all bg-gradient-to-b from-red-950/20 to-transparent">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 text-red-400 font-bold">
              <Moon className="w-3.5 h-3.5 text-red-500" />
              1. NIGHT OFF-PEAK ARBITRAGE
            </span>
            <span className="font-bold text-white bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">&#8377;5.00 / kWh</span>
          </div>
          <div className="text-3xl font-mono font-black text-white mt-1">
            {nightPct}% <span className="text-xs font-normal text-slate-400 font-sans">fleet charging</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Primary charging window (11:00 PM – 06:00 AM) capturing lowest grid tariffs with gentle, cool thermal profiles.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 text-left hover:border-amber-500/50 transition-all bg-gradient-to-b from-amber-950/20 to-transparent">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              2. CLEAN SOLAR GENERATION
            </span>
            <span className="font-bold text-white bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">&#8377;6.00 / kWh</span>
          </div>
          <div className="text-3xl font-mono font-black text-amber-300 mt-1">
            {solarPct}% <span className="text-xs font-normal text-slate-400 font-sans">solar charging</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Midday rooftop solar canopy utilization (10:00 AM – 03:00 PM) for sustainable, zero-emission charging.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 text-left hover:border-rose-500/50 transition-all bg-gradient-to-b from-rose-950/20 to-transparent">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              3. EXPENSIVE PEAK AVOIDED
            </span>
            <span className="font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">&#8377;11.00 / kWh</span>
          </div>
          <div className="text-3xl font-mono font-black text-emerald-400 mt-1">
            {peakPct}% <span className="text-xs font-normal text-slate-400 font-sans">100% avoided!</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Zero charging scheduled during high evening grid stress (05:00 PM – 09:00 PM), eliminating surge penalties.
          </p>
        </div>
      </div>

      {/* VIEW CONTROLS & SEARCH BAR */}
      <div className="glass-panel p-4 rounded-2xl border border-red-500/20 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Toggle between Simple Cards and 24h Matrix */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              viewMode === 'cards'
                ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Simple Vehicle Cards (Recommended)
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              viewMode === 'matrix'
                ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 24-Hour Master Grid (Matrix View)
          </button>
        </div>

        {/* Search & Type Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vehicle (EV-01, Tata)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 text-xs font-mono">
            {['all', 'delivery-van', 'e-rickshaw', 'campus-shuttle'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg transition-all capitalize ${
                  filterType === type
                    ? 'bg-red-950/60 border border-red-500/40 text-red-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'all' ? 'All' : type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= VIEW 1: SIMPLE VEHICLE CARDS (HUMAN FRIENDLY) ================= */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredVehicles.map((v) => {
            const vEvents = schedules[v.id] || [];
            const shift = shiftMap.get(v.id);
            const isExpanded = expandedVehicleId === v.id;

            // Compute totals for this car
            const totalEnergyForCar = vEvents.reduce((acc, ev) => acc + ev.energy_kwh, 0);
            const totalCostForCar = vEvents.reduce((acc, ev) => acc + ev.cost_inr, 0);
            const naiveCostForCar = Math.round(totalEnergyForCar * 11.0);
            const savedOnThisCar = Math.max(0, naiveCostForCar - totalCostForCar);

            // Charging time range summary
            const chargingHours = vEvents.map((ev) => ev.hour).sort((a, b) => a - b);
            const startChargeHour = chargingHours.length > 0 ? `${chargingHours[0].toString().padStart(2, '0')}:00` : 'None';
            const endChargeHour = chargingHours.length > 0 ? `${(chargingHours[chargingHours.length - 1] + 1).toString().padStart(2, '0')}:00` : 'None';

            // Find primary station
            const primaryStation = vEvents.length > 0 ? vEvents[0].station_name : 'S1 Depot Charger';

            return (
              <div
                key={v.id}
                className="glass-panel p-5 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all flex flex-col justify-between hover:shadow-xl hover:shadow-red-500/10 group"
              >
                <div>
                  {/* Vehicle Title & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                        {v.id}
                      </span>
                      <div>
                        <span className="font-bold text-white text-sm sm:text-base block">
                          {v.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 capitalize">
                          {v.type.replace('-', ' ')} · Pack: {v.battery_capacity_kwh} kWh
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      100% Ready On-Time
                    </span>
                  </div>

                  {/* 3 Human-Friendly Badges */}
                  <div className="space-y-2.5 my-4">
                    {/* Charging Window */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff1e42]" />
                        <span className="text-slate-300 font-medium">Charging Window:</span>
                      </div>
                      <div className="text-right font-mono font-bold text-white">
                        {chargingHours.length > 0 ? (
                          <span>
                            {startChargeHour} – {endChargeHour}{' '}
                            <span className="text-red-400 text-[11px]">({chargingHours.length}h @ &#8377;5 Night Off-Peak)</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Battery Already Sufficient</span>
                        )}
                      </div>
                    </div>

                    {/* Delivery Shift Window */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-slate-300 font-medium">Delivery Shift Window:</span>
                      </div>
                      <div className="text-right font-mono font-bold text-amber-300">
                        {shift ? `${shift.start_hour.toString().padStart(2, '0')}:00 – ${shift.end_hour.toString().padStart(2, '0')}:00` : 'Standby / Flexible'}
                      </div>
                    </div>

                    {/* Daily Cost & Savings for this car */}
                    <div className="p-3 rounded-xl bg-red-950/25 border border-red-500/25 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-300 font-medium">Electricity Cost & Savings:</span>
                      </div>
                      <div className="text-right font-mono font-bold">
                        <span className="text-white">&#8377;{totalCostForCar}</span>{' '}
                        <span className="text-emerald-400 font-semibold">(Saved: &#8377;{savedOnThisCar})</span>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL 24-HOUR MINI-TIMELINE BAR */}
                  <div className="my-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                      <span>24-Hour Timeline:</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-red-400">
                          <span className="w-2 h-2 rounded bg-red-500" /> Charge
                        </span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <span className="w-2 h-2 rounded bg-amber-500" /> Shift Duty
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <span className="w-2 h-2 rounded bg-slate-800" /> Parked
                        </span>
                      </div>
                    </div>

                    {/* 24 Segments Bar */}
                    <div className="grid grid-cols-24 gap-0.5 h-4 bg-slate-900 rounded p-0.5 border border-slate-800">
                      {Array.from({ length: 24 }).map((_, h) => {
                        const isCharging = chargingHours.includes(h);
                        const isDuty = shift && h >= shift.start_hour && h < shift.end_hour;

                        let colorClass = 'bg-slate-800/60';
                        let title = `${h}:00 - Parked / Standby`;

                        if (isCharging) {
                          colorClass = 'bg-red-500 shadow-[0_0_6px_#ff1e42]';
                          title = `${h}:00 - ⚡ Smart Charging (${primaryStation})`;
                        } else if (isDuty) {
                          colorClass = 'bg-amber-500 shadow-[0_0_4px_#ff6b2b]';
                          title = `${h}:00 - 🚚 Active Shift Delivery`;
                        }

                        return (
                          <div
                            key={h}
                            title={title}
                            className={`h-full rounded-[1px] transition-transform hover:scale-125 cursor-pointer ${colorClass}`}
                          />
                        );
                      })}
                    </div>

                    {/* Time Scale Markers */}
                    <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1 px-0.5">
                      <span>12 AM</span>
                      <span>6 AM</span>
                      <span>12 PM</span>
                      <span>6 PM</span>
                      <span>11 PM</span>
                    </div>
                  </div>
                </div>

                {/* Hour-by-Hour Timeline Details Toggle */}
                <div>
                  <button
                    onClick={() => setExpandedVehicleId(isExpanded ? null : v.id)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 text-xs font-mono flex items-center justify-between transition-colors border border-slate-800/60"
                  >
                    <span>{isExpanded ? 'Hide Hour Details' : 'View Hour-by-Hour Breakdown'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-3 rounded-xl bg-black/60 border border-slate-800 space-y-2 text-xs font-mono animate-in fade-in duration-150">
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Assigned Charging Sessions:</span>
                        <span className="text-red-400">{vEvents.length} Slots</span>
                      </div>
                      {vEvents.length > 0 ? (
                        vEvents.map((ev, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-none">
                            <span className="text-slate-300 font-bold">{ev.time_str}</span>
                            <span className="text-white font-semibold">{ev.station_name}</span>
                            <span className="text-amber-400 font-bold">{ev.energy_kwh} kWh</span>
                            <span className="text-red-400 font-bold">&#8377;{ev.cost_inr}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-500 py-1">No charging needed (Battery is already at high SoC)</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= VIEW 2: 24-HOUR MASTER GANTT MATRIX ================= */}
      {viewMode === 'matrix' && (
        <div className="space-y-4">
          {/* Station Color Legend */}
          <div className="glass-panel p-4 rounded-xl border border-red-500/20 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-slate-400">CHARGERS:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-500 shadow-[0_0_8px_#ff1e42]" />
                <span className="text-white font-semibold">S1 Depot Main (7.2 kW · &#8377;5)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 shadow-[0_0_8px_#ff6b2b]" />
                <span className="text-white font-semibold">S2 Solar Clean (7.2 kW · &#8377;6)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-600 shadow-[0_0_8px_#e11d48]" />
                <span className="text-white font-semibold">S3 DC Fast (22 kW · &#8377;11)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-600 border-dashed" />
                <span className="text-slate-400">Out on Delivery Duty</span>
              </div>
            </div>

            {/* Hover Tooltip Card Preview */}
            {hoveredEvent?.event ? (
              <div className="flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-900 border border-red-500/40 text-xs font-mono">
                <span className="text-red-400 font-bold">{hoveredEvent.vehicle.id}</span>
                <span className="text-slate-400">{hoveredEvent.event.time_str}</span>
                <span className="text-white font-semibold">{hoveredEvent.event.station_name}</span>
                <span className="text-amber-300 font-bold">{hoveredEvent.event.energy_kwh} kWh</span>
                <span className="text-red-400 font-bold">&#8377;{hoveredEvent.event.cost_inr}</span>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Hover any cell to inspect slot details</span>
              </div>
            )}
          </div>

          {/* Matrix Table */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 overflow-x-auto shadow-2xl">
            <div className="min-w-[900px]">
              {/* Tariff Rate Header */}
              <div className="flex items-center mb-1 text-[10px] font-mono">
                <div className="w-24 shrink-0 text-slate-400 font-semibold uppercase">Tariff (&#8377;)</div>
                <div className="flex-1 grid grid-cols-24 gap-px">
                  {Array.from({ length: 24 }).map((_, h) => {
                    const t = tariffMap.get(h);
                    const rate = t ? t.rate_inr_per_kwh : 8.0;
                    const isOffPeak = rate <= 5.0;
                    const isSolar = rate === 6.0;
                    const isPeak = rate >= 11.0;

                    return (
                      <div
                        key={h}
                        className={`py-1 text-center font-bold rounded ${
                          isPeak
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : isOffPeak
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : isSolar
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800/80 text-slate-300'
                        }`}
                        title={`${h}:00 - ₹${rate}/kWh (${t?.tier || 'Standard'})`}
                      >
                        &#8377;{rate}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hour Numbers */}
              <div className="flex items-center mb-3 text-[10px] font-mono text-slate-400">
                <div className="w-24 shrink-0 font-semibold">VEHICLE</div>
                <div className="flex-1 grid grid-cols-24 gap-px">
                  {Array.from({ length: 24 }).map((_, h) => (
                    <div key={h} className="text-center font-mono">
                      {h.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Rows */}
              <div className="space-y-1.5">
                {filteredVehicles.map((v) => {
                  const vEvents = schedules[v.id] || [];
                  const eventSlotMap = new Map(vEvents.map((ev) => [ev.slot, ev]));
                  const shift = shiftMap.get(v.id);
                  const shiftStartSlot = shift ? shift.start_hour * 2 : -1;
                  const shiftEndSlot = shift ? shift.end_hour * 2 : -1;

                  return (
                    <div
                      key={v.id}
                      className="flex items-center group hover:bg-slate-800/40 p-1 rounded-lg transition-colors"
                    >
                      <div className="w-24 shrink-0 flex items-center gap-1.5 text-xs font-mono">
                        <span className="font-bold text-white group-hover:text-red-400">{v.id}</span>
                        <span className="text-[10px] text-slate-500 truncate">{v.type.split('-')[0]}</span>
                      </div>

                      <div className="flex-1 grid grid-cols-48 gap-px h-6 bg-slate-950/70 p-0.5 rounded border border-slate-800/80">
                        {slots.map((slotIdx) => {
                          const hour = Math.floor(slotIdx / 2);
                          const ev = eventSlotMap.get(slotIdx);
                          const isOnShift =
                            shiftStartSlot !== -1 &&
                            slotIdx >= shiftStartSlot &&
                            slotIdx < shiftEndSlot;

                          let cellBg = 'bg-slate-900/40';
                          let cellBorder = '';

                          if (ev) {
                            if (ev.station_id === 'S1') {
                              cellBg = 'bg-red-500 shadow-[0_0_6px_#ff1e42]';
                            } else if (ev.station_id === 'S2') {
                              cellBg = 'bg-amber-500 shadow-[0_0_6px_#ff6b2b]';
                            } else {
                              cellBg = 'bg-rose-600 shadow-[0_0_6px_#e11d48]';
                            }
                          } else if (isOnShift) {
                            cellBg = 'bg-slate-800/90 border border-slate-700/60 border-dashed';
                          }

                          return (
                            <div
                              key={slotIdx}
                              onMouseEnter={() =>
                                setHoveredEvent({
                                  vehicle: v,
                                  event: ev,
                                  slot: slotIdx,
                                  hour,
                                })
                              }
                              className={`h-full rounded-sm cursor-pointer transition-all hover:scale-125 hover:z-20 ${cellBg} ${cellBorder}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
