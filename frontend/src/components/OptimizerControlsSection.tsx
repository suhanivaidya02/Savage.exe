import React from 'react';
import { Sliders, Sparkles, Heart, Zap, Clock, IndianRupee, ArrowUpDown, TrendingDown } from 'lucide-react';
import { Weights, TariffRates, KPIs } from '../types';

interface OptimizerControlsSectionProps {
  weights: Weights;
  tariffRates: TariffRates;
  kpis: KPIs | null;
  onLiveWeightsChange: (weights: Weights) => void;
  onLiveTariffChange: (rates: TariffRates) => void;
  isLoading: boolean;
}

export const OptimizerControlsSection: React.FC<OptimizerControlsSectionProps> = ({
  weights,
  tariffRates,
  kpis,
  onLiveWeightsChange,
  onLiveTariffChange,
  isLoading,
}) => {
  const handleWeightSlider = (key: keyof Weights, value: number) => {
    onLiveWeightsChange({ ...weights, [key]: value });
  };

  const handleTariffSlider = (key: keyof TariffRates, value: number) => {
    onLiveTariffChange({ ...tariffRates, [key]: value });
  };

  const handlePreset = (preset: 'balanced' | 'eco_cost' | 'battery_preservation' | 'max_readiness') => {
    if (preset === 'eco_cost') {
      onLiveWeightsChange({ w_cost: 3.0, w_health: 0.8, w_avail: 1.0 });
    } else if (preset === 'battery_preservation') {
      onLiveWeightsChange({ w_cost: 1.0, w_health: 3.0, w_avail: 1.0 });
    } else if (preset === 'max_readiness') {
      onLiveWeightsChange({ w_cost: 0.8, w_health: 1.0, w_avail: 3.0 });
    } else {
      onLiveWeightsChange({ w_cost: 1.0, w_health: 1.0, w_avail: 1.0 });
    }
  };

  const handleTariffPreset = (type: 'default' | 'spike' | 'green') => {
    if (type === 'spike') {
      onLiveTariffChange({ night: 6.5, solar: 8.0, peak: 18.0, normal: 10.0 });
    } else if (type === 'green') {
      onLiveTariffChange({ night: 3.5, solar: 4.0, peak: 10.0, normal: 7.0 });
    } else {
      onLiveTariffChange({ night: 5.0, solar: 6.0, peak: 11.0, normal: 8.0 });
    }
  };

  return (
    <section id="optimizer" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono mb-3">
          <Sliders className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>REAL-TIME DYNAMIC CALCULATION ENGINE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          Tune the MILP Optimizer & Tariffs
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto mt-3 text-sm sm:text-base">
          Drag any slider below. All costs, savings, and depot allocations recompute <span className="text-red-400 font-bold font-mono">live in real-time</span>.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/30 relative shadow-2xl space-y-8">
        {/* LIVE METRICS TOP TICKER BAR */}
        {kpis && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900/80 to-amber-950/40 border border-red-500/30 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400">Total Live Fleet Cost:</span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                ₹{kpis.total_optimized_cost_inr.toLocaleString()}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400">Naive Unmanaged Cost:</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-rose-400 line-through">
                ₹{kpis.naive_cost_inr.toLocaleString()}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-red-400 font-semibold">Live Daily Savings:</span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-red-400 text-glow-red">
                ₹{kpis.savings_inr.toLocaleString()} ({kpis.savings_percent}%)
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400">Fleet On-Time:</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
                {kpis.ready_on_time_pct}%
              </div>
            </div>
          </div>
        )}

        {/* 1. TARIFF RATE INTERACTIVE ADJUSTERS */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-red-500/20">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                Live Electricity Tariff Inputs (₹/kWh)
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleTariffPreset('default')}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                Standard Delhi
              </button>
              <button
                onClick={() => handleTariffPreset('spike')}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40"
              >
                Peak Surge (₹18)
              </button>
              <button
                onClick={() => handleTariffPreset('green')}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40"
              >
                Low Solar (₹4)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Night Rate Slider */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-400">Night Off-Peak:</span>
                <span className="font-bold text-red-400 text-sm">₹{tariffRates.night.toFixed(1)}/kWh</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="9.0"
                step="0.5"
                value={tariffRates.night}
                onChange={(e) => handleTariffSlider('night', parseFloat(e.target.value))}
                className="w-full accent-red-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">Hours: 23:00 - 06:00</span>
            </div>

            {/* Solar Rate Slider */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-400">Solar Canopy:</span>
                <span className="font-bold text-amber-400 text-sm">₹{tariffRates.solar.toFixed(1)}/kWh</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="10.0"
                step="0.5"
                value={tariffRates.solar}
                onChange={(e) => handleTariffSlider('solar', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">Hours: 10:00 - 16:00</span>
            </div>

            {/* Peak Rate Slider */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-400">Evening Peak:</span>
                <span className="font-bold text-rose-400 text-sm">₹{tariffRates.peak.toFixed(1)}/kWh</span>
              </div>
              <input
                type="range"
                min="8.0"
                max="22.0"
                step="0.5"
                value={tariffRates.peak}
                onChange={(e) => handleTariffSlider('peak', parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">Hours: 17:00 - 22:00</span>
            </div>
          </div>
        </div>

        {/* 2. MILP OBJECTIVE WEIGHT SLIDERS */}
        <div>
          {/* Presets Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono text-slate-300 uppercase font-semibold">
                Multi-Objective Optimizer Weights:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePreset('balanced')}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                Balanced (1:1:1)
              </button>
              <button
                onClick={() => handlePreset('eco_cost')}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 transition-all"
              >
                Max Savings (3.0x)
              </button>
              <button
                onClick={() => handlePreset('battery_preservation')}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 transition-all"
              >
                Battery Shield (3.0x)
              </button>
              <button
                onClick={() => handlePreset('max_readiness')}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 transition-all"
              >
                Rush Ready (3.0x)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Slider 1: Cost Minimization */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-red-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      Cost Minimization (w_cost)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Aggressively concentrates charging into the cheapest off-peak night and solar slots.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-base font-bold text-red-400">
                  {weights.w_cost.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="4.0"
                step="0.1"
                value={weights.w_cost}
                onChange={(e) => handleWeightSlider('w_cost', parseFloat(e.target.value))}
                className="w-full accent-red-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Slider 2: Battery Health Preservation */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      Battery Health Preservation (w_health)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Penalizes rapid DC fast charging (&gt;0.8C), protecting cell longevity.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-base font-bold text-amber-400">
                  {weights.w_health.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="4.0"
                step="0.1"
                value={weights.w_health}
                onChange={(e) => handleWeightSlider('w_health', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Slider 3: Shift Availability Readiness */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-rose-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      Vehicle Shift Readiness (w_avail)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Enforces target SoC + 15% safety buffer before shift dispatch.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-base font-bold text-rose-400">
                  {weights.w_avail.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="4.0"
                step="0.1"
                value={weights.w_avail}
                onChange={(e) => handleWeightSlider('w_avail', parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
