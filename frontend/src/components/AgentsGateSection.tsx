import React from 'react';
import {
  Layers,
  Battery,
  MapPin,
  Zap,
  IndianRupee,
  Cpu,
  MessageSquareText,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { AgentTelemetry } from '../types';

interface AgentsGateSectionProps {
  telemetry: AgentTelemetry[];
}

const AGENT_METADATA = [
  {
    gate: 1,
    name: 'FleetAgent',
    icon: Layers,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    summary: 'Loads 20 vehicles, shift assignments, and current SoC.'
  },
  {
    gate: 2,
    name: 'BatteryAgent',
    icon: Battery,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    summary: 'Calculates energy required & min SoC with mandatory 15% safety buffer.'
  },
  {
    gate: 3,
    name: 'RouteAgent',
    icon: MapPin,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    summary: 'Forecasts kWh demand from km, cargo load, and traffic multiplier.'
  },
  {
    gate: 4,
    name: 'ChargingAgent',
    icon: Zap,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    summary: 'Generates 48-slot (30-min) availability grid across all 3 stations.'
  },
  {
    gate: 5,
    name: 'CostAgent',
    icon: IndianRupee,
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    bgColor: 'bg-indigo-500/10',
    summary: 'Maps time-of-day tariff tiers (₹5 to ₹11/kWh) to slot economics.'
  },
  {
    gate: 6,
    name: 'OptimizationAgent',
    icon: Cpu,
    color: 'text-neon-green',
    borderColor: 'border-neon-green/40',
    bgColor: 'bg-neon-green/10',
    summary: 'PuLP MILP solver (NO LLM): multi-objective optimization in < 1 second.'
  },
  {
    gate: 7,
    name: 'RecommendationAgent',
    icon: MessageSquareText,
    color: 'text-teal-300',
    borderColor: 'border-teal-500/30',
    bgColor: 'bg-teal-500/10',
    summary: 'Plain-language explainability & data provenance (LLM / verified template).'
  }
];

export const AgentsGateSection: React.FC<AgentsGateSectionProps> = ({ telemetry }) => {
  const telemetryMap = new Map(telemetry.map((t) => [t.agent, t]));

  return (
    <section id="agents" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          <span>7-GATE ORCHESTRATION PIPELINE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          The 7 Specialized AI Agents
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mt-4 text-sm sm:text-base">
          As the car drives through each checkpoint, specialized agents ingest physical constraints,
          model degradation, solve mathematical schedules, and synthesize explainable insights.
        </p>
      </div>

      {/* 7 Agent Gate Interactive Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 relative">
        {AGENT_METADATA.map((agent, idx) => {
          const Icon = agent.icon;
          const liveData = telemetryMap.get(agent.name);
          const isDone = liveData?.status === 'COMPLETED';

          return (
            <div
              key={agent.name}
              className={`glass-panel p-4 rounded-xl border ${agent.borderColor} flex flex-col justify-between relative group hover:scale-[1.02] transition-all`}
            >
              {/* Gate Number Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  GATE 0{agent.gate}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-neon-green" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>

              {/* Icon & Title */}
              <div className="mb-4">
                <div
                  className={`w-10 h-10 rounded-lg ${agent.bgColor} flex items-center justify-center ${agent.color} mb-3 shadow-inner`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white font-display mb-1">
                  {agent.name}
                </h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {liveData?.summary || agent.summary}
                </p>
              </div>

              {/* Live Execution Duration Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {liveData ? `${liveData.duration_sec}s` : '0.04s'}
                </span>
                <span className="text-neon-green">ACTIVE</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
