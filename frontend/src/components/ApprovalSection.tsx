import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DisruptionDiff } from '../types';

interface ApprovalSectionProps {
  hasPendingApproval: boolean;
  pendingDiff: DisruptionDiff | null;
  onApprove: () => Promise<void>;
  isLoading: boolean;
}

export const ApprovalSection: React.FC<ApprovalSectionProps> = ({
  hasPendingApproval,
  pendingDiff,
  onApprove,
  isLoading,
}) => {
  const [celebrated, setCelebrated] = useState(false);

  const handleApproveClick = async () => {
    await onApprove();
    setCelebrated(true);

    confetti({
      particleCount: 130,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ff1e42', '#ff6b2b', '#ff3366', '#ffffff'],
    });
  };

  return (
    <section id="approval" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>OPERATOR GOVERNANCE & APPROVAL TERMINAL</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          Human-in-the-Loop Governance
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto mt-3 text-sm sm:text-base">
          AI recommends, but humans approve. Fleet managers retain final authority before schedule adjustments
          are deployed to live depot charging bays.
        </p>
      </div>

      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-red-500/30 text-center relative overflow-hidden shadow-2xl">
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {hasPendingApproval ? (
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 animate-pulse">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
              Disruption Replan Awaiting Approval
            </h3>
            <p className="text-sm text-slate-300 max-w-lg mb-6 leading-relaxed">
              {pendingDiff?.disruption.summary ||
                'A schedule revision has been formulated by the optimization agent. Click below to verify and deploy.'}
            </p>

            <button
              onClick={handleApproveClick}
              disabled={isLoading}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold text-base font-display shadow-[0_0_30px_rgba(255,30,66,0.6)] hover:scale-105 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isLoading ? 'Authorizing Dispatch...' : 'Approve New Fleet Plan'}</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400 mt-3">
              Commits changes to real-time depot dispatcher & clears alert state
            </span>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            {/* Glowing Finish Station Graphic in Hot Red */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600/20 to-amber-600/20 border border-red-500 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_40px_rgba(255,30,66,0.4)]">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
              Fleet Fully Optimized & Approved
            </h3>
            <p className="text-sm text-slate-300 max-w-md mb-8">
              All 20 vehicles scheduled for 100% on-time readiness with zero peak tariff penalties.
              The electric sedan has arrived at the Depot Finish Terminal!
            </p>

            {/* Glowing Station Bays Visual */}
            <div className="grid grid-cols-3 gap-3 max-w-md w-full mb-6 text-xs font-mono">
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300">
                <div className="font-bold">S1 DEPOT</div>
                <div className="text-[10px] text-slate-400 mt-1">6/6 Bays Active</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300">
                <div className="font-bold">S2 SOLAR</div>
                <div className="text-[10px] text-slate-400 mt-1">4/4 Solar Green</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300">
                <div className="font-bold">S3 DC FAST</div>
                <div className="text-[10px] text-slate-400 mt-1">2/2 Controlled</div>
              </div>
            </div>

            <button
              onClick={() => {
                confetti({
                  particleCount: 90,
                  spread: 65,
                  origin: { y: 0.6 },
                  colors: ['#ff1e42', '#ff6b2b', '#ff3366'],
                });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border border-red-500/40 text-xs font-mono text-red-400 hover:text-white hover:border-red-400 transition-all"
            >
              <Sparkles className="w-4 h-4 text-red-400" />
              <span>Celebrate Fleet Victory</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
