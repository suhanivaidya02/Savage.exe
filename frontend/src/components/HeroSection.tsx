import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  TrendingDown,
  Cpu,
  Sparkles,
  BatteryCharging,
  Sun,
  Moon,
  Flame,
  Gauge,
  ArrowDown,
  HelpCircle,
  Sliders,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  IndianRupee,
  Clock,
  Car
} from 'lucide-react';
import { KPIs } from '../types';
import { MinimalHeroCyberCar } from './scene/MinimalHeroCyberCar';

interface HeroSectionProps {
  kpis: KPIs | null;
  onExploreClick: () => void;
  onStationSelect?: (color: string) => void;
  onOpenGuide?: () => void;
  onTuneOptimizerClick?: () => void;
  onGoToSchedule?: () => void;
  onGoToSavings?: () => void;
  onGoToDisruption?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  kpis,
  onExploreClick,
  onStationSelect,
  onOpenGuide,
  onTuneOptimizerClick,
  onGoToSchedule,
  onGoToSavings,
  onGoToDisruption,
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
      name: 'S1 Depot Main (Night Off-Peak)',
      power: '7.2 kW',
      rate: '₹5.00/kWh',
      type: 'Night Off-Peak (23:00 - 06:00)',
      cRate: '0.22C',
      health: 'Safe & Gentle (0% Battery Wear)',
      color: '#ff1e42',
      badgeColor: 'text-red-400 bg-red-950/60 border-red-500/40',
      sessionCost: 36,
      sessionEnergy: 7.2,
      savingsVsFast: 206,
      thermalImpact: 'Zero Battery Degradation (Pack stays cool)',
    },
    S2: {
      name: 'S2 Solar Canopy (Clean Solar)',
      power: '7.2 kW',
      rate: '₹6.00/kWh',
      type: 'Midday Solar (10:00 - 15:00)',
      cRate: '0.22C',
      health: '100% Clean Green Energy',
      color: '#ff6b2b',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
      sessionCost: 43.2,
      sessionEnergy: 7.2,
      savingsVsFast: 198.8,
      thermalImpact: 'Zero Carbon Footprint (Eco Optimal)',
    },
    S3: {
      name: 'S3 DC Fast (Evening Grid Peak)',
      power: '22.0 kW',
      rate: '₹11.00/kWh',
      type: 'Evening Grid Peak (17:00 - 21:00)',
      cRate: '0.85C',
      health: 'High Thermal Stress (+12% Degradation)',
      color: '#ff0033',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/40',
      sessionCost: 242,
      sessionEnergy: 22.0,
      savingsVsFast: 0,
      thermalImpact: 'Severe Cell Wear & Accelerated Aging',
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
      {/* Minimal Red & Black Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none animate-minimal-pulse" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-red-950/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Tagline Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d0407]/90 border border-red-500/40 text-red-400 text-xs font-mono mb-4 shadow-lg shadow-red-500/15 backdrop-blur-md">
        <Cpu className="w-3.5 h-3.5 text-red-400 animate-pulse" />
        <span className="font-semibold tracking-wider uppercase">Autonomous Commercial EV Fleet Energy Engine</span>
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        <span className="text-slate-400 hidden sm:inline">Delhi NCR Grid Arbitrage</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-display text-white tracking-tight leading-[1.05]">
        VIREXA
      </h1>

      <p className="text-xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 mt-2 font-display tracking-tight">
        Charge Smart. Run Longer. Spend Less.
      </p>

      {/* Clear English Subtitle */}
      <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-3 leading-relaxed font-normal">
        Unmanaged charging triggers crushing peak tariffs and rapid battery degradation. 
        <strong className="text-white"> Virexa AI schedules every vehicle during lowest-cost hours </strong> 
        (Night off-peak at &#8377;5/kWh and Midday solar at &#8377;6/kWh) — slashing fleet electricity costs by <span className="text-red-400 font-bold font-mono">54%</span> while ensuring 100% on-time delivery departure!
      </p>

      {/* HOW IT WORKS IN 3 SIMPLE STEPS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl w-full my-6 text-left">
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 bg-[#0a0306]/80 hover:border-red-500/40 transition-all flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            1
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <span>Plug In & Park</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Drivers plug into depot or solar charging bays upon completing their daily delivery shifts.
            </p>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 bg-[#0a0306]/80 hover:border-amber-500/40 transition-all flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            2
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <span>AI Arbitrage Scheduling</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Virexa schedules charging during cheapest night (&#8377;5/kWh) and clean solar (&#8377;6/kWh) windows.
            </p>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 bg-[#0a0306]/80 hover:border-emerald-500/40 transition-all flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            3
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <span>Guaranteed Departure</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Every EV reaches 100% target SoC before shift departure, with zero peak tariff penalties!
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
        <button
          onClick={onTuneOptimizerClick || onExploreClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono text-xs font-bold shadow-md shadow-red-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Tune Live Optimizer Sliders</span>
        </button>

        {onGoToSchedule && (
          <button
            onClick={onGoToSchedule}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-red-400 text-slate-200 hover:text-white font-mono text-xs font-semibold backdrop-blur-md transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-red-400" />
            <span>View 24-Hour Fleet Schedule</span>
          </button>
        )}

        {onGoToSavings && (
          <button
            onClick={onGoToSavings}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-emerald-400 text-slate-200 hover:text-white font-mono text-xs font-semibold backdrop-blur-md transition-all"
          >
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            <span>Financial ROI & Savings</span>
          </button>
        )}

        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-red-500/30 text-red-300 hover:text-white hover:border-red-400 font-mono text-xs font-semibold backdrop-blur-md transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-red-400" />
            <span>System Architecture Guide</span>
          </button>
        )}
      </div>

      {/* ================= 3D WEBGL CAR STAGE & HOLOGRAPHIC TELEMETRY HUD ================= */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-5xl mt-2 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-red-950/20 via-slate-950/40 to-transparent border border-red-500/25 shadow-2xl backdrop-blur-sm group"
      >
        {/* Top Control Bar: Station Selector */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">
              Live 3D EV Rig · Test Station Profiles
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
              <Moon className="w-3.5 h-3.5 inline mr-1 text-slate-300" />
              S1 Depot (Night &#8377;5)
            </button>
            <button
              onClick={() => handleSelect('S2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedStation === 'S2'
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 inline mr-1 text-amber-300" />
              S2 Solar (Clean &#8377;6)
            </button>
            <button
              onClick={() => handleSelect('S3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedStation === 'S3'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 inline mr-1 text-rose-300" />
              S3 DC Fast (Peak &#8377;11)
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
                <span>VEHICLE</span>
                <span className="text-red-400 font-bold">EV-HYPER-01</span>
              </div>
              <div className="text-lg font-bold text-white font-display">
                Fleet Sports EV
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 text-xs font-mono">
                <Gauge className="w-3.5 h-3.5 text-red-400" />
                <span className="text-slate-300">Battery Pack: 65.0 kWh</span>
              </div>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-red-500/20 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>CURRENT BATTERY (SOC)</span>
                <span className="text-red-400 font-bold">78% Full</span>
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

          {/* Center Stage: Minimalist Red & Black Holographic Cyber Car */}
          <div className="relative flex-1 w-full flex items-center justify-center">
            <MinimalHeroCyberCar
              stationKey={selectedStation}
              stationColor={currentSt.color}
              stationName={currentSt.name}
              power={currentSt.power}
            />
          </div>

          {/* Right Floating HUD: Station Economics, Session Math & Degradation */}
          <div
            className="w-full lg:w-64 space-y-3 z-10 transition-transform duration-200"
            style={{
              transform: `translateX(${-mousePos.x * 8}px) translateY(${-mousePos.y * 8}px)`,
            }}
          >
            <div className="glass-panel p-3.5 rounded-2xl border border-red-500/20 text-left">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>1-HOUR CHARGING SESSION</span>
                <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${currentSt.badgeColor}`}>
                  {currentSt.rate}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white mt-1">
                &#8377;{currentSt.sessionCost}
                <span className="text-xs font-normal text-slate-400 font-sans ml-1">/ 1 hr session</span>
              </div>

              {/* Real-time Math Proof */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Energy Delivered:</span>
                  <span className="text-white font-bold">{currentSt.sessionEnergy} kWh</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Rate per kWh:</span>
                  <span className="text-red-400 font-bold">{currentSt.rate}</span>
                </div>
                {currentSt.savingsVsFast > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-slate-800/80">
                    <span>1-Hr Savings:</span>
                    <span>+&#8377;{currentSt.savingsVsFast.toFixed(0)} saved!</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-red-500/20 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>BATTERY HEALTH IMPACT</span>
                <span className="text-emerald-400 font-bold font-mono text-[10px]">C-RATE: {currentSt.cRate}</span>
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">
                {currentSt.health}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                {currentSt.thermalImpact}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Real-time Fleet KPI Bar */}
        {kpis && (
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-2xl border border-red-500/20 text-left hover:border-red-400/40 transition-all">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
                  <span>TOTAL 24H FLEET BILL</span>
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
                  &#8377;{kpis.total_optimized_cost_inr.toLocaleString()}
                </div>
                <div className="text-xs text-red-400 font-mono mt-1 font-semibold">
                  Saved &#8377;{kpis.savings_inr.toLocaleString()} / day ({kpis.savings_percent}% reduction)
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
                <div className="text-xs text-slate-300 font-mono mt-1">
                  100% Guaranteed shift departure
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-red-500/20 text-left hover:border-red-400/40 transition-all">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
                  <span>FLEET SCALE</span>
                  <Zap className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-rose-300">
                  10 Commercial EVs
                </div>
                <div className="text-xs text-slate-300 font-mono mt-1">
                  Delhi NCR Time-of-Day Grid Arbitrage
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
