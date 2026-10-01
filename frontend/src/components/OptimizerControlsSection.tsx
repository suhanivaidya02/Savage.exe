import React, { useState } from 'react';
import { Sliders, RefreshCw, Sparkles, Heart, Zap, Clock } from 'lucide-react';
import { Weights, KPIs } from '../types';

interface OptimizerControlsSectionProps {
  weights: Weights;
  kpis: KPIs | null;
  onOptimize: (weights: Weights) => Promise<void>;
  isLoading: boolean;
}

export const OptimizerControlsSection: React.FC<OptimizerControlsSectionProps> = ({
  weights,
  kpis,
  onOptimize,
  isLoading,
}) => {
  const [localWeights, setLocalWeights] = useState<Weights>(weights);

  const handleSliderChange = (key: keyof Weights, value: number) => {
    setLocalWeights((prev) => ({ ...prev, [key]: value }));
  };

  const handlePreset = (preset: 'balanced' | 'eco_cost' | 'battery_preservation' | 'max_readiness') => {
    let newWeights: Weights;
    if (preset === 'eco_cost') {
      newWeights = { w_cost: 2.5, w_health: 0.8, w_avail: 1.0 };
    } else if (preset === 'battery_preservation') {
      newWeights = { w_cost: 1.0, w_health: 2.5, w_avail: 1.0 };
    } else if (preset === 'max_readiness') {
      newWeights = { w_cost: 0.8, w_health: 1.0, w_avail: 2.8 };
    } else {
      newWeights = { w_cost: 1.0, w_health: 1.0, w_avail: 1.0 };
    }
    setLocalWeights(newWeights);
    onOptimize(newWeights);
  };

  const handleApply = () => {
    onOptimize(localWeights);
  };

  return (
    <section id="optimizer" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-mono mb-3">
          <Sliders className="w-3.5 h-3.5" />
          <span>MULTI-OBJECTIVE TRADE-OFF ENGINE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          Tune the MILP Optimizer
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mt-3 text-sm sm:text-base">
          Adjust objective weights. The backend solves the exact mathematical formulation in PuLP CBC
          and updates all fleet schedules in real time.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/25 relative shadow-2xl">
        {/* Presets Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300 uppercase">Operational Presets:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePreset('balanced')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              Balanced (1:1:1)
            </button>
            <button
              onClick={() => handlePreset('eco_cost')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 transition-all"
            >
              Min Cost (2.5x)
            </button>
            <button
              onClick={() => handlePreset('battery_preservation')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 transition-all"
            >
              Battery Health (2.5x)
            </button>
            <button
              onClick={() => handlePreset('max_readiness')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 transition-all"
            >
              Max Readiness (2.8x)
            </button>
          </div>
        </div>

        {/* 3 Interactive Sliders */}
        <div className="space-y-6">
          {/* Slider 1: Cost Minimization */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    Charging Cost Minimization (w_cost)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Prioritizes off-peak night (₹5/kWh) and solar windows (₹6/kWh) over peak grid.
                  </p>
                </div>
              </div>
              <span className="font-mono text-base font-bold text-cyan-400">
                {localWeights.w_cost.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="4.0"
              step="0.1"
              value={localWeights.w_cost}
              onChange={(e) => handleSliderChange('w_cost', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Slider 2: Battery Health Preservation */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-neon-green/20 text-neon-green flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    Battery Health Preservation (w_health)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Heavily penalizes fast charging (&gt;0.8C) and limits degradation on worn packs.
                  </p>
                </div>
              </div>
              <span className="font-mono text-base font-bold text-neon-green">
                {localWeights.w_health.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="4.0"
              step="0.1"
              value={localWeights.w_health}
              onChange={(e) => handleSliderChange('w_health', parseFloat(e.target.value))}
              className="w-full accent-neon-green cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Slider 3: Shift Availability Readiness */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    Vehicle Shift Readiness (w_avail)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Strictly enforces reaching target SoC + 15% safety buffer before shift departure.
                  </p>
                </div>
              </div>
              <span className="font-mono text-base font-bold text-amber-400">
                {localWeights.w_avail.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="4.0"
              step="0.1"
              value={localWeights.w_avail}
              onChange={(e) => handleSliderChange('w_avail', parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Action Button & Live Output */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            {kpis ? (
              <span>
                Current Optimized: <span className="text-white font-bold">₹{kpis.total_optimized_cost_inr}</span> | Savings:{' '}
                <span className="text-neon-green font-bold">₹{kpis.savings_inr} ({kpis.savings_percent}%)</span>
              </span>
            ) : (
              'Ready to optimize'
            )}
          </div>

          <button
            onClick={handleApply}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold font-display hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Solving MILP...' : 'Re-Run Optimizer'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
