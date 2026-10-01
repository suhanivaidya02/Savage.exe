import React from 'react';
import { Zap } from 'lucide-react';

interface CinematicCarHeroProps {
  scrollProgress: number;
  activeSection: string;
  reduceMotion: boolean;
}

const SECTION_NAMES: Record<string, string> = {
  hero: '01 · Vehicle Showcase',
  problem: '02 · Fleet Crisis',
  fleet: '03 · Fleet Telemetry',
  agents: '04 · 7-Agent Pipeline',
  optimizer: '05 · MILP Tuning',
  schedule: '06 · Charging Gantt',
  savings: '07 · Arbitrage Savings',
  explain: '08 · AI Provenance',
  disrupt: '09 · What-If Scenarios',
  approval: '10 · Dispatch Approval',
};

export const CinematicCarHero: React.FC<CinematicCarHeroProps> = ({
  scrollProgress,
  activeSection,
}) => {
  const currentChapter = SECTION_NAMES[activeSection] || '01 · Vehicle Showcase';

  return (
    <div className="fixed top-[57px] left-0 right-0 z-30 pointer-events-none">
      {/* 2px Kinetic Neon Scroll Progress Line */}
      <div className="w-full h-[2px] bg-slate-900/60 relative">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 shadow-[0_0_8px_#00e5ff] transition-all duration-150 ease-out"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />

        {/* Micro indicator gliding on the line */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] flex items-center justify-center transition-all duration-150 ease-out"
          style={{ left: `${Math.round(scrollProgress * 100)}%` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-black" />
        </div>
      </div>

      {/* Floating Micro Chapter Capsule */}
      <div className="max-w-7xl mx-auto px-4 flex justify-end pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#05080f]/90 border border-cyan-500/25 text-[11px] font-mono text-cyan-300 backdrop-blur-md shadow-lg pointer-events-auto">
          <Zap className="w-3 h-3 text-cyan-400 fill-current animate-pulse" />
          <span className="text-slate-400 uppercase tracking-wider text-[10px]">Active Chapter:</span>
          <span className="font-bold text-white">{currentChapter}</span>
          <span className="text-slate-500">|</span>
          <span className="text-neon-green font-bold">{Math.round(scrollProgress * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
