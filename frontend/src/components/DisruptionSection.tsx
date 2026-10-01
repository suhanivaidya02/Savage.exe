import React, { useState } from 'react';
import {
  AlertOctagon,
  ZapOff,
  TrendingUp,
  Navigation,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  GitCompare
} from 'lucide-react';
import { DisruptionDiff } from '../types';

interface DisruptionSectionProps {
  onTriggerDisruption: (type: string, params: Record<string, any>) => Promise<void>;
  pendingDiff: DisruptionDiff | null;
  isLoading: boolean;
  onNavigateToApproval: () => void;
}

export const DisruptionSection: React.FC<DisruptionSectionProps> = ({
  onTriggerDisruption,
  pendingDiff,
  isLoading,
  onNavigateToApproval,
}) => {
  const [activeDisruption, setActiveDisruption] = useState<string | null>(null);

  const handleDisrupt = async (type: string, params: Record<string, any>) => {
    setActiveDisruption(type);
    await onTriggerDisruption(type, params);
  };

  return (
    <section id="disrupt" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono mb-3 shadow-lg shadow-rose-500/10">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>WHAT-IF SCENARIOS & ADAPTIVE REPLANNING</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          Simulate Real-World Disruptions
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto mt-3 text-sm sm:text-base">
          Trigger operational anomalies. Virexa recalculates delta schedules in &lt;1 second,
          presenting an impact diff for human verification.
        </p>
      </div>

      {/* Disruption Trigger Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => handleDisrupt('charger_down', { station_id: 'S2' })}
          disabled={isLoading}
          className={`glass-panel p-5 rounded-2xl border text-left transition-all hover:scale-[1.02] ${
            activeDisruption === 'charger_down'
              ? 'border-rose-500 bg-rose-950/40 shadow-[0_0_20px_rgba(255,30,66,0.3)]'
              : 'border-slate-800 hover:border-rose-500/40'
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
            <ZapOff className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono uppercase text-rose-400 font-bold mb-0.5">SCENARIO 1</div>
          <h3 className="text-sm font-bold text-white mb-1">Solar Hub S2 Offline</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            S2 charger fault detected. AI redirects solar-dependent vehicles to Depot S1 without operational delay.
          </p>
        </button>

        <button
          onClick={() => handleDisrupt('tariff_spike', { spike_factor: 1.8, hours: [14, 15, 16] })}
          disabled={isLoading}
          className={`glass-panel p-5 rounded-2xl border text-left transition-all hover:scale-[1.02] ${
            activeDisruption === 'tariff_spike'
              ? 'border-amber-500 bg-amber-950/40 shadow-[0_0_20px_rgba(255,107,43,0.3)]'
              : 'border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono uppercase text-amber-400 font-bold mb-0.5">SCENARIO 2</div>
          <h3 className="text-sm font-bold text-white mb-1">Grid Tariff Spike (1.8x Surge)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Grid operator issued emergency peak surcharge. AI immediately halts daytime charging and shifts to night.
          </p>
        </button>

        <button
          onClick={() => handleDisrupt('charger_down', { station_id: 'S1' })}
          disabled={isLoading}
          className={`glass-panel p-5 rounded-2xl border text-left transition-all hover:scale-[1.02] ${
            activeDisruption === 'charger_down_s1'
              ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_20px_rgba(0,229,255,0.3)]'
              : 'border-slate-800 hover:border-cyan-500/40'
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold mb-0.5">SCENARIO 3</div>
          <h3 className="text-sm font-bold text-white mb-1">Depot S1 Maintenance Outage</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Main depot transformer tripped. AI reallocates critical shifts to DC fast chargers with thermal throttling.
          </p>
        </button>

        <button
          onClick={() => handleDisrupt('longer_route', { vehicle_id: 'V07', extra_km: 40 })}
          disabled={isLoading}
          className={`glass-panel p-5 rounded-2xl border text-left transition-all hover:scale-[1.02] ${
            activeDisruption === 'longer_route'
              ? 'border-emerald-500 bg-emerald-950/40 shadow-[0_0_20px_rgba(57,255,136,0.3)]'
              : 'border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <Navigation className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold mb-0.5">SCENARIO 4</div>
          <h3 className="text-sm font-bold text-white mb-1">Vehicle Route Extended (+40km)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Van V07 delayed in traffic with low battery. AI injects emergency top-up window before next shift.
          </p>
        </button>
      </div>

      {/* Loading Spinner during replan */}
      {isLoading && (
        <div className="glass-panel p-8 rounded-2xl border border-rose-500/30 text-center mb-8 animate-pulse">
          <RefreshCw className="w-8 h-8 text-rose-400 animate-spin mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">Re-running MILP Optimizer with Disruption Constraints...</h4>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Analyzing feeder reallocations and recalculating delta matrices.
          </p>
        </div>
      )}

      {/* Replan DIFF Table & Impact Card */}
      {pendingDiff && !isLoading && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-rose-500/40 shadow-2xl relative">
          {/* Status Alert Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 mb-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  {pendingDiff.disruption.summary}
                </h4>
                <p className="text-xs text-rose-300 font-mono">
                  Status: PENDING_APPROVAL (Human operator must verify before deploying to depot)
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToApproval}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-bold text-xs font-display shadow-lg shadow-rose-500/30 active:scale-95 transition-all"
            >
              <span>Review & Approve Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* KPI Delta Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">COST DELTA:</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-2xl font-mono font-bold ${
                    pendingDiff.cost_delta_inr > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {pendingDiff.cost_delta_inr > 0 ? `+₹${pendingDiff.cost_delta_inr}` : `₹${pendingDiff.cost_delta_inr}`}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ({pendingDiff.cost_delta_percent > 0 ? `+${pendingDiff.cost_delta_percent}%` : `${pendingDiff.cost_delta_percent}%`})
                </span>
              </div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">AVAILABILITY DELTA:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-mono font-bold text-cyan-300">
                  {pendingDiff.new_kpis.ready_on_time_pct}%
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ({pendingDiff.availability_delta_percent >= 0 ? `+${pendingDiff.availability_delta_percent}%` : `${pendingDiff.availability_delta_percent}%`})
                </span>
              </div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">VEHICLES REALLOCATED:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-mono font-bold text-amber-400">
                  {pendingDiff.vehicles_moved_count}
                </span>
                <span className="text-xs font-mono text-slate-400">vehicles shifted</span>
              </div>
            </div>
          </div>

          {/* Vehicle Detailed Reallocation Diff Table */}
          {pendingDiff.vehicle_diffs && pendingDiff.vehicle_diffs.length > 0 && (
            <div>
              <h5 className="text-xs font-mono uppercase text-slate-400 mb-3 flex items-center gap-2">
                <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reallocation Manifest (Diff vs Baseline):</span>
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="py-2 px-3">VEHICLE</th>
                      <th className="py-2 px-3">STATUS</th>
                      <th className="py-2 px-3">PREVIOUS STATIONS</th>
                      <th className="py-2 px-3">NEW REPLANNED STATIONS</th>
                      <th className="py-2 px-3">ENERGY (kWh)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {pendingDiff.vehicle_diffs.map((diff) => (
                      <tr key={diff.vehicle_id} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-3 font-bold text-cyan-300">{diff.vehicle_id}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              diff.change_type === 'REALLOCATED'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {diff.change_type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {diff.old_stations.join(', ') || 'None'}
                        </td>
                        <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                          {diff.new_stations.join(', ') || 'Offline'}
                        </td>
                        <td className="py-2.5 px-3 text-white">
                          {diff.new_energy_kwh} kWh
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
