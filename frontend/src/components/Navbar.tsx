import React from 'react';
import { Zap, Database, ShieldAlert, CheckCircle2, EyeOff, Eye, HelpCircle } from 'lucide-react';
import { KPIs } from '../types';

interface NavbarProps {
  kpis: KPIs | null;
  activeSection: string;
  reduceMotion: boolean;
  onToggleReduceMotion: () => void;
  mockMode: boolean;
  onToggleMockMode: () => void;
  approvalStatus: string;
  onOpenGuide?: () => void;
}

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'problem', label: 'Problem' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'agents', label: 'Agents' },
  { id: 'optimizer', label: 'Optimizer' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'savings', label: 'Savings' },
  { id: 'explain', label: 'Explain' },
  { id: 'disrupt', label: 'Disrupt' },
  { id: 'approval', label: 'Approval' },
];

export const Navbar: React.FC<NavbarProps> = ({
  kpis,
  activeSection,
  reduceMotion,
  onToggleReduceMotion,
  mockMode,
  onToggleMockMode,
  approvalStatus,
  onOpenGuide,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-3 transition-all duration-300 backdrop-blur-md bg-[#070305]/85 border-b border-red-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-500/30">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-wider font-display text-white">
                VIREXA
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                Hot Red Edition
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-tight hidden sm:block">
              Commercial EV Energy Optimizer
            </p>
          </div>
        </div>

        {/* Floating Live KPIs Pill (Click to jump to Chapter 5 Optimizer Sliders!) */}
        {kpis && (
          <button
            onClick={() => scrollTo('optimizer')}
            title="Click to jump to Chapter 05: Optimizer Controls & live sliders"
            className="hidden lg:flex items-center gap-3.5 px-4 py-1.5 rounded-full glass-pill text-xs hover:border-red-400/60 hover:bg-red-950/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-red-400 font-mono font-bold text-[10px] uppercase tracking-wider">
              <Zap className="w-3 h-3 text-red-500 fill-current animate-pulse" />
              <span>24h Fleet Total:</span>
            </div>
            <div className="w-px h-3 bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Optimized:</span>
              <span className="font-mono font-bold text-white group-hover:text-red-200">₹{kpis.total_optimized_cost_inr.toLocaleString()}</span>
            </div>
            <div className="w-px h-3 bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Savings:</span>
              <span className="font-mono font-bold text-red-400">₹{kpis.savings_inr.toLocaleString()} ({kpis.savings_percent}%)</span>
            </div>
            <div className="w-px h-3 bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">On-Time:</span>
              <span className="font-mono font-bold text-amber-300">{kpis.ready_on_time_pct}%</span>
            </div>
            {approvalStatus === "PENDING_APPROVAL" ? (
              <div className="flex items-center gap-1 text-[11px] text-amber-300 animate-pulse ml-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="font-semibold">Re-plan Pending</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-red-400 ml-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Live Active</span>
              </div>
            )}
          </button>
        )}

        {/* Section Dots / Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollTo(sec.id)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors duration-200 ${
                  isActive
                    ? 'text-red-400 bg-red-950/40 border border-red-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </nav>

        {/* Controls: Guide, Mock Mode & Reduce Motion */}
        <div className="flex items-center gap-2">
          {/* Feature Guide Button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-red-500/40 text-red-200 hover:text-white hover:border-red-400 transition-all shadow-md font-mono"
            >
              <HelpCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          )}
          <button
            onClick={onToggleMockMode}
            title={mockMode ? "Running in Offline Mock Mode" : "Connected to Live FastAPI Backend"}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
              mockMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <Database className="w-3 h-3" />
            <span className="font-mono text-[11px]">{mockMode ? "MOCK" : "API"}</span>
          </button>

          <button
            onClick={onToggleReduceMotion}
            title={reduceMotion ? "Enable Smooth Scroll & Motion" : "Reduce Motion / Low Spec"}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500 transition-all"
          >
            {reduceMotion ? <EyeOff className="w-3 h-3 text-amber-400" /> : <Eye className="w-3 h-3 text-red-400" />}
            <span className="hidden sm:inline font-mono text-[11px]">{reduceMotion ? "Reduced" : "Motion"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
