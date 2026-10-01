import React, { useState } from 'react';
import { MessageSquareText, CheckCircle2, AlertCircle, Search, ShieldCheck } from 'lucide-react';
import { VehicleExplanation } from '../types';

interface ExplainSectionProps {
  explanations: Record<string, VehicleExplanation>;
}

export const ExplainSection: React.FC<ExplainSectionProps> = ({ explanations }) => {
  const [selectedVid, setSelectedVid] = useState<string>('V07');
  const [filterText, setFilterText] = useState<string>('');

  const vehicleIds = Object.keys(explanations).sort();
  const filteredIds = vehicleIds.filter((id) =>
    id.toLowerCase().includes(filterText.toLowerCase())
  );

  const activeExp = explanations[selectedVid] || explanations[vehicleIds[0]];

  return (
    <section id="explain" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono mb-3">
          <MessageSquareText className="w-3.5 h-3.5" />
          <span>NATURAL LANGUAGE EXPLAINABILITY & PROVENANCE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          Explain Every Decision
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mt-3 text-sm sm:text-base">
          No black boxes. Every charging slot decision is translated into clear reasoning,
          with explicit tagging of verified physical inputs vs assumed model priors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vehicle Selector List */}
        <div className="lg:col-span-4 glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col max-h-[500px]">
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter vehicle ID..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
            {filteredIds.map((vid) => {
              const exp = explanations[vid];
              const isSelected = selectedVid === vid;
              return (
                <button
                  key={vid}
                  onClick={() => setSelectedVid(vid)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs font-mono flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-300">{vid}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                      {exp?.strategy || 'Plan'}
                    </span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    Audit
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Explainability & Provenance Card */}
        {activeExp && (
          <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/30 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Header: Vehicle ID and Strategy Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl font-black text-white bg-slate-900 px-3 py-1 rounded-lg border border-cyan-500/40">
                    {activeExp.vehicle_id}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      {activeExp.headline}
                    </h3>
                    <span className="text-xs font-mono text-cyan-400">
                      Strategy: {activeExp.strategy}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Audited Decision</span>
                </div>
              </div>

              {/* Natural Language Explanation Box */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 leading-relaxed mb-6">
                <p className="font-normal">{activeExp.explanation}</p>
              </div>

              {/* Key Decision Factors */}
              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Key Trade-off Factors:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeExp.key_factors.map((factor, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Provenance: GIVEN vs ASSUMED Chips */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">
                  Data Provenance Audit:
                </h4>

                <div className="space-y-3">
                  {/* GIVEN Inputs (Green Chips) */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>GIVEN INPUTS (Physical Facts & Hard Specs):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeExp.data_provenance.given.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ASSUMED Inputs (Amber Chips) */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>ASSUMED INPUTS (Model Priors & Tariffs):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeExp.data_provenance.assumed.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
