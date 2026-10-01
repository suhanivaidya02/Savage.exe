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
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05080f] text-white">
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center">
        {/* Animated Battery / Energy Ring */}
        <div className="relative flex items-center justify-center w-28 h-28 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(0, 229, 255, 0.15)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="6"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-cyan-400">
            <Zap className="w-8 h-8 animate-pulse text-cyan-electric" />
            <span className="text-xs font-mono font-bold mt-1 text-slate-300">{progress}%</span>
          </div>
        </div>

        {/* Brand Header */}
        <h1 className="text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400 font-display">
          VIREXA
        </h1>
        <p className="text-sm font-medium tracking-widest uppercase text-slate-400 mt-2">
          AI Energy & EV Fleet Optimization
        </p>

        {/* Status bar */}
        <div className="w-64 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-electric to-neon-green transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-mono text-cyan-400/80 mt-3">
          Initializing 7-Agent Autonomous Pipeline...
        </span>
      </div>
    </div>
  );
};
