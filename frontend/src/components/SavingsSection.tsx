import React from 'react';
import { IndianRupee, TrendingDown, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { KPIs } from '../types';

interface SavingsSectionProps {
  kpis: KPIs | null;
}

export const SavingsSection: React.FC<SavingsSectionProps> = ({ kpis }) => {
  if (!kpis) return null;

  const comparisonData = [
    {
      name: 'Unmanaged Naive Charging',
      cost: kpis.naive_cost_inr,
      color: '#ff3366',
      desc: 'Immediate plug-in at shift end during evening peak tariffs.'
    },
    {
      name: 'Virexa Optimized Plan',
      cost: kpis.total_optimized_cost_inr,
      color: '#00e5ff',
      desc: 'MILP mathematical schedule shifted to solar & night off-peak.'
    }
  ];

  // Projected 30-day and 365-day fleet savings
  const monthlySavings = Math.round(kpis.savings_inr * 30);
  const annualSavings = Math.round(kpis.savings_inr * 365);

  return (
    <section id="savings" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-mono mb-3">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>FINANCIAL IMPACT & GRID ARBITRAGE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          Measurable Fleet Savings
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mt-3 text-sm sm:text-base">
          Proven mathematical superiority: comparing our MILP schedule against standard unmanaged charging behavior.
        </p>
      </div>

      {/* Main Big Animated Metric Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left: Giant Savings Callout Card */}
        <div className="glass-panel p-8 rounded-2xl border border-neon-green/30 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-cyan-950/20">
          <div>
            <span className="text-xs font-mono text-neon-green uppercase tracking-wider font-semibold">
              Daily Operational Arbitrage
            </span>
            <div className="flex items-baseline gap-2 mt-3 mb-1">
              <span className="text-5xl sm:text-6xl font-mono font-black text-neon-green text-glow-neon">
                ₹{kpis.savings_inr}
              </span>
              <span className="text-sm font-mono text-slate-400">/ day</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-green/10 text-neon-green text-xs font-mono font-semibold border border-neon-green/30">
              <Sparkles className="w-3 h-3" />
              <span>{kpis.savings_percent}% reduction vs naive</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Monthly Projection (30d):</span>
              <span className="font-bold text-white">₹{monthlySavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Annual Fleet Impact (365d):</span>
              <span className="font-bold text-cyan-300">₹{annualSavings.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Center: Recharts Naive vs Optimized Bar Comparison */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white font-display">
                Charging Cost Benchmark (INR / Day)
              </h3>
              <span className="text-xs font-mono text-slate-400">20 Vehicles Total</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical" margin={{ left: 30, right: 30, top: 10, bottom: 10 }}>
                  <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `₹${v}`} />
                  <YAxis type="category" dataKey="name" stroke="#cbd5e1" width={170} tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="glass-panel p-3 rounded-lg text-xs font-mono border border-cyan-400/40">
                          <p className="font-bold text-white">{data.name}</p>
                          <p className="text-neon-green text-sm mt-1">₹{data.cost} Total Cost</p>
                          <p className="text-slate-400 text-[10px] mt-0.5">{data.desc}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="cost" radius={[0, 8, 8, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Value Add Pillars */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-center">
            <div className="bg-slate-900/40 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400 font-mono">AVOIDED PEAK</div>
              <div className="text-xs font-bold text-rose-400 font-mono">₹11.00/kWh</div>
            </div>
            <div className="bg-slate-900/40 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400 font-mono">CAPTURED SOLAR</div>
              <div className="text-xs font-bold text-emerald-400 font-mono">₹6.00/kWh</div>
            </div>
            <div className="bg-slate-900/40 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400 font-mono">OFF-PEAK NIGHT</div>
              <div className="text-xs font-bold text-cyan-400 font-mono">₹5.00/kWh</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
