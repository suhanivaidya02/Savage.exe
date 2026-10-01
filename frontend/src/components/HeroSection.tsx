import React from 'react';
import { ArrowDown, Zap, ShieldCheck, TrendingDown, Cpu } from 'lucide-react';
import { KPIs } from '../types';

interface HeroSectionProps {
  kpis: KPIs | null;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ kpis, onExploreClick }) => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-20 pb-36 text-center z-20">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Futuristic Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel-subtle text-xs text-cyan-300 mb-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
        <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="font-mono uppercase tracking-wider font-semibold">Autonomous Multi-Agent System</span>
        <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
        <span className="text-slate-400">Delhi NCR Fleet Grid</span>
      </div>

      {/* Main Title & Brand Tagline */}
      <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight font-display text-white max-w-5xl leading-[1.05]">
        VIREXA
      </h1>

      <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-amber-300 mt-4 font-display">
        Charge smart. Run longer. Spend less.
      </p>

      <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mt-4 font-normal leading-relaxed">
        AI Energy & EV Fleet Optimization Agent balancing time-of-day tariffs, battery degradation,
        and operational shift readiness with human-in-the-loop governance.
      </p>

      {/* Live Benchmark Badges */}
      {kpis && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl w-full mt-8">
          <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 text-left">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Optimized Cost</span>
              <TrendingDown className="w-4 h-4 text-neon-green" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white">
              ₹{kpis.total_optimized_cost_inr}
            </div>
            <div className="text-[11px] text-neon-green font-mono mt-0.5">
              ₹{kpis.savings_inr} saved ({kpis.savings_percent}%)
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 text-left">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>On-Time Readiness</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-300">
              {kpis.ready_on_time_pct}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              15% Safety Margin Enforced
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 text-left col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Fleet Scale</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
              20 EVs / 3 Hubs
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              E-Rickshaws, Vans, Shuttles
            </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="flex flex-col items-center mt-10 gap-3">
        <button
          onClick={onExploreClick}
          className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold font-display tracking-wider hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all duration-300 active:scale-95"
        >
          <span>Scroll to drive & optimize</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </button>
        <span className="text-xs font-mono text-slate-400 animate-pulse">
          ▼ Scroll down to start cinematic journey
        </span>
      </div>
    </section>
  );
};
