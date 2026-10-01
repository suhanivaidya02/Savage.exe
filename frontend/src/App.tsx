import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useLenisScrollTrigger } from './hooks/useLenisScrollTrigger';
import { ScrollReveal } from './components/motion/ScrollReveal';

// Layout & Core UI Components
import { Navbar } from './components/Navbar';
import { LoadingScreen } from './components/LoadingScreen';
import { CinematicCarHero } from './components/CinematicCarHero';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { FleetSection } from './components/FleetSection';
import { AgentsGateSection } from './components/AgentsGateSection';
import { OptimizerControlsSection } from './components/OptimizerControlsSection';
import { GanttScheduleSection } from './components/GanttScheduleSection';
import { SavingsSection } from './components/SavingsSection';
import { ExplainSection } from './components/ExplainSection';
import { DisruptionSection } from './components/DisruptionSection';
import { ApprovalSection } from './components/ApprovalSection';
import { FooterSection } from './components/FooterSection';

// API Services
import {
  fetchFleetData,
  runOptimize,
  triggerDisruption,
  approveReplan,
  fetchExplanations,
  getForceMockMode,
  setForceMockMode,
} from './services/api';

// Domain Types
import {
  Vehicle,
  Station,
  Shift,
  TariffSlot,
  KPIs,
  Weights,
  ChargingEvent,
  AgentTelemetry,
  VehicleExplanation,
  DisruptionDiff,
} from './types';

// Lazy-load Three.js WebGL Scene so core fleet JS bundles smoothly
const SceneBackground = lazy(() => import('./components/scene/SceneBackground'));

