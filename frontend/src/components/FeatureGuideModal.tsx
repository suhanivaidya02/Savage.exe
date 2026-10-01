import React, { useState } from 'react';
import {
  X,
  Zap,
  Info,
  Sliders,
  Calendar,
  TrendingDown,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  FileCheck,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BatteryCharging
} from 'lucide-react';

interface FeatureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const FeatureGuideModal: React.FC<FeatureGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateSection,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'math' | 'faq'>('overview');

  if (!isOpen) return null;

  const features = [
    {
      id: 'hero',
      num: '01',
      title: '3D WebGL Vehicle Rig & Station Simulator',
      icon: Zap,
      desc: 'Interactive 3D electric sedan on an illuminated cyber charging dock. Lets you switch between S1 Depot (₹5/kWh, gentle 7.2kW), S2 Solar Canopy (₹6/kWh, clean 7.2kW), and S3 DC Fast (₹11/kWh, high-stress 22kW) to simulate immediate charging costs and battery thermal impact.',
    },
    {
      id: 'problem',
      num: '02',
      title: 'The ₹58,000 Commercial Fleet Crisis',
      icon: AlertTriangle,
      desc: 'Explains the 3 major pitfalls of unmanaged commercial EV fleets: peak evening grid tariffs in Delhi NCR (₹11/kWh), excessive battery degradation from overuse of DC fast charging, and missed delivery shifts due to uncharged vehicles.',
    },
    {
      id: 'fleet',
      num: '03',
      title: 'Live 10-Vehicle Fleet Telemetry',
      icon: Cpu,
      desc: 'Real-time telemetry table for all 10 commercial delivery vehicles (EV-01 to EV-10) showing vehicle model, battery capacity (kWh), current State of Charge (SoC %), and assigned delivery shifts.',
    },
    {
      id: 'agents',
      num: '04',
      title: '7 Autonomous AI Agents Pipeline',
      icon: Sparkles,
      desc: 'A decentralized multi-agent system (Ingestion, Tariff Monitor, Battery Guardian, MILP Optimizer, Dispatcher, Explainability, Safety Auditor) that collaborates autonomously to plan and safeguard fleet energy.',
    },
    {
      id: 'optimizer',
      num: '05',
      title: 'Live Multi-Objective MILP Optimizer',
      icon: Sliders,
      desc: 'Client-side mathematical calculation engine. Drag the Cost, Battery Health, or Vehicle Availability sliders—or change Delhi NCR tariff rates—to instantly recompute total fleet cost, daily savings, and schedule slots with 0ms delay.',
    },
    {
      id: 'schedule',
      num: '06',
      title: '24-Hour Charging Gantt Matrix',
      icon: Calendar,
      desc: 'Interactive 24-hour dispatch schedule displaying exactly which vehicle charges at which hour (00:00 to 23:00), at which charger (S1, S2, S3), and during which tariff tier (Night Off-Peak, Solar Clean, Evening Peak).',
    },
    {
      id: 'savings',
      num: '07',
      title: 'Financial Arbitrage & ROI Analytics',
      icon: TrendingDown,
      desc: 'Clear comparison cards showing Unmanaged Baseline Cost (₹2,242/day) vs VIREXA Optimized Cost (₹1,020/day) — delivering ₹1,222 daily savings (54.5% cost reduction) and preserving battery lifespan.',
    },
    {
      id: 'explain',
      num: '08',
      title: 'AI Explainability & Audit Provenance',
      icon: Info,
      desc: 'Natural language explainability engine. Select any vehicle to read an audit trail explaining why the AI scheduled it at a specific hour and charger, with complete mathematical trade-off transparency.',
    },
    {
      id: 'disrupt',
      num: '09',
      title: 'What-If & Real-Time Disruption Simulator',
      icon: AlertTriangle,
      desc: 'Simulate live operational emergencies: S2 Charger Failure, Late Vehicle Return, or Sudden Grid Tariff Spike. Triggers immediate autonomous re-optimization to prevent shift disruption.',
    },
    {
      id: 'approval',
      num: '10',
      title: 'Human-in-the-Loop Dispatch Approval',
      icon: FileCheck,
      desc: 'Fleet operator governance terminal. When disruptions trigger a re-plan, the operator inspects the proposed schedule diff and issues cryptographic SHA-256 approval to dispatch.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0408] border border-red-500/40 rounded-3xl shadow-2xl shadow-red-950/60 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-red-500/20 bg-gradient-to-r from-red-950/40 via-slate-950 to-amber-950/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-600/30">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-display text-white">VIREXA System Guide</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                  Commercial EV Optimizer
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Complete guide to features, live calculation engine, and architecture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-[#0a0306]">
          {[
            { id: 'overview', label: '1. What is Virexa?' },
            { id: 'features', label: '2. All 10 Features Explained' },
            { id: 'math', label: '3. How Live Numbers Change' },
            { id: 'faq', label: '4. Quick FAQ' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-mono font-semibold transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-red-500 text-white bg-red-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30">
                <h4 className="text-base font-bold text-white font-display mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  What is VIREXA?
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  <strong className="text-white">VIREXA</strong> is an autonomous, AI-driven commercial electric vehicle (EV) fleet charging optimizer built for commercial fleets in <strong className="text-red-400">Delhi NCR</strong>.
                  It solves the massive economic and operational challenges faced by delivery companies (like Zepto, Blinkit, Zomato, Amazon Logistics) running fleets of 10–500+ commercial EVs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-mono text-red-400 font-bold mb-1">THE PROBLEM</div>
                  <div className="font-bold text-white mb-2">High Peak Tariffs (₹11/kWh)</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Unmanaged drivers plug in as soon as they finish shifts (5 PM - 9 PM) when Delhi NCR grid tariffs are highest, wasting up to ₹58,000+ monthly per depot.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-mono text-amber-400 font-bold mb-1">BATTERY HEALTH</div>
                  <div className="font-bold text-white mb-2">DC Fast Charger Wear</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Overusing 22kW/50kW DC fast chargers causes severe thermal stress and accelerates expensive lithium battery degradation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-mono text-emerald-400 font-bold mb-1">THE SOLUTION</div>
                  <div className="font-bold text-white mb-2">54.5% Daily Savings</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    VIREXA shifts charging to night off-peak hours (₹5/kWh) and solar windows (₹6/kWh) using slow depot charging, guaranteeing 100% shift readiness.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL 10 FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-mono">
                Click any section below to jump directly to it on the page:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={feat.id}
                      onClick={() => {
                        onClose();
                        onNavigateSection(feat.id);
                      }}
                      className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-red-500/40 hover:bg-red-950/20 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-red-400 font-bold px-1.5 py-0.5 rounded bg-red-500/10">
                            {feat.num}
                          </span>
                          <span className="font-bold text-white text-xs sm:text-sm group-hover:text-red-300 transition-colors">
                            {feat.title}
                          </span>
                        </div>
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: HOW LIVE NUMBERS CHANGE */}
          {activeTab === 'math' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-red-500/30">
                <h4 className="text-base font-bold text-white font-display mb-2 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-red-400" />
                  What is the Top Navbar Pill & How Does It Change?
                </h4>
                <div className="p-3 rounded-xl bg-black/60 border border-red-500/20 font-mono text-xs text-red-300 mb-3 flex items-center justify-between">
                  <span>Optimized: ₹1,020</span>
                  <span>Savings: ₹1,222 (54.5%)</span>
                  <span>On-Time: 92%</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  These numbers represent the <strong className="text-white">Full 10-Vehicle Fleet 24-Hour Optimization Total</strong>.
                  <br />
                  - <strong className="text-white">Optimized Cost (₹1,020):</strong> The total electricity cost to charge all 10 vehicles across all 24 hours under the AI schedule.
                  <br />
                  - <strong className="text-red-400">Savings (₹1,222):</strong> The money saved compared to unmanaged charging during evening peak hours (₹2,242).
                  <br />
                  - <strong className="text-amber-300">On-Time Readiness (92%):</strong> Percentage of vehicles guaranteed to have full battery before their shift departure.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                <h5 className="font-bold text-white text-xs mb-2">How do you make these numbers change live?</h5>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed font-mono">
                  <li>Scroll down to <strong className="text-red-400">Chapter 05: Tune the MILP Optimizer & Tariffs</strong>.</li>
                  <li>Drag the <strong className="text-white">Cost Weight ($w_{`cost`}$)</strong> slider up to 3.0x: Cost drops, shifting energy to night tariffs.</li>
                  <li>Drag the <strong className="text-white">Battery Health ($w_{`health`}$)</strong> slider up: Slower depot charging is preferred, eliminating fast charging thermal penalties.</li>
                  <li>Change any <strong className="text-white">Delhi NCR Tariff Rates</strong> (Night, Solar, Peak, Normal): Total cost and savings recalculate immediately with 0ms delay!</li>
                </ol>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('optimizer');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-red-500/30 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span>Jump to Chapter 05: Optimizer Controls</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 4: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h5 className="font-bold text-white text-xs mb-1">What does S1, S2, and S3 mean in the Hero?</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  They are the 3 depot charging stations:
                  <br /><strong>S1 Depot Main:</strong> 7.2 kW AC slow charger, cheapest night off-peak tariff (₹5/kWh), zero battery degradation.
                  <br /><strong>S2 Solar Canopy:</strong> 7.2 kW AC midday clean solar energy (₹6/kWh), zero carbon emissions.
                  <br /><strong>S3 DC Hypercharge:</strong> 22 kW DC rapid fast charger used for emergency top-ups during peak hours (₹11/kWh).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h5 className="font-bold text-white text-xs mb-1">Is this connected to a real mathematical solver?</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Yes! The backend runs a Python FastAPI service with the <strong>PuLP Mixed-Integer Linear Programming (MILP)</strong> solver that calculates the global mathematical optimum for 24 hourly time slots across all 10 vehicles.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#090205] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>VIREXA Commercial Fleet AI · Delhi NCR</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
