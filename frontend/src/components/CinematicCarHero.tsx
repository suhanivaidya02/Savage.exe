import React, { useEffect, useRef } from 'react';
import { Zap, BatteryCharging, Gauge } from 'lucide-react';

interface CinematicCarHeroProps {
  scrollProgress: number; // 0.0 to 1.0
  activeSection: string;
  reduceMotion: boolean;
}

export const CinematicCarHero: React.FC<CinematicCarHeroProps> = ({
  scrollProgress,
  activeSection,
  reduceMotion,
}) => {
  const carRef = useRef<HTMLDivElement>(null);
  const frontWheelRef = useRef<SVGGElement>(null);
  const rearWheelRef = useRef<SVGGElement>(null);

  // Derive dynamic state from scroll progress
  // Car horizontal position spans across the highway: 5% to 85%
  const carXPercent = Math.min(85, Math.max(5, 5 + scrollProgress * 80));

  // Wheel rotation calculation (degrees)
  const wheelRotation = (scrollProgress * 3600) % 360;

  // Determine time-of-day sky and lighting
  // 0.0 - 0.2: Morning Dawn
  // 0.2 - 0.5: Solar Noon
  // 0.5 - 0.8: Evening Peak
  // 0.8 - 1.0: Deep Night
  let skyGradient = 'from-[#070b16] via-[#0b1426] to-[#05080f]';
  let isNight = false;
  let headlightIntensity = 0.5;

  if (scrollProgress < 0.25) {
    // Dawn
    skyGradient = 'from-[#0b1b36] via-[#102a4e] to-[#070d1a]';
    headlightIntensity = 0.6;
  } else if (scrollProgress < 0.55) {
    // Solar Day
    skyGradient = 'from-[#0a2744] via-[#0e3b5e] to-[#081729]';
    headlightIntensity = 0.3;
  } else if (scrollProgress < 0.75) {
    // Evening Sunset
    skyGradient = 'from-[#2a1334] via-[#3a1b38] to-[#0e071a]';
    headlightIntensity = 0.8;
  } else {
    // Deep Night
    skyGradient = 'from-[#020409] via-[#060a14] to-[#04060b]';
    isNight = true;
    headlightIntensity = 1.0;
  }

  // Dynamic Battery HUD State
  // Drains during transit (problem, fleet, schedule), charges at depot stations
  const isCharging = ['optimizer', 'schedule', 'savings', 'approval'].includes(activeSection);
  const batteryPct = isCharging
    ? Math.min(98, Math.round(55 + (scrollProgress * 43)))
    : Math.max(38, Math.round(92 - (scrollProgress * 54)));

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {/* Dynamic Time-of-Day Sky Backdrop */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${skyGradient} opacity-60 transition-colors duration-1000 ease-out`}
      />

      {/* Starfield at Night */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] transition-opacity duration-700 pointer-events-none ${
          isNight || scrollProgress > 0.7 ? 'opacity-40' : 'opacity-10'
        }`}
      />

      {/* Parallax Skyline Layer 1: Distant City Skyscrapers */}
      <div
        className="absolute bottom-28 left-0 right-0 h-48 opacity-25 transition-transform ease-out"
        style={{
          transform: reduceMotion ? 'none' : `translateX(-${(scrollProgress * 25) % 100}px)`,
        }}
      >
        <svg className="w-full h-full preserve-3d" viewBox="0 0 1600 200" fill="none">
          {/* Silhouettes of futuristic skyscrapers */}
          <rect x="50" y="40" width="60" height="160" fill="#00e5ff" fillOpacity="0.12" />
          <rect x="70" y="20" width="20" height="180" fill="#00e5ff" fillOpacity="0.2" />
          <rect x="150" y="80" width="90" height="120" fill="#1e293b" />
          <rect x="280" y="50" width="70" height="150" fill="#00e5ff" fillOpacity="0.1" />
          <rect x="390" y="90" width="110" height="110" fill="#1e293b" />
          <rect x="540" y="30" width="80" height="170" fill="#00e5ff" fillOpacity="0.15" />
          <polygon points="580,10 575,30 585,30" fill="#00e5ff" />
          <rect x="670" y="70" width="90" height="130" fill="#1e293b" />
          <rect x="800" y="45" width="120" height="155" fill="#00e5ff" fillOpacity="0.12" />
          <rect x="960" y="85" width="80" height="115" fill="#1e293b" />
          <rect x="1080" y="35" width="75" height="165" fill="#00e5ff" fillOpacity="0.18" />
          <rect x="1200" y="65" width="130" height="135" fill="#1e293b" />
          <rect x="1370" y="50" width="85" height="150" fill="#00e5ff" fillOpacity="0.1" />
          <rect x="1490" y="80" width="100" height="120" fill="#1e293b" />
        </svg>
      </div>

      {/* Parallax Skyline Layer 2: Midground Smart Grid Hub & Wind Turbines */}
      <div
        className="absolute bottom-24 left-0 right-0 h-36 opacity-35 transition-transform ease-out"
        style={{
          transform: reduceMotion ? 'none' : `translateX(-${(scrollProgress * 60) % 200}px)`,
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 1600 150" fill="none">
          {/* Solar canopy structures & transmission pylons */}
          <path d="M100 150 L120 70 L140 150" stroke="#00e5ff" strokeWidth="2" strokeOpacity="0.3" />
          <line x1="95" y1="90" x2="145" y2="90" stroke="#00e5ff" strokeWidth="2" strokeOpacity="0.3" />
          <path d="M500 150 L520 60 L540 150" stroke="#39ff88" strokeWidth="2" strokeOpacity="0.3" />
          <line x1="490" y1="80" x2="550" y2="80" stroke="#39ff88" strokeWidth="2" strokeOpacity="0.3" />
          <path d="M900 150 L920 70 L940 150" stroke="#00e5ff" strokeWidth="2" strokeOpacity="0.3" />
          <path d="M1300 150 L1320 65 L1340 150" stroke="#ffb703" strokeWidth="2" strokeOpacity="0.3" />
        </svg>
      </div>

      {/* Pinned Highway / Road Corridor (Layer 3) */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#090d18] border-t border-cyan-500/30 shadow-[0_-15px_35px_rgba(0,229,255,0.08)]">
        {/* Asphalt Texture and Road Lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 to-black/80" />

        {/* Moving Lane Dashes */}
        <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 overflow-hidden flex items-center">
          <div
            className="flex gap-12 w-[300%] transition-transform duration-75 ease-linear"
            style={{
              transform: reduceMotion ? 'none' : `translateX(-${(scrollProgress * 1200) % 200}px)`,
            }}
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-1 rounded-full bg-cyan-400/50 shadow-[0_0_8px_rgba(0,229,255,0.6)]"
              />
            ))}
          </div>
        </div>

        {/* Station Markers along the road */}
        <div className="absolute top-2 left-10 flex items-center gap-2 text-[10px] font-mono text-cyan-400/70">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>S1 DEPOT MAIN (6 BAYS)</span>
        </div>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono text-emerald-400/70">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>S2 SOLAR CANOPY (4 BAYS)</span>
        </div>
        <div className="absolute top-2 right-12 flex items-center gap-2 text-[10px] font-mono text-amber-400/70">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>S3 PUBLIC FAST DC (2 BAYS)</span>
        </div>
      </div>

      {/* THE ELECTRIC SEDAN & FLOATING BATTERY HUD CONTAINER */}
      <div
        ref={carRef}
        className="absolute bottom-16 transition-all duration-300 ease-out will-change-transform z-30"
        style={{
          left: `${carXPercent}%`,
          transform: 'translateX(-50%)',
        }}
      >
        {/* Floating Battery HUD */}
        <div className="relative -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-400/40 text-xs shadow-lg shadow-cyan-500/20">
            <div className="relative flex items-center justify-center">
              {isCharging ? (
                <BatteryCharging className="w-4 h-4 text-neon-green animate-pulse" />
              ) : (
                <Zap className="w-4 h-4 text-cyan-electric" />
              )}
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-slate-300 text-[11px]">SoC</span>
              <span
                className={`font-bold text-xs ${
                  batteryPct > 60 ? 'text-neon-green' : batteryPct > 35 ? 'text-cyan-300' : 'text-amber-400'
                }`}
              >
                {batteryPct}%
              </span>
            </div>
            {isCharging && (
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-neon-green/20 text-neon-green border border-neon-green/40">
                CHARGING
              </span>
            )}
          </div>

          {/* Animated Charge Cable when at charging station */}
          {isCharging && (
            <div className="w-0.5 h-6 bg-gradient-to-b from-neon-green to-cyan-400 animate-pulse mt-0.5 shadow-[0_0_8px_#39ff88]" />
          )}
        </div>

        {/* THE SLEEK ELECTRIC SEDAN SVG (Original Modern Design, No Trademarks) */}
        <div className={`relative w-48 sm:w-64 h-auto ${reduceMotion ? '' : 'animate-drive-bob'}`}>
          {/* Headlight Beam Projection */}
          <div
            className="absolute top-4 left-[96%] w-48 h-16 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: headlightIntensity,
              background: 'radial-gradient(ellipse at 0% 50%, rgba(0, 229, 255, 0.75) 0%, rgba(0, 229, 255, 0.15) 50%, transparent 80%)',
              transform: 'perspective(200px) rotateY(-30deg)',
              transformOrigin: 'left center',
            }}
          />

          {/* Taillight Crimson Glow */}
          <div
            className="absolute top-5 -left-6 w-12 h-8 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255, 51, 102, 0.8) 0%, transparent 70%)',
            }}
          />

          <svg
            viewBox="0 0 400 130"
            className="w-full h-auto drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Defs & Gradients */}
            <defs>
              {/* Car Body Metallic Cyan Gradient */}
              <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f2b48" />
                <stop offset="40%" stopColor="#0c233c" />
                <stop offset="100%" stopColor="#051221" />
              </linearGradient>

              {/* Glass Roof Gradient */}
              <linearGradient id="glassRoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.65" />
                <stop offset="70%" stopColor="#041628" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#020812" stopOpacity="1" />
              </linearGradient>

              {/* Wheel Rim Gradient */}
              <radialGradient id="wheelRimGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="80%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.7" />
              </radialGradient>
            </defs>

            {/* Aerodynamic Low Fastback Silhouette Body */}
            {/* Main Chasis Base */}
            <path
              d="M30 85 C30 85, 45 42, 110 32 C170 24, 250 25, 305 45 C345 56, 385 70, 390 85 C390 92, 380 96, 350 96 C335 96, 325 80, 295 80 C265 80, 255 96, 175 96 C155 96, 145 80, 115 80 C85 80, 75 96, 40 96 C30 96, 30 90, 30 85 Z"
              fill="url(#carBodyGrad)"
              stroke="#00e5ff"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />

            {/* Panoramic Glass Canopy Roof */}
            <path
              d="M115 36 C165 28, 240 28, 295 47 L285 64 C230 52, 160 52, 125 64 Z"
              fill="url(#glassRoofGrad)"
              stroke="#00e5ff"
              strokeWidth="1"
              strokeOpacity="0.4"
            />

            {/* Side Window Division Pillar */}
            <line x1="205" y1="31" x2="202" y2="60" stroke="#00e5ff" strokeWidth="1.5" strokeOpacity="0.5" />

            {/* Front Aggressive LED Matrix Headlight */}
            <polygon
              points="365,68 390,75 375,80"
              fill="#00e5ff"
              className="animate-pulse"
              filter="drop-shadow(0 0 6px #00e5ff)"
            />

            {/* Rear Full-Width Crimson Lightbar */}
            <path
              d="M30 76 L40 76 L36 82 L30 82 Z"
              fill="#ff3366"
              filter="drop-shadow(0 0 6px #ff3366)"
            />

            {/* Aerodynamic Side Crease Character Line */}
            <path
              d="M75 75 Q190 70 335 78"
              stroke="#00e5ff"
              strokeWidth="1"
              strokeOpacity="0.3"
            />

            {/* Flush Door Handles */}
            <rect x="160" y="70" width="18" height="2" rx="1" fill="#00e5ff" fillOpacity="0.6" />
            <rect x="235" y="70" width="18" height="2" rx="1" fill="#00e5ff" fillOpacity="0.6" />

            {/* REAR WHEEL ASSEMBLY */}
            <g
              ref={rearWheelRef}
              transform="translate(100, 96)"
              style={{
                transformOrigin: '100px 96px',
                transform: `rotate(${wheelRotation}deg)`,
              }}
            >
              {/* Outer Tire */}
              <circle cx="0" cy="0" r="22" fill="#0a0f1d" stroke="#1e293b" strokeWidth="2" />
              {/* Aero Rim Disc */}
              <circle cx="0" cy="0" r="16" fill="url(#wheelRimGrad)" />
              {/* Spokes */}
              <line x1="-14" y1="0" x2="14" y2="0" stroke="#00e5ff" strokeWidth="1.5" />
              <line x1="0" y1="-14" x2="0" y2="14" stroke="#00e5ff" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="4" fill="#00e5ff" />
            </g>

            {/* FRONT WHEEL ASSEMBLY */}
            <g
              ref={frontWheelRef}
              transform="translate(310, 96)"
              style={{
                transformOrigin: '310px 96px',
                transform: `rotate(${wheelRotation}deg)`,
              }}
            >
              {/* Outer Tire */}
              <circle cx="0" cy="0" r="22" fill="#0a0f1d" stroke="#1e293b" strokeWidth="2" />
              {/* Aero Rim Disc */}
              <circle cx="0" cy="0" r="16" fill="url(#wheelRimGrad)" />
              {/* Spokes */}
              <line x1="-14" y1="0" x2="14" y2="0" stroke="#00e5ff" strokeWidth="1.5" />
              <line x1="0" y1="-14" x2="0" y2="14" stroke="#00e5ff" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="4" fill="#00e5ff" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
