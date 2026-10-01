import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  TrendingDown,
  Cpu,
  Sparkles,
  BatteryCharging,
  Sun,
  Flame,
  Gauge,
  ArrowDown
} from 'lucide-react';
import { KPIs } from '../types';

interface HeroSectionProps {
  kpis: KPIs | null;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ kpis, onExploreClick }) => {
  // Interactive Charging Simulator state
  const [selectedStation, setSelectedStation] = useState<'S1' | 'S2' | 'S3'>('S2');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse parallax tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const stationData = {
    S1: {
      name: 'S1 Depot Main',
      power: '7.2 kW',
      rate: '₹5.00/kWh',
      type: 'Night Off-Peak',
      cRate: '0.22C',
      health: 'Gentle Charging',
      glow: 'shadow-[0_0_35px_rgba(0,229,255,0.4)]',
      border: 'border-cyan-400',
      badgeColor: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40',
    },
    S2: {
      name: 'S2 Solar Canopy',
      power: '7.2 kW',
      rate: '₹6.00/kWh',
      type: '100% Clean Solar',
      cRate: '0.22C',
      health: 'Eco Optimal',
      glow: 'shadow-[0_0_35px_rgba(57,255,136,0.4)]',
      border: 'border-emerald-400',
      badgeColor: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40',
    },
    S3: {
      name: 'S3 DC Hypercharge',
      power: '22.0 kW',
      rate: '₹11.00/kWh',
      type: 'Peak Grid Fast',
      cRate: '0.85C',
      health: 'Thermal Stress',
      glow: 'shadow-[0_0_35px_rgba(255,183,3,0.4)]',
      border: 'border-amber-400',
      badgeColor: 'text-amber-300 bg-amber-950/60 border-amber-500/40',
    },
  };

  const currentSt = stationData[selectedStation];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-16 z-20 max-w-7xl mx-auto">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Tagline Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
        <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="font-semibold tracking-wider uppercase">Autonomous Multi-Agent EV Fleet Engine</span>
        <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
        <span className="text-slate-400 hidden sm:inline">Delhi NCR Grid Arbitrage</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-display text-white tracking-tight text-center leading-[1.05]">
        VIREXA
      </h1>

      <p className="text-xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-amber-300 mt-3 font-display text-center tracking-tight">
        Charge Smart. Run Longer. Spend Less.
      </p>

      <p className="text-sm sm:text-base text-slate-300 max-w-2xl text-center mt-3 leading-relaxed font-normal">
        AI-driven mathematical scheduling for commercial EV fleets in Delhi NCR.
        Balancing time-of-day tariffs, battery degradation, and guaranteed shift availability.
      </p>

      {/* HIGGSFIELD CINEMATIC CONCEPT CAR SHOWCASE */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-5xl mt-10 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-[#05080f] border border-cyan-500/20 shadow-2xl overflow-hidden backdrop-blur-xl group"
      >
        {/* Subtle grid and radial stage glow */}
        <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Control Bar: Station Selector */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Interactive Charging Station Simulator
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setSelectedStation('S1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedStation === 'S1'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              S1 Depot (7.2kW)
            </button>
            <button
              onClick={() => setSelectedStation('S2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedStation === 'S2'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              S2 Solar (7.2kW)
            </button>
            <button
              onClick={() => setSelectedStation('S3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedStation === 'S3'
                  ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              S3 DC Fast (22kW)
            </button>
          </div>
        </div>

        {/* Center Vehicle Stage with 3D Parallax & HUD Floating Telemetry */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 py-6">
          {/* Left Floating HUD: Vehicle Status */}
          <div className="w-full lg:w-64 space-y-3 z-10">
            <div className="glass-panel p-3.5 rounded-2xl border border-cyan-500/20 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>VEHICLE TARGET</span>
                <span className="text-cyan-300 font-bold">EV-HYPER-01</span>
              </div>
              <div className="text-lg font-bold text-white font-display">
                Fleet Flagship Sedan
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 text-xs font-mono">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-300">Pack: 65.0 kWh</span>
              </div>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-cyan-500/20 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>LIVE STATE OF CHARGE</span>
                <span className="text-neon-green font-bold">78%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-neon-green rounded-full w-[78%] animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span>Range: 320 km</span>
                <span className="text-emerald-400">+48 km added</span>
              </div>
            </div>
          </div>

          {/* Center 3D Parallax Car Image */}
          <div
            className="relative flex-1 flex items-center justify-center py-4 transition-transform duration-200 ease-out"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)`,
            }}
          >
            {/* Ambient neon vehicle floor glow */}
            <div
              className={`absolute bottom-2 w-4/5 h-16 rounded-full blur-2xl transition-all duration-500 ${
                selectedStation === 'S1'
                  ? 'bg-cyan-500/30'
                  : selectedStation === 'S2'
                  ? 'bg-emerald-500/30'
                  : 'bg-amber-500/30'
              }`}
            />

            {/* Cinematic Hyper-Sedan Image */}
            <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all">
              <img
                src="/hero-car.jpg"
                alt="Virexa Cinematic Concept Electric Sedan"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Holographic Charging Port Pulse */}
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <span className="w-4 h-4 rounded-full bg-cyan-400 animate-ping absolute opacity-75" />
                  <span className="w-3 h-3 rounded-full bg-neon-green shadow-[0_0_12px_#39ff88] relative z-10" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900/90 text-cyan-300 border border-cyan-400/50 shadow-lg backdrop-blur-md">
                  CONNECTED · {currentSt.power}
                </span>
              </div>
            </div>
          </div>

          {/* Right Floating HUD: Station Economics & Degradation */}
          <div className="w-full lg:w-64 space-y-3 z-10">
            <div className="glass-panel p-3.5 rounded-2xl border border-cyan-500/20 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>STATION TARIFF</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold border ${currentSt.badgeColor}`}>
                  {selectedStation}
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {currentSt.rate}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {currentSt.type}
              </div>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-cyan-500/20 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>C-RATE & HEALTH</span>
                <span className="font-mono text-white font-bold">{currentSt.cRate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono mt-1 text-slate-300">
                {selectedStation === 'S3' ? (
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : selectedStation === 'S2' ? (
                  <Sun className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <BatteryCharging className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
                <span>{currentSt.health}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800">
                {selectedStation === 'S3'
                  ? 'High degradation penalty added'
                  : 'Zero degradation penalty incurred'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Showcase Footer */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-b border-slate-800/80 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-neon-green">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
              MILP Schedule Active
            </span>
            <span>·</span>
            <span>48 Time-of-Day Slots</span>
          </div>

          <div className="text-slate-300">
            Hover to tilt 3D perspective · Switch stations to view real-time grid impact
          </div>
        </div>
      </div>

      {/* KPI Highlight Strip Below Showcase */}
      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full mt-10">
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 text-left hover:border-cyan-400/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
              <span>OPTIMIZED FLEET COST</span>
              <TrendingDown className="w-4 h-4 text-neon-green" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
              ₹{kpis.total_optimized_cost_inr.toLocaleString()}
            </div>
            <div className="text-xs text-neon-green font-mono mt-1">
              Saved ₹{kpis.savings_inr} / day ({kpis.savings_percent}% reduction)
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 text-left hover:border-cyan-400/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
              <span>ON-TIME READINESS</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-300">
              {kpis.ready_on_time_pct}%
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">
              15% mandatory safety buffer enforced
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 text-left hover:border-cyan-400/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
              <span>FLEET ORCHESTRATION</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300">
              20 EVs / 3 Stations
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">
              E-Rickshaws, Delivery Vans, Shuttles
            </div>
          </div>
        </div>
      )}

      {/* Explore Button */}
      <div className="flex flex-col items-center mt-10 gap-3">
        <button
          onClick={onExploreClick}
          className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-extrabold font-display tracking-wider hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] active:scale-95 transition-all"
        >
          <span>Explore Fleet Telemetry & Optimization</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
