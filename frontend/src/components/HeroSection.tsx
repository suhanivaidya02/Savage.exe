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
  ArrowDown,
  HelpCircle,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { KPIs } from '../types';

interface HeroSectionProps {
  kpis: KPIs | null;
  onExploreClick: () => void;
  onStationSelect?: (color: string) => void;
  onOpenGuide?: () => void;
  onTuneOptimizerClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  kpis,
  onExploreClick,
  onStationSelect,
  onOpenGuide,
  onTuneOptimizerClick,
}) => {
  const [selectedStation, setSelectedStation] = useState<'S1' | 'S2' | 'S3'>('S1');
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
      type: 'Night Off-Peak (23:00 - 06:00)',
      cRate: '0.22C',
      health: 'Gentle Charging',
      color: '#ff1e42',
      badgeColor: 'text-red-400 bg-red-950/60 border-red-500/40',
      sessionCost: 36,
      sessionEnergy: 7.2,
      savingsVsFast: 206,
      thermalImpact: 'Zero Battery Wear (0%)',
    },
    S2: {
      name: 'S2 Solar Canopy',
      power: '7.2 kW',
      rate: '₹6.00/kWh',
      type: 'Midday Solar (10:00 - 15:00)',
      cRate: '0.22C',
      health: '100% Clean Solar',
      color: '#ff6b2b',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
      sessionCost: 43.2,
      sessionEnergy: 7.2,
      savingsVsFast: 198.8,
      thermalImpact: 'Eco Optimal (0%)',
    },
    S3: {
      name: 'S3 DC Hypercharge',
      power: '22.0 kW',
      rate: '₹11.00/kWh',
      type: 'Evening Peak Grid (17:00 - 21:00)',
      cRate: '0.85C',
      health: 'High Thermal Stress',
      color: '#ff0033',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/40',
      sessionCost: 242,
      sessionEnergy: 22.0,
      savingsVsFast: 0,
      thermalImpact: 'Severe Wear (+12% Degradation)',
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
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-16 z-20 max-w-7xl mx-auto text-center">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Tagline Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-red-500/40 text-red-400 text-xs font-mono mb-6 shadow-lg shadow-red-500/15 backdrop-blur-md">
        <Cpu className="w-3.5 h-3.5 text-red-400 animate-pulse" />
        <span className="font-semibold tracking-wider uppercase">Autonomous Multi-Agent EV Fleet Engine</span>
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        <span className="text-slate-400 hidden sm:inline">Delhi NCR Grid Arbitrage</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-display text-white tracking-tight leading-[1.05]">
        VIREXA
      </h1>

      <p className="text-xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 mt-3 font-display tracking-tight">
        Charge Smart. Run Longer. Spend Less.
      </p>

      <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-3 leading-relaxed font-normal">
        AI-driven mathematical scheduling for commercial EV fleets in Delhi NCR.
        Balancing time-of-day tariffs, battery degradation, and guaranteed shift availability.
      </p>

      {/* Quick Action Navigation Strip */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
        <button
          onClick={onTuneOptimizerClick || onExploreClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono text-xs font-bold shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Tune Live Optimizer (Sliders)</span>
        </button>

        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-red-500/30 text-red-300 hover:text-white hover:border-red-400 font-mono text-xs font-semibold backdrop-blur-md transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-red-400" />
            <span>How Virexa Works (System Guide)</span>
          </button>
        )}
      </div>

      {/* ================= 3D WEBGL CAR STAGE & HOLOGRAPHIC TELEMETRY HUD ================= */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-5xl mt-8 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-red-950/20 via-slate-950/40 to-transparent border border-red-500/25 shadow-2xl backdrop-blur-sm group"
      >
        {/* Top Control Bar: Station Selector */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Live 3D WebGL Vehicle Rig · Station Simulator
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => handleSelect('S1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedStation === 'S1'
                  ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              S1 Depot (7.2kW)
            </button>
            <button
              onClick={() => handleSelect('S2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedStation === 'S2'
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              S2 Solar (7.2kW)
            </button>
            <button
              onClick={() => handleSelect('S3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedStation === 'S3'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              S3 DC Fast (22kW)
            </button>
          </div>
        </div>

        {/* Center Portal: Clean unobstructed view of 3D Sports EV! */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 py-4 min-h-[300px]">
          {/* Left Floating HUD: Vehicle Status */}
          <div
            className="w-full lg:w-64 space-y-3 z-10 transition-transform duration-200"
            style={{
              transform: `translateX(${mousePos.x * 8}px) translateY(${mousePos.y * 8}px)`,
            }}
          >
            <div className="glass-panel p-3.5 rounded-2xl border border-red-500/20 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>VEHICLE TARGET</span>
                <span className="text-red-400 font-bold">EV-HYPER-01</span>
              </div>
              <div className="text-lg font-bold text-white font-display">
                Fleet Flagship Sedan
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 text-xs font-mono">
                <Gauge className="w-3.5 h-3.5 text-red-400" />
                <span className="text-slate-300">Pack: 65.0 kWh</span>
              </div>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-red-500/20 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>LIVE STATE OF CHARGE</span>
                <span className="text-red-400 font-bold">78%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full w-[78%] animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span>Range: 320 km</span>
                <span className="text-amber-400">+48 km added</span>
              </div>
            </div>
          </div>

          {/* Center Transparent Stage Window (Unobstructed for 3D EV Sedan) */}
          <div className="relative flex-1 w-full h-64 lg:h-80 flex items-center justify-center pointer-events-none">
            {/* Holographic Status Pill */}
            <div className="absolute bottom-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-red-500/40 text-xs font-mono shadow-xl backdrop-blur-md pointer-events-auto">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-slate-300">ACTIVE DOCK:</span>
              <span className="text-red-400 font-bold">{currentSt.name}</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-300 font-bold">{currentSt.power}</span>
            </div>
          </div>

          {/* Right Floating HUD: Station Economics, Session Math & Degradation */}
          <div
            className="w-full lg:w-64 space-y-3 z-10 transition-transform duration-200"
            style={{
              transform: `translateX(${-mousePos.x * 8}px) translateY(${-mousePos.y * 8}px)`,
            }}
          >
            {/* Live 1-Hour Session Cost Calculation */}
            <div className="glass-panel p-3.5 rounded-2xl border border-red-500/20 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>1-HR SESSION COST</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border ${currentSt.badgeColor}`}>
                  {currentSt.rate}
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white flex items-center gap-1.5">
                <span>₹{currentSt.sessionCost.toFixed(0)}</span>
                {currentSt.savingsVsFast > 0 && (
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    (Save ₹{currentSt.savingsVsFast.toFixed(0)})
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {currentSt.sessionEnergy} kWh @ {currentSt.type}
              </div>
            </div>

            {/* Battery Thermal & Degradation Risk */}
            <div className="glass-panel p-3.5 rounded-2xl border border-red-500/20 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>C-RATE & HEALTH</span>
                <span className="font-mono text-white font-bold">{currentSt.cRate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono mt-1 text-slate-200">
                {selectedStation === 'S3' ? (
                  <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                ) : selectedStation === 'S2' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <BatteryCharging className="w-3.5 h-3.5 text-red-400 shrink-0" />
                )}
                <span>{currentSt.health}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800">
                {currentSt.thermalImpact}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Showcase Informative Footer */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400 text-left">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-red-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
              Interactive Simulator
            </span>
            <span>·</span>
            <span>Switch docks to test instant charging rates and battery wear</span>
          </div>

          <div className="text-slate-300">
            For full 10-vehicle fleet optimization, tune the sliders in Chapter 05 below.
          </div>
        </div>
      </div>

      {/* KPI Highlight Strip Below Showcase (24h Full Fleet Metrics) */}
      {kpis && (
        <div className="max-w-4xl w-full mt-10">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Full 10-Vehicle Fleet Daily Economics ( Delhi NCR 24h Window )
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-red-500/20 text-left hover:border-red-400/40 transition-all">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
                <span>OPTIMIZED FLEET COST</span>
                <TrendingDown className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
                ₹{kpis.total_optimized_cost_inr.toLocaleString()}
              </div>
              <div className="text-xs text-red-400 font-mono mt-1 font-semibold">
                Saved ₹{kpis.savings_inr.toLocaleString()} / day ({kpis.savings_percent}% reduction)
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-red-500/20 text-left hover:border-red-400/40 transition-all">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
                <span>ON-TIME READINESS</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300">
                {kpis.ready_on_time_pct}%
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                15% mandatory safety buffer enforced
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-red-500/20 text-left hover:border-red-400/40 transition-all">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
                <span>FLEET SCALE</span>
                <Zap className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-rose-300">
                10 EVs / 3 Stations
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                24-Hour Time-of-Day Grid Arbitrage
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explore Button */}
      <div className="flex flex-col items-center mt-10 gap-3">
        <button
          onClick={onExploreClick}
          className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold font-display tracking-wider shadow-[0_0_30px_rgba(255,30,66,0.5)] active:scale-95 hover:brightness-110 transition-all"
        >
          <span>Explore Fleet Telemetry & Optimization</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
