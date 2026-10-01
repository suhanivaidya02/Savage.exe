import React from 'react';
import { Zap, Database, CheckCircle2, ShieldAlert, EyeOff, Eye, HelpCircle } from 'lucide-react';
import { KPIs } from '../types';

interface NavbarProps {
  kpis: KPIs | null;
  activeSection: string;
  scrollProgress?: number;
  reduceMotion: boolean;
  onToggleReduceMotion: () => void;
  mockMode: boolean;
  onToggleMockMode: () => void;
  approvalStatus: string;
  onOpenGuide?: () => void;
}

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'optimizer', label: 'Optimizer' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'savings', label: 'Savings' },
  { id: 'disrupt', label: 'Scenarios' },
  { id: 'approval', label: 'Dispatch' },
];

export const Navbar: React.FC<NavbarProps> = ({
  kpis,
  activeSection,
  scrollProgress = 0,
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
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-2.5 transition-all duration-300 backdrop-blur-xl bg-[#050204]/90 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Minimalist Brand Wordmark */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => scrollTo('hero')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-white fill-current" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-wider font-display text-white">
              VIREXA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff1e42]" />
          </div>
        </div>

        {/* Clean Center Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollTo(sec.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'text-red-400 bg-red-950/40 border border-red-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </nav>

        {/* Clean Right Controls & Status */}
        <div className="flex items-center gap-2.5">
          {/* Minimal KPI Savings Quick Indicator */}
          {kpis && (
            <button
              onClick={() => scrollTo('optimizer')}
              title="Click to tune 24h optimizer sliders"
              className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/30 border border-red-500/25 hover:border-red-400/60 transition-all font-mono text-xs cursor-pointer"
            >
              <span className="text-slate-400 text-[11px]">Saved:</span>
              <span className="font-bold text-red-400 text-[11px]">
                ₹{kpis.savings_inr.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                ({kpis.savings_percent}%)
              </span>
              {approvalStatus === 'PENDING_APPROVAL' ? (
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse ml-1" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 ml-1" />
              )}
            </button>
          )}

          {/* Interactive Guide Button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              title="Open Feature Guide"
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-red-500/40 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline font-mono text-[11px]">Guide</span>
            </button>
          )}

          {/* Live / Mock Mode Toggle */}
          <button
            onClick={onToggleMockMode}
            title={mockMode ? 'Running in Offline Mock Mode' : 'Connected to Live FastAPI Backend'}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-all font-mono text-[11px] ${
              mockMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>{mockMode ? 'MOCK' : 'API'}</span>
          </button>

          {/* Motion Toggle */}
          <button
            onClick={onToggleReduceMotion}
            title={reduceMotion ? 'Enable Smooth Motion' : 'Reduce Motion'}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-red-500/40 transition-all"
          >
            {reduceMotion ? (
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-red-400" />
            )}
          </button>
        </div>
      </div>

      {/* Built-in 1.5px Kinetic Hot Red Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-slate-900/60">
        <div
          className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 shadow-[0_0_8px_#ff1e42] transition-all duration-75"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>
    </header>
  );
};

export default Navbar;
