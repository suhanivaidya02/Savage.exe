import React from 'react';
import { Zap, BatteryCharging, Shield, Activity, Radio, Cpu } from 'lucide-react';

interface MinimalHeroCyberCarProps {
  stationKey: 'S1' | 'S2' | 'S3';
  stationColor: string;
  stationName: string;
  power: string;
}

export const MinimalHeroCyberCar: React.FC<MinimalHeroCyberCarProps> = ({
  stationKey,
  stationColor,
  stationName,
  power,
}) => {
  return (
    <div className="relative w-full max-w-xl h-64 sm:h-72 flex items-center justify-center select-none">
      {/* 1. Ambient Minimalist Cyber Dais Glow */}
      <div
        className="absolute w-80 h-32 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: stationColor }}
      />

      {/* 2. Concentric Minimal Rotating Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer Ring */}
        <div
          className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-red-500/10 border-dashed animate-spin-slow"
          style={{ animationDuration: '30s' }}
        />
        {/* Inner Counter-Rotating Ring */}
        <div
          className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-red-500/15"
          style={{
            borderLeftColor: stationColor,
            borderRightColor: 'transparent',
            animation: 'spinSlow 14s linear infinite reverse',
          }}
        />
      </div>

      {/* 3. Minimalist Red & Black Vector Futuristic EV Silhouette */}
      <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center">
        <svg
          viewBox="0 0 420 160"
          className="w-full h-auto drop-shadow-[0_0_20px_rgba(255,30,66,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Contact Shadow Line */}
          <line
            x1="50"
            y1="148"
            x2="370"
            y2="148"
            stroke="rgba(255, 30, 66, 0.2)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Underglow Ground Reflection */}
          <ellipse
            cx="210"
            cy="146"
            rx="130"
            ry="6"
            fill={stationColor}
            opacity="0.25"
          />

          {/* Sleek Aerodynamic Sports EV Silhouette Contours */}
          <path
            d="M 50 135 L 75 135 C 80 120, 110 120, 115 135 L 285 135 C 290 120, 320 120, 325 135 L 375 135 C 385 135, 395 125, 388 112 L 360 88 C 345 76, 320 68, 290 64 L 235 52 C 190 42, 145 52, 115 70 L 65 98 C 52 106, 42 118, 50 135 Z"
            stroke={stationColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
            fill="#090306"
          />

          {/* Aerodynamic Cockpit Glass Canopy */}
          <path
            d="M 145 68 C 175 50, 215 48, 255 58 L 295 68 C 302 71, 304 77, 298 82 L 155 82 C 145 82, 138 75, 145 68 Z"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.5"
            fill="rgba(255, 30, 66, 0.12)"
          />

          {/* Side Body Aerodynamic Sculpt Line */}
          <path
            d="M 70 106 Q 160 96 260 92 Q 330 90 370 102"
            stroke="rgba(255, 30, 66, 0.35)"
            strokeWidth="1.2"
          />

          {/* Front Laser Headlight Cluster */}
          <path
            d="M 46 112 L 68 108 L 62 118 Z"
            fill={stationColor}
            className="animate-pulse"
          />
          <line
            x1="46"
            y1="112"
            x2="10"
            y2="114"
            stroke={stationColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Rear Cyber Light Bar */}
          <line
            x1="375"
            y1="102"
            x2="388"
            y2="112"
            stroke="#ff0033"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Front Wheel Core */}
          <circle
            cx="95"
            cy="135"
            r="19"
            stroke={stationColor}
            strokeWidth="2"
            fill="#050203"
          />
          <circle cx="95" cy="135" r="9" stroke="rgba(255, 30, 66, 0.5)" strokeWidth="1.5" />
          <circle cx="95" cy="135" r="3" fill="#ffffff" />

          {/* Rear Wheel Core */}
          <circle
            cx="305"
            cy="135"
            r="19"
            stroke={stationColor}
            strokeWidth="2"
            fill="#050203"
          />
          <circle cx="305" cy="135" r="9" stroke="rgba(255, 30, 66, 0.5)" strokeWidth="1.5" />
          <circle cx="305" cy="135" r="3" fill="#ffffff" />

          {/* Battery Pack Sub-Chassis Array (78% SoC Visualization) */}
          <g transform="translate(130, 110)">
            {/* Battery housing */}
            <rect
              x="0"
              y="0"
              width="140"
              height="16"
              rx="4"
              stroke="rgba(255, 30, 66, 0.35)"
              strokeWidth="1"
              fill="#060204"
            />
            {/* 10 Battery Cell Segments */}
            {Array.from({ length: 10 }).map((_, idx) => {
              const isFilled = idx < 8; // 78% SoC
              return (
                <rect
                  key={idx}
                  x={4 + idx * 13.2}
                  y={3}
                  width="10"
                  height="10"
                  rx="2"
                  fill={isFilled ? stationColor : 'rgba(255, 255, 255, 0.06)'}
                  opacity={isFilled ? '0.85' : '0.2'}
                />
              );
            })}
          </g>

          {/* Charging Coupler & Wireless Energy Induction Beam */}
          <g transform="translate(195, 126)">
            {/* Holographic Coupler Cone */}
            <line
              x1="5"
              y1="0"
              x2="5"
              y2="20"
              stroke={stationColor}
              strokeWidth="2.5"
              strokeDasharray="2 3"
              className="animate-pulse"
            />
            <circle cx="5" cy="20" r="4" fill={stationColor} />
          </g>

          {/* Technical HUD Crosshairs & Labels */}
          <g className="text-[7px] font-mono fill-slate-400">
            <text x="130" y="104">BATTERY PACK · 65 kWh (78%)</text>
            <text x="280" y="44" fill={stationColor}>DOCK LINK: ACTIVE</text>
          </g>
        </svg>

        {/* 4. Minimalist HUD Floating Capsule */}
        <div className="mt-2 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0d0407]/90 border border-red-500/35 text-[11px] font-mono shadow-xl backdrop-blur-md">
          <div
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: stationColor }}
          />
          <span className="text-slate-400 uppercase tracking-wider text-[10px]">Active Dock:</span>
          <span className="font-bold text-white">{stationName.split('(')[0]}</span>
          <span className="text-slate-600">·</span>
          <span className="font-bold" style={{ color: stationColor }}>
            {power}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            Connected
          </span>
        </div>
      </div>
    </div>
  );
};

export default MinimalHeroCyberCar;