export const App: React.FC = () => {
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDisrupting, setIsDisrupting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Motion & Mock State
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mockMode, setMockMode] = useState(getForceMockMode());
  const [stationTint, setStationTint] = useState('#39ff88');

  // Unified Lenis + GSAP ScrollTrigger hook
  const { scrollProgress, activeSection, scrollTo } = useLenisScrollTrigger({
    reduceMotion,
  });

  // Fleet & Optimization State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [tariff, setTariff] = useState<TariffSlot[]>([]);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [weights, setWeights] = useState<Weights>({ w_cost: 1.0, w_health: 1.0, w_avail: 1.0 });
  const [schedules, setSchedules] = useState<Record<string, ChargingEvent[]>>({});
  const [telemetry, setTelemetry] = useState<AgentTelemetry[]>([]);
  const [explanations, setExplanations] = useState<Record<string, VehicleExplanation>>({});
  const [pendingDiff, setPendingDiff] = useState<DisruptionDiff | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<string>('APPROVED');

  // Initial Data Ingestion
  useEffect(() => {
    const initData = async () => {
      try {
        const fleetData = await fetchFleetData();
        setVehicles(fleetData.vehicles);
        setStations(fleetData.stations);
        setShifts(fleetData.shifts);
        setTariff(fleetData.tariff);
        setApprovalStatus(fleetData.approval_status);

        // Run baseline optimization
        const opt = await runOptimize(weights);
        setKpis(opt.kpis);
        setSchedules(opt.schedules);
        setTelemetry(opt.agent_telemetry);

        // Fetch explanations
        const expData = await fetchExplanations();
        setExplanations(expData.explanations);
      } catch (err) {
        console.error('Initialization error, mock fallback active:', err);
      }
    };

    initData();
  }, [mockMode]);

  // Optimization Handler
  const handleOptimize = async (newWeights: Weights) => {
    setIsOptimizing(true);
    try {
      const res = await runOptimize(newWeights);
      setWeights(newWeights);
      setKpis(res.kpis);
      setSchedules(res.schedules);
      setTelemetry(res.agent_telemetry);
      setApprovalStatus('APPROVED');
      setPendingDiff(null);

      const expData = await fetchExplanations();
      setExplanations(expData.explanations);
    } catch (err) {
      console.error('Optimize failed:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Disruption Handler
  const handleTriggerDisruption = async (type: string, params: Record<string, any>) => {
    setIsDisrupting(true);
    try {
      const res = await triggerDisruption(type, params);
      setPendingDiff(res.diff);
      setApprovalStatus(res.status);
      setKpis(res.proposed_plan.kpis);
      setSchedules(res.proposed_plan.schedules);
      setTelemetry(res.proposed_plan.agent_telemetry);
      setExplanations(res.proposed_plan.explanations);
    } catch (err) {
      console.error('Disrupt failed:', err);
    } finally {
      setIsDisrupting(false);
    }
  };

  // Approval Handler
  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const res = await approveReplan();
      setApprovalStatus('APPROVED');
      setPendingDiff(null);
      if (res.kpis) {
        setKpis(res.kpis);
      }
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleToggleMockMode = () => {
    const next = !mockMode;
    setForceMockMode(next);
    setMockMode(next);
  };

  const handleToggleReduceMotion = () => {
    setReduceMotion((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen bg-[#05080f] text-slate-100 selection:bg-cyan-400 selection:text-black">
      {/* Loading Screen */}
      {isLoadingScreen && (
        <LoadingScreen onComplete={() => setIsLoadingScreen(false)} />
      )}

      {/* Top Floating Glass Navigation */}
      <Navbar
        kpis={kpis}
        activeSection={activeSection}
        reduceMotion={reduceMotion}
        onToggleReduceMotion={handleToggleReduceMotion}
        mockMode={mockMode}
        onToggleMockMode={handleToggleMockMode}
        approvalStatus={approvalStatus}
      />

      {/* Kinetic Neon Scroll Progress Track & Chapter Capsule */}
      <CinematicCarHero
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        reduceMotion={reduceMotion}
      />

      {/* FIXED FULL-VIEWPORT 3D WEBGL BACKGROUND LAYER (z-0) */}
      <Suspense fallback={<div className="fixed inset-0 bg-[#05080f] pointer-events-none z-0" />}>
        <SceneBackground
          scrollProgress={scrollProgress}
          reduceMotion={reduceMotion}
          activeSection={activeSection}
          stationColor={stationTint}
        />
      </Suspense>

      {/* SCROLLABLE FOREGROUND CONTENT LAYER (z-20) */}
      <div className="relative z-20">
        {/* Chapter 1: Hero */}
        <HeroSection
          kpis={kpis}
          onExploreClick={() => scrollTo('problem')}
          onStationSelect={(color) => setStationTint(color)}
        />

        {/* Chapter 2: The Problem */}
        <ScrollReveal reduceMotion={reduceMotion}>
          <ProblemSection />
        </ScrollReveal>

        {/* Chapter 3: Meet the Fleet */}
        <ScrollReveal reduceMotion={reduceMotion}>
          <FleetSection vehicles={vehicles} shifts={shifts} />
        </ScrollReveal>

        {/* Chapter 4: The 7 AI Agents */}
        <ScrollReveal reduceMotion={reduceMotion}>
          <AgentsGateSection telemetry={telemetry} />
        </ScrollReveal>

        {/* Chapter 5: Multi-Objective Optimizer Sliders */}
        <ScrollReveal reduceMotion={reduceMotion}>
          <OptimizerControlsSection
            weights={weights}
            kpis={kpis}
            onOptimize={handleOptimize}
            isLoading={isOptimizing}
          />
        </ScrollReveal>

        {/* Chapter 6: Charging Schedule (Gantt Matrix) */}
        <ScrollReveal reduceMotion={reduceMotion}>
          <GanttScheduleSection
            vehicles={vehicles}
            shifts={shifts}
            schedules={schedules}
            tariff={tariff}
          />
        </ScrollReveal>

        {/* Chapter 7: Measurable Fleet Savings */}
        <ScrollReveal reduceMotion={reduceMotion}>
          <SavingsSection kpis={kpis} />
        </ScrollReveal>

        {/* Chapter 8: Explain It (Provenance & Natural Language) */}
        <ScrollReveal reduceMotion={reduceMotion}>
          <ExplainSection explanations={explanations} />
        </ScrollReveal>

        {/* Chapter 9: What-If / Disruptions */}
        <ScrollReveal reduceMotion={reduceMotion}>
          <DisruptionSection
            onTriggerDisruption={handleTriggerDisruption}
            pendingDiff={pendingDiff}
            isLoading={isDisrupting}
            onNavigateToApproval={() => scrollTo('approval')}
          />
        </ScrollReveal>

        {/* Chapter 10: Human-in-the-Loop Approval */}
        <ScrollReveal reduceMotion={reduceMotion}>
          <ApprovalSection
            hasPendingApproval={approvalStatus === 'PENDING_APPROVAL'}
            pendingDiff={pendingDiff}
            onApprove={handleApprove}
            isLoading={isApproving}
          />
        </ScrollReveal>

        {/* Chapter 11: Footer */}
        <FooterSection />
      </div>
    </div>
  );
};

export default App;
