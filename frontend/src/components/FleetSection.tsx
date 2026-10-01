import React, { useState } from 'react';
import { Truck, Navigation, Battery, Heart, Search } from 'lucide-react';
import { Vehicle, Shift } from '../types';

interface FleetSectionProps {
  vehicles: Vehicle[];
  shifts: Shift[];
}

export const FleetSection: React.FC<FleetSectionProps> = ({ vehicles, shifts }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const shiftMap = new Map(shifts.map((s) => [s.vehicle_id, s]));

  const filteredVehicles = vehicles.filter((v) => {
    const matchesType = filterType === 'all' || v.type === filterType;
    const matchesSearch =
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <section id="fleet" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>FLEET TELEMETRY & INVENTORY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
            Meet the 20-EV Fleet
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-xl">
            Simulated multimodal Indian commercial fleet: 8 E-Rickshaws, 7 Urban Delivery Vans, and 5 Tech-Park Campus Shuttles.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vehicle ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-full bg-slate-900/80 border border-slate-800">
            {['all', 'e-rickshaw', 'delivery-van', 'campus-shuttle'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  filterType === type
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'all'
                  ? 'All (20)'
                  : type === 'e-rickshaw'
                  ? 'E-Rickshaw (8)'
                  : type === 'delivery-van'
                  ? 'Vans (7)'
                  : 'Shuttles (5)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of 20 Vehicle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredVehicles.map((v) => {
          const shift = shiftMap.get(v.id);
          const socPct = Math.round(v.current_soc * 100);
          const healthPct = Math.round(v.battery_health * 100);

          return (
            <div
              key={v.id}
              className="glass-panel p-4 rounded-xl border border-cyan-500/15 hover:border-cyan-400/40 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Header: ID, Badge, and Type */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {v.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        v.type === 'e-rickshaw'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : v.type === 'delivery-van'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {v.type.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-200 mb-3 truncate" title={v.name}>
                  {v.name}
                </div>

                {/* Battery SoC & Health Ring */}
                <div className="flex items-center gap-4 py-2 border-y border-slate-800/80 mb-3">
                  {/* SoC Circular Progress */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={`${
                          socPct > 50 ? 'text-neon-green' : socPct > 30 ? 'text-cyan-400' : 'text-amber-400'
                        }`}
                        strokeDasharray={`${socPct}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-[11px] font-mono font-bold text-white">
                      {socPct}%
                    </div>
                  </div>

                  {/* Battery Specs & Health Bar */}
                  <div className="flex-1 text-[11px]">
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Pack / Max:</span>
                      <span className="font-mono text-white font-medium">
                        {v.battery_capacity_kwh}kWh / {v.max_charge_kw}kW
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-400" /> SoH:
                      </span>
                      <span className="font-mono font-medium text-emerald-400">{healthPct}%</span>
                    </div>

                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${healthPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shift Information Footer */}
              {shift ? (
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-[10px] text-slate-300">
                  <div className="flex items-center justify-between font-mono text-cyan-300 mb-0.5">
                    <span>
                      {shift.start_hour.toString().padStart(2, '0')}:00 -{' '}
                      {shift.end_hour.toString().padStart(2, '0')}:00
                    </span>
                    <span>{shift.planned_km} km</span>
                  </div>
                  <div className="text-slate-400 truncate" title={shift.shift_name}>
                    {shift.shift_name} (Load: {Math.round(shift.load_factor * 100)}%)
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-slate-500 font-mono italic">Standby reserve</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
