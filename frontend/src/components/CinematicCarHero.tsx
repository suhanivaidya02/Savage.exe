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
  optimizer: '05 · Live MILP Tuning',
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
    <div className="fixed bottom-4 right-4 z-30 pointer-events-none transition-opacity duration-300">
      {/* Floating Minimal Chapter Capsule */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050204]/90 border border-white/10 text-[11px] font-mono text-slate-300 backdrop-blur-md shadow-xl pointer-events-auto">
        <Zap className="w-3 h-3 text-red-500 fill-current animate-pulse" />
        <span className="text-slate-400 uppercase tracking-wider text-[10px]">Chapter:</span>
        <span className="font-semibold text-white">{currentChapter}</span>
        <span className="text-slate-600">|</span>
        <span className="text-red-400 font-bold">{Math.round(scrollProgress * 100)}%</span>
      </div>
    </div>
  );
};

export default CinematicCarHero;
