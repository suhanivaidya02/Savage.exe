import React from 'react';
import { Sliders, Sparkles, Heart, Zap, Clock, IndianRupee, ArrowUpDown, TrendingDown, HelpCircle, ShieldCheck } from 'lucide-react';
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
          <span>LIVE CONTROLLER · APNE HISAB SE TUNE KARO</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          Tune Cost, Battery & Tariffs
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto mt-3 text-sm sm:text-base leading-relaxed">
          Neeche diye gaye sliders ko drag kijiye. Pure fleet ka <span className="text-red-400 font-bold font-mono">daily bill aur bachat turant live change</span> hogi!
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/30 relative shadow-2xl space-y-8">
        {/* LIVE METRICS TOP TICKER BAR */}
        {kpis && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900/80 to-amber-950/40 border border-red-500/30 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400">Total Live Fleet Bill:</span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                ₹{kpis.total_optimized_cost_inr.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">Pure 10 gaadiyon ka 24h kharcha</span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400">Bina Planning Ka Bill:</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-rose-400 line-through">
                ₹{kpis.naive_cost_inr.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">Peak hour unmanaged charging</span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-red-400 font-semibold">Live Daily Bachat (Savings):</span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-red-400 text-glow-red">
                ₹{kpis.savings_inr.toLocaleString()} ({kpis.savings_percent}%)
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">Har roz itne rupaye bach rahe hain</span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400">On-Time Readiness:</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
                {kpis.ready_on_time_pct}%
              </div>
              <span className="text-[10px] text-slate-400">Gaadiyan shift me ready</span>
            </div>
          </div>
        )}

        {/* 1. TARIFF RATE INTERACTIVE ADJUSTERS */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-red-500/20">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                  Bijli Ke Daam Badlo (Delhi NCR Tariffs)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                In rates ko badal kar dekhiye, upar ka total bill aur bachat turant recalculate hoga:
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleTariffPreset('default')}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                Standard Delhi (₹5/6/11)
              </button>
              <button
                onClick={() => handleTariffPreset('spike')}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40"
              >
                Peak Surge (₹18 Peak)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Night Rate Slider */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="text-slate-300 font-bold">🌙 Raat Ki Sasti Bijli:</span>
                <span className="font-bold text-red-400 text-sm">₹{tariffRates.night.toFixed(1)}/kWh</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="9.0"
                step="0.5"
                value={tariffRates.night}
                onChange={(e) => handleTariffSlider('night', parseFloat(e.target.value))}
                className="w-full accent-red-500 cursor-pointer h-2 bg-slate-800 rounded-lg mt-2"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-1.5 block">Off-Peak (11:00 PM - 06:00 AM)</span>
            </div>

            {/* Solar Rate Slider */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="text-slate-300 font-bold">☀️ Clean Solar Bijli:</span>
                <span className="font-bold text-amber-400 text-sm">₹{tariffRates.solar.toFixed(1)}/kWh</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="10.0"
                step="0.5"
                value={tariffRates.solar}
                onChange={(e) => handleTariffSlider('solar', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg mt-2"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-1.5 block">Dopahar Solar (10:00 AM - 04:00 PM)</span>
            </div>

            {/* Peak Rate Slider */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="text-slate-300 font-bold">🔥 Sham Ka Mehenga Peak:</span>
                <span className="font-bold text-rose-400 text-sm">₹{tariffRates.peak.toFixed(1)}/kWh</span>
              </div>
              <input
                type="range"
                min="8.0"
                max="22.0"
                step="0.5"
                value={tariffRates.peak}
                onChange={(e) => handleTariffSlider('peak', parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg mt-2"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-1.5 block">Evening Grid Peak (05:00 PM - 10:00 PM)</span>
            </div>
          </div>
        </div>

        {/* 2. MILP OBJECTIVE WEIGHT SLIDERS */}
        <div>
          {/* Presets Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-400" />
                <span className="text-xs font-mono text-slate-300 uppercase font-semibold">
                  Aapko Kya Zyaada Chahiye? (1-Click Strategy Presets):
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Kisi bhi button ko click karke direct strategy choose kijiye:
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePreset('balanced')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                ⚖️ Balanced (Best of Both)
              </button>
              <button
                onClick={() => handlePreset('eco_cost')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 transition-all"
              >
                💰 Max Bachat (Paisa Bachao)
              </button>
              <button
                onClick={() => handlePreset('battery_preservation')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 transition-all"
              >
                🛡️ Battery First (Lambi Umar)
              </button>
              <button
                onClick={() => handlePreset('max_readiness')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 transition-all"
              >
                ⚡ Fast Ready (Shift Guarantee)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Slider 1: Cost Minimization */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-red-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      1. Paisa Bachao (Cost Optimization Slider)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Isko badhane se AI saari charging sasti raat ki bijli (₹5) me shift kar deta hai.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-base font-bold text-red-400 shrink-0 ml-2">
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
                className="w-full accent-red-500 cursor-pointer h-2 bg-slate-800 rounded-lg mt-2"
              />
            </div>

            {/* Slider 2: Battery Health Preservation */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      2. Battery Ki Umar Badhao (Battery Health Slider)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Isko badhane se 22kW fast charger ka use kam hoga, battery garam nahi hogi aur lambi chalegi.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-base font-bold text-amber-400 shrink-0 ml-2">
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
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg mt-2"
              />
            </div>

            {/* Slider 3: Shift Readiness Guarantee */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-rose-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      3. Gaadi Time Par Ready Rakho (Availability Buffer)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Isko badhane se gaadi delivery shift shuru hone se 1-2 ghante pehle hi 100% charged mil jayegi.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-base font-bold text-rose-400 shrink-0 ml-2">
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
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg mt-2"
              />
            </div>
          </div>
        </div>

        {/* Live Mathematical Solver Status Footer */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-white font-semibold">MILP Mathematical Solver: ACTIVE</span>
            <span>·</span>
            <span>0ms Instant Client-Side Recomputation</span>
          </div>

          <div className="text-red-400 font-semibold">
            {isLoading ? 'Solving Mathematical Optimum...' : '✓ Optimal Global Schedule Found'}
          </div>
        </div>
      </div>
    </section>
  );
};
