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
  onStationSelect?: (color: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  kpis,
  onExploreClick,
  onStationSelect,
}) => {
  const [selectedStation, setSelectedStation] = useState<'S1' | 'S2' | 'S3'>('S2');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
      color: '#00e5ff',
      badgeColor: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40',
    },
    S2: {
      name: 'S2 Solar Canopy',
      power: '7.2 kW',
      rate: '₹6.00/kWh',
      type: '100% Clean Solar',
      cRate: '0.22C',
      health: 'Eco Optimal',
      color: '#39ff88',
      badgeColor: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40',
    },
    S3: {
      name: 'S3 DC Hypercharge',
      power: '22.0 kW',
      rate: '₹11.00/kWh',
      type: 'Peak Grid Fast',
      cRate: '0.85C',
      health: 'Thermal Stress',
      color: '#ffb703',
      badgeColor: 'text-amber-300 bg-amber-950/60 border-amber-500/40',
    },
  };

  const currentSt = stationData[selectedStation];

  const handleSelect = (key: 'S1' | 'S2' | 'S3') => {
    setSelectedStation(key);
    if (onStationSelect) {
      onStationSelect(stationData[key].color);
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-16 z-20 max-w-7xl mx-auto">
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

      {/* 3D WEBGL CAR STAGE & HOLOGRAPHIC TELEMETRY HUD */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-5xl mt-8 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/40 via-slate-950/30 to-transparent border border-cyan-500/20 shadow-2xl backdrop-blur-sm group"
      >
        {/* Top Control Bar: Station Selector */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Live 3D WebGL Vehicle Rig · Station Simulator
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => handleSelect('S1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedStation === 'S1'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              S1 Depot (7.2kW)
            </button>
            <button
              onClick={() => handleSelect('S2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedStation === 'S2'
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              S2 Solar (7.2kW)
            </button>
            <button
              onClick={() => handleSelect('S3')}
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

        {/* Center Portal: 3D WebGL EV Sedan sits in background canvas! */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 py-4 min-h-[300px]">
          {/* Left Floating HUD: Vehicle Status */}
          <div
            className="w-full lg:w-64 space-y-3 z-10 transition-transform duration-200"
            style={{
              transform: `translateX(${mousePos.x * 10}px) translateY(${mousePos.y * 10}px)`,
            }}
          >
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

          {/* Center Transparent Stage Window (Direct view to 3D Canvas) */}
          <div className="relative flex-1 w-full h-64 lg:h-80 flex items-center justify-center">
            {/* Holographic Concentric Ground Ring Indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full border border-cyan-400/20 animate-spin-slow" />
              <div className="w-48 h-48 rounded-full border border-dashed border-emerald-400/30" />
            </div>

            {/* Holographic Status Pill Anchored to 3D Car */}
            <div className="absolute bottom-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/40 text-xs font-mono shadow-xl backdrop-blur-md">
              <div className="w-2.5 h-2.5 rounded-full bg-neon-green animate-ping" />
              <span className="text-slate-300">DOCK:</span>
              <span className="text-cyan-300 font-bold">{currentSt.name}</span>
              <span className="text-slate-500">·</span>
              <span className="text-neon-green font-bold">{currentSt.power}</span>
            </div>
          </div>

          {/* Right Floating HUD: Station Economics & Degradation */}
          <div
            className="w-full lg:w-64 space-y-3 z-10 transition-transform duration-200"
            style={{
              transform: `translateX(${-mousePos.x * 10}px) translateY(${-mousePos.y * 10}px)`,
            }}
          >
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
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-neon-green">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
              WebGL 3D Rig Active
            </span>
            <span>·</span>
            <span>Scroll to orbit camera along Delhi NCR grid</span>
          </div>

          <div className="text-slate-300">
            Switch stations to tint 3D floor lighting · Scroll down to drive through chapters
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
