import React from 'react';
import { AlertTriangle, Flame, Clock, IndianRupee } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>THE UNMANAGED EV FLEET CRISIS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          Why Unmanaged Charging Breaks Fleets
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mt-4 text-sm sm:text-base">
          When commercial EV fleets plug in indiscriminately at shift-end, they trigger crippling peak tariffs,
          overheat cells with unchecked fast-charging, and bottle up depot bays.
        </p>
      </div>

      {/* 3 Core Pain Points with Animated Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pain 1: Peak Grid Tariffs */}
        <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-black text-rose-400 mb-2">
            +38%
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Surge Electricity Costs
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Vehicles plugging in at 18:00 hit peak tariffs (₹11.00/kWh) instead of waiting for night off-peak (₹5.00/kWh)
            or solar generation (₹6.00/kWh), inflating monthly depot power bills by tens of thousands of rupees.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
            Delhi ToD Tariff: ₹11/kWh peak vs ₹5/kWh night
          </div>
        </div>

        {/* Pain 2: Accelerated Battery Degradation */}
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
            <Flame className="w-6 h-6" />
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-black text-amber-400 mb-2">
            2.4x
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Premature Cell Degradation
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            High C-rate DC fast charging (&gt;0.8C) on small packs like 8 kWh e-rickshaws causes lithium plating and
            thermal stress, reducing battery lifecycle and forcing premature ₹1.5L battery replacements.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
            Degradation penalty enforced in Virexa MILP
          </div>
        </div>

        {/* Pain 3: Missed Delivery Shifts */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-black text-cyan-400 mb-2">
            18%
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Missed Departures & Bottlenecks
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Without coordinated slot scheduling, delivery vans queue for chargers while shuttles remain stranded
            at 30% SoC at 08:00 AM dispatch, causing SLA breaches and lost customer revenue.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
            Target SoC + 15% safety buffer guaranteed
          </div>
        </div>
      </div>
    </section>
  );
};
