import React, { useState } from 'react';
import { Truck, Battery, Search, Heart, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Vehicle, Shift } from '../types';

interface FleetSectionProps {
  vehicles: Vehicle[];
  shifts: Shift[];
}

export const FleetSection: React.FC<FleetSectionProps> = ({ vehicles, shifts }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  const shiftMap = new Map<string, Shift>(shifts.map((s) => [s.vehicle_id, s]));

  const filteredVehicles = vehicles.filter((v) => {
    const matchesType = filterType === 'all' || v.type === filterType;
    const matchesSearch =
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentVehicles = filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleTabChange = (type: string) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const totalVehicles = vehicles.length;
  const avgSoc = totalVehicles > 0 ? Math.round((vehicles.reduce((acc, v) => acc + v.current_soc, 0) / totalVehicles) * 100) : 0;
  const avgHealth = totalVehicles > 0 ? Math.round((vehicles.reduce((acc, v) => acc + v.battery_health, 0) / totalVehicles) * 100) : 0;
  const totalKwh = vehicles.reduce((acc, v) => acc + v.battery_capacity_kwh, 0);

  return (
    <section id="fleet" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>FLEET TELEMETRY & INVENTORY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
            Meet the {totalVehicles}-EV Fleet
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-xl">
            Multimodal commercial EV fleet: E-Rickshaws, Urban Delivery Vans, and Campus Shuttles operating across Delhi NCR depots.
          </p>
        </div>

        {/* Fleet KPI Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="glass-panel p-2.5 rounded-xl border border-slate-800 text-left">
            <div className="text-slate-400 text-[10px]">TOTAL FLEET</div>
            <div className="text-base font-bold text-white">{totalVehicles} EVs</div>
          </div>
          <div className="glass-panel p-2.5 rounded-xl border border-slate-800 text-left">
            <div className="text-slate-400 text-[10px]">AVG SOC</div>
            <div className="text-base font-bold text-red-400">{avgSoc}%</div>
          </div>
          <div className="glass-panel p-2.5 rounded-xl border border-slate-800 text-left">
            <div className="text-slate-400 text-[10px]">AVG SOH</div>
            <div className="text-base font-bold text-amber-400">{avgHealth}%</div>
          </div>
          <div className="glass-panel p-2.5 rounded-xl border border-slate-800 text-left">
            <div className="text-slate-400 text-[10px]">PACK TOTAL</div>
            <div className="text-base font-bold text-rose-300">{totalKwh} kWh</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          {[
            { id: 'all', label: 'All Fleet', count: 20 },
            { id: 'e-rickshaw', label: 'E-Rickshaws', count: 8 },
            { id: 'delivery-van', label: 'Delivery Vans', count: 7 },
            { id: 'campus-shuttle', label: 'Campus Shuttles', count: 5 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === tab.id
                  ? 'bg-red-600 text-white font-bold shadow-md shadow-red-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vehicle ID or model..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-400 transition-all font-mono"
            />
          </div>

          <div className="text-xs font-mono text-slate-400">
            Showing {currentVehicles.length} of {filteredVehicles.length}
          </div>
        </div>
      </div>

      {/* Grid of 8 Vehicle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentVehicles.map((v) => {
          const shift = shiftMap.get(v.id);
          const socPct = Math.round(v.current_soc * 100);
          const healthPct = Math.round(v.battery_health * 100);

          return (
            <div
              key={v.id}
              className="glass-panel p-5 rounded-2xl border border-red-500/15 hover:border-red-500/40 transition-all group flex flex-col justify-between hover:shadow-xl hover:shadow-red-500/10"
            >
              <div>
                {/* Header: ID, Badge, and Type */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      {v.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md ${
                        v.type === 'e-rickshaw'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : v.type === 'delivery-van'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {v.type.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-200 mb-3 truncate" title={v.name}>
                  {v.name}
                </div>

                {/* Battery SoC & Health Section */}
                <div className="flex items-center gap-4 py-3 border-y border-slate-800/80 mb-3">
                  {/* SoC Circular Progress */}
                  <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
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
                          socPct > 50 ? 'text-red-400' : socPct > 30 ? 'text-amber-400' : 'text-rose-500'
                        }`}
                        strokeDasharray={`${socPct}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-xs font-mono font-bold text-white">
                      {socPct}%
                    </div>
                  </div>

                  {/* Battery Specs & Health Bar */}
                  <div className="flex-1 text-[11px]">
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Capacity:</span>
                      <span className="font-mono text-white font-medium">
                        {v.battery_capacity_kwh} kWh
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Max Charge:</span>
                      <span className="font-mono text-red-300 font-medium">
                        {v.max_charge_kw} kW
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-400" /> Health:
                      </span>
                      <span className="font-mono font-medium text-amber-400">{healthPct}%</span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-amber-400 rounded-full"
                        style={{ width: `${healthPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shift Information Footer */}
              {shift ? (
                <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <div className="flex items-center justify-between font-mono text-red-300 mb-1">
                    <span>
                      {shift.start_hour.toString().padStart(2, '0')}:00 -{' '}
                      {shift.end_hour.toString().padStart(2, '0')}:00
                    </span>
                    <span className="text-white font-bold">{shift.planned_km} km</span>
                  </div>
                  <div className="text-slate-400 truncate text-[10px]" title={shift.shift_name}>
                    {shift.shift_name} (Load: {Math.round(shift.load_factor * 100)}%)
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 font-mono italic p-2 bg-slate-900/30 rounded-xl border border-slate-800/40">
                  Standby reserve unit
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-400">
            Page <span className="font-bold text-white">{currentPage}</span> of{' '}
            <span className="font-bold text-white">{totalPages}</span>
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
