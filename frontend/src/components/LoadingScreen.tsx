import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 150);
          return 100;
        }
        return prev + 10;
      });
    }, 18);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070305] text-white">
      {/* Background glow in Hot Red */}
      <div className="absolute w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center">
        {/* Animated Hot Red Energy Ring */}
        <div className="relative flex items-center justify-center w-28 h-28 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255, 30, 66, 0.15)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#ff1e42"
              strokeWidth="6"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-red-400">
            <Zap className="w-8 h-8 animate-pulse text-red-500 fill-current" />
            <span className="text-xs font-mono font-bold mt-1 text-slate-200">{progress}%</span>
          </div>
        </div>

        {/* Brand Header */}
        <h1 className="text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 font-display">
          VIREXA
        </h1>
        <p className="text-sm font-medium tracking-widest uppercase text-slate-400 mt-2 font-mono">
          AI Energy & EV Fleet Optimization
        </p>

        {/* Status bar */}
        <div className="w-64 h-1.5 bg-slate-900 rounded-full mt-6 overflow-hidden border border-red-500/20">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-mono text-red-400/90 mt-3">
          Initializing 7-Agent Autonomous Pipeline & 3D WebGL Rig...
        </span>
      </div>
    </div>
  );
};
