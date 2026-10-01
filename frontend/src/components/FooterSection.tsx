import React from 'react';
import { Zap } from 'lucide-react';

export const FooterSection: React.FC = () => {
  return (
    <footer className="relative border-t border-red-500/20 bg-[#040103] px-4 py-16 text-slate-400 text-xs z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="text-lg font-extrabold font-display text-white tracking-wider">
              VIREXA
            </span>
          </div>
          <p className="text-slate-400 text-xs max-w-sm">
            AI Energy & EV Fleet Optimization Agent. Charge smart. Run longer. Spend less.
          </p>
          <span className="text-[11px] font-mono text-red-400/80 mt-2">
            Built for AI Hackathon 2026 · Hot Red Cyber Edition · Delhi NCR Fleet Grid
          </span>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
            Python 3.13 + FastAPI
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
            PuLP MILP Solver
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
            Three.js + R3F 3D Rig
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
            Lenis + GSAP ScrollTrigger
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
            React 18 + Vite + TS
          </span>
        </div>

        {/* Team & Copyright */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right font-mono text-[11px]">
          <div className="text-white font-medium mb-1">
            Developed by Team Virexa
          </div>
          <div className="text-slate-500">
            © 2026 Virexa AI Fleet Systems. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
