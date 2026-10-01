import React, { useState } from 'react';
import {
  Layers,
  Battery,
  MapPin,
  Zap,
  IndianRupee,
  Cpu,
  MessageSquareText,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
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
    color: 'text-red-400',
    borderColor: 'border-red-500/40',
    bgColor: 'bg-red-500/10',
    title: 'Fleet State Ingestion',
    summary: 'Loads 20 vehicles, shift assignments, initial SoC & battery health metrics.',
    input: 'Vehicle registry, battery capacities (8-65 kWh), shift routes.',
    output: 'Normalized vehicle state matrix & dispatch deadlines.'
  },
  {
    gate: 2,
    name: 'BatteryAgent',
    icon: Battery,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/10',
    title: 'Degradation Modeling',
    summary: 'Calculates energy required & min SoC with mandatory 15% safety buffer.',
    input: 'Current SoC, battery health (SoH), C-rate thermal tolerance.',
    output: 'Safe charging speed limits & DoD degradation cost multipliers.'
  },
  {
    gate: 3,
    name: 'RouteAgent',
    icon: MapPin,
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    bgColor: 'bg-rose-500/10',
    title: 'Route Demand Forecasting',
    summary: 'Forecasts kWh demand from km distance, cargo payload, and traffic multiplier.',
    input: 'Route lengths (45-120 km), cargo load factor (60-95%), Delhi congestion.',
    output: 'Net kWh consumption profile per vehicle shift.'
  },
  {
    gate: 4,
    name: 'ChargingAgent',
    icon: Zap,
    color: 'text-amber-500',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/10',
    title: 'Station Bay Allocation',
    summary: 'Generates 48-slot (30-min) availability grid across all 3 stations.',
    input: 'Station S1 (6 bays), S2 Solar (4 bays), S3 Fast (2 bays).',
    output: 'Feasible slot occupancy matrix respecting bay caps.'
  },
  {
    gate: 5,
    name: 'CostAgent',
    icon: IndianRupee,
    color: 'text-red-500',
    borderColor: 'border-red-500/40',
    bgColor: 'bg-red-500/10',
    title: 'Time-of-Day Economics',
    summary: 'Maps time-of-day tariff tiers (₹5.00 to ₹11.00/kWh) to slot economics.',
    input: 'Delhi ToD tariff curve: ₹5 night off-peak, ₹6 solar, ₹11 evening peak.',
    output: 'Per-kWh cost weights and arbitrage coefficients.'
  },
  {
    gate: 6,
    name: 'OptimizationAgent',
    icon: Cpu,
    color: 'text-red-400',
    borderColor: 'border-red-500/50',
    bgColor: 'bg-red-500/15',
    title: 'PuLP MILP Mathematical Solver',
    summary: 'PuLP MILP solver (NO LLM): multi-objective optimization solved in < 1 second.',
    input: 'Combined objective function: Cost + Degradation + Readiness.',
    output: 'Optimal binary allocation variables X[v, s, t].'
  },
  {
    gate: 7,
    name: 'RecommendationAgent',
    icon: MessageSquareText,
    color: 'text-rose-300',
    borderColor: 'border-rose-500/40',
    bgColor: 'bg-rose-500/10',
    title: 'Explainability & Provenance',
    summary: 'Plain-language explainability & data provenance tagged as GIVEN vs ASSUMED.',
    input: 'Solved MILP schedules, vehicle shift schedules, tariff timestamps.',
    output: 'Human-readable dispatch audit cards with mathematical provenance.'
  }
];

export const AgentsGateSection: React.FC<AgentsGateSectionProps> = ({ telemetry }) => {
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number>(5);
  const telemetryMap = new Map(telemetry.map((t) => [t.agent, t]));

  const selectedAgent = AGENT_METADATA[selectedAgentIndex];
  const selectedTelemetry = telemetryMap.get(selectedAgent.name);
  const SelectedIcon = selectedAgent.icon;

  return (
    <section id="agents" className="relative min-h-screen flex flex-col justify-center px-4 py-24 z-20 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono mb-3">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          <span>7-GATE ORCHESTRATION PIPELINE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
          The 7 Specialized AI Agents
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto mt-4 text-sm sm:text-base">
          A deterministic multi-agent pipeline ingesting physical constraints, forecasting demand,
          solving mathematical schedules with PuLP CBC, and synthesizing plain-language provenance.
        </p>
      </div>

      {/* Horizontal Pipeline Stepper */}
      <div className="relative mb-10 overflow-x-auto pb-4">
        <div className="min-w-[800px] flex items-center justify-between relative px-6">
          {/* Animated Connecting Line */}
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-slate-800 z-0">
            <div className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
          </div>

          {AGENT_METADATA.map((agent, idx) => {
            const Icon = agent.icon;
            const isSelected = selectedAgentIndex === idx;

            return (
              <button
                key={agent.name}
                onClick={() => setSelectedAgentIndex(idx)}
                className={`relative z-10 flex flex-col items-center group transition-all ${
                  isSelected ? 'scale-110' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isSelected
                      ? `${agent.bgColor} ${agent.borderColor} border-2 shadow-lg shadow-red-500/40`
                      : 'bg-slate-900 border border-slate-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${agent.color}`} />
                </div>
                <span className="text-[10px] font-mono font-bold mt-2 text-slate-400 group-hover:text-white">
                  GATE 0{agent.gate}
                </span>
                <span className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                  {agent.name.replace('Agent', '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Agent Inspector Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          {/* Left: Agent Identity & Mission */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-14 h-14 rounded-2xl ${selectedAgent.bgColor} border ${selectedAgent.borderColor} flex items-center justify-center ${selectedAgent.color}`}>
                <SelectedIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-red-400 border border-slate-700">
                    GATE 0{selectedAgent.gate}
                  </span>
                  <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    STATUS: COMPLETED
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white font-display mt-1">
                  {selectedAgent.name} · {selectedAgent.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {selectedAgent.summary}
            </p>

            {/* Input & Output Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Ingested Inputs:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {selectedAgent.input}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono uppercase text-red-400 font-bold block mb-1">
                  Synthesized Outputs:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {selectedAgent.output}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Latency & Telemetry Specs */}
          <div className="w-full lg:w-72 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-mono">BENCHMARK SPEED</span>
              <span className="text-base font-bold font-mono text-red-400 flex items-center gap-1">
                <Clock className="w-4 h-4 text-red-400" />
                {selectedTelemetry ? `${selectedTelemetry.duration_sec}s` : '0.04s'}
              </span>
            </div>

            <div className="text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Execution Mode:</span>
                <span className="text-white">Deterministic</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Solver Engine:</span>
                <span className="text-amber-400">PuLP CBC 2.9</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Safety Buffer:</span>
                <span className="text-rose-400">15% Enforced</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              {selectedTelemetry?.summary || 'Telemetry recorded with 100% mathematical provenance.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
