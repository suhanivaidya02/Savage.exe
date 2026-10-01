import React, { useState } from 'react';
import { Calendar, Info } from 'lucide-react';
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
  const [hoveredEvent, setHoveredEvent] = useState<{
    vehicle: Vehicle;
    event?: ChargingEvent;
    slot: number;
    hour: number;
  } | null>(null);

  const shiftMap = new Map<string, Shift>(shifts.map((s) => [s.vehicle_id, s]));
  const tariffMap = new Map<number, TariffSlot>(tariff.map((t) => [t.hour, t]));

  const slots = Array.from({ length: 48 }, (_, i) => i);

  return (
    <section id="schedule" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>24-HOUR OPTIMIZED ALLOCATION MATRIX</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          Charging Schedule Gantt
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
          Every slot is chosen by the MILP solver to avoid peak grid rates while guaranteeing 100% on-time departure.
          Hover over any charging block to inspect power, cost, and reasons.
        </p>
      </div>

      {/* Station Color Legend & Tariff Profile Overview */}
      <div className="glass-panel p-4 rounded-xl border border-red-500/20 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Stations Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">STATIONS:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500 shadow-[0_0_8px_#ff1e42]" />
            <span className="text-white">S1 Depot Main (7.2 kW)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 shadow-[0_0_8px_#ff6b2b]" />
            <span className="text-white">S2 Depot Solar (7.2 kW)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-600 shadow-[0_0_8px_#e11d48]" />
            <span className="text-white">S3 Public Fast DC (22 kW)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800 border border-slate-600 border-dashed" />
            <span className="text-slate-400">On Active Shift</span>
          </div>
        </div>

        {/* Hover Tooltip Card Preview */}
        {hoveredEvent?.event ? (
          <div className="flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-900 border border-red-500/40 text-xs font-mono">
            <span className="text-red-400 font-bold">{hoveredEvent.vehicle.id}</span>
            <span className="text-slate-400">{hoveredEvent.event.time_str}</span>
            <span className="text-white font-semibold">{hoveredEvent.event.station_name}</span>
            <span className="text-amber-300">{hoveredEvent.event.energy_kwh} kWh</span>
            <span className="text-red-400 font-bold">₹{hoveredEvent.event.cost_inr}</span>
            <span className="text-slate-400">({hoveredEvent.event.c_rate}C)</span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>Hover any cell to inspect slot details</span>
          </div>
        )}
      </div>

      {/* Main Gantt Grid Container */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 overflow-x-auto shadow-2xl">
        <div className="min-w-[900px]">
          {/* Header 1: Time of Day Tariff Line */}
          <div className="flex items-center mb-1 text-[10px] font-mono">
            <div className="w-24 shrink-0 text-slate-400 font-semibold uppercase">Tariff (INR)</div>
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
                    ₹{rate}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Header 2: Hour Labels */}
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

          {/* 20 Vehicle Rows */}
          <div className="space-y-1.5">
            {vehicles.map((v) => {
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
                  {/* Vehicle Label & Type */}
                  <div className="w-24 shrink-0 flex items-center gap-1.5 text-xs font-mono">
                    <span className="font-bold text-white group-hover:text-red-400">{v.id}</span>
                    <span className="text-[10px] text-slate-500 truncate">{v.type.split('-')[0]}</span>
                  </div>

                  {/* 48 Half-Hour Slots Grid */}
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
    </section>
  );
};
