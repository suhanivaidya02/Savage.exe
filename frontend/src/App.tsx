import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import {
  fetchFleetData,
  runOptimize,
  triggerDisruption,
  approveReplan,
  fetchExplanations,
  setForceMockMode,
  getForceMockMode
} from './services/api';
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
  DisruptionDiff
} from './types';

// Components
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
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

export const App: React.FC = () => {
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDisrupting, setIsDisrupting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Scroll & Animation State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mockMode, setMockMode] = useState(getForceMockMode());

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

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize smooth scrolling via Lenis
  useEffect(() => {
    if (reduceMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      setScrollProgress(progress);

      // Determine active section by vertical position
      const sections = [
        'hero',
        'problem',
        'fleet',
        'agents',
        'optimizer',
        'schedule',
        'savings',
        'explain',
        'disrupt',
        'approval',
      ];

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, [reduceMotion]);

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
        console.error("Initialization error, mock fallback active:", err);
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
      console.error("Optimize failed:", err);
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
      console.error("Disrupt failed:", err);
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
      console.error("Approval failed:", err);
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05080f] text-slate-100 bg-cyber-grid selection:bg-cyan-400 selection:text-black">
      {/* Loading Screen */}
      {isLoadingScreen && (
        <LoadingScreen onComplete={() => setIsLoadingScreen(false)} />
      )}

      {/* Top Navigation */}
      <Navbar
        kpis={kpis}
        activeSection={activeSection}
        reduceMotion={reduceMotion}
        onToggleReduceMotion={handleToggleReduceMotion}
        mockMode={mockMode}
        onToggleMockMode={handleToggleMockMode}
        approvalStatus={approvalStatus}
      />

      {/* Pinned Cinematic Electric Sedan & Parallax City Skyline */}
      <CinematicCarHero
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        reduceMotion={reduceMotion}
      />

      {/* Chapter 1: Hero */}
      <HeroSection kpis={kpis} onExploreClick={() => scrollTo('problem')} />

      {/* Chapter 2: The Problem */}
      <ProblemSection />

      {/* Chapter 3: Meet the Fleet */}
      <FleetSection vehicles={vehicles} shifts={shifts} />

      {/* Chapter 4: The 7 AI Agents */}
      <AgentsGateSection telemetry={telemetry} />

      {/* Chapter 5: Multi-Objective Optimizer Sliders */}
      <OptimizerControlsSection
        weights={weights}
        kpis={kpis}
        onOptimize={handleOptimize}
        isLoading={isOptimizing}
      />

      {/* Chapter 6: Charging Schedule (Gantt Matrix) */}
      <GanttScheduleSection
        vehicles={vehicles}
        shifts={shifts}
        schedules={schedules}
        tariff={tariff}
      />

      {/* Chapter 7: Measurable Fleet Savings */}
      <SavingsSection kpis={kpis} />

      {/* Chapter 8: Explain It (Provenance & Natural Language) */}
      <ExplainSection explanations={explanations} />

      {/* Chapter 9: What-If / Disruptions */}
      <DisruptionSection
        onTriggerDisruption={handleTriggerDisruption}
        pendingDiff={pendingDiff}
        isLoading={isDisrupting}
        onNavigateToApproval={() => scrollTo('approval')}
      />

      {/* Chapter 10: Human-in-the-Loop Approval */}
      <ApprovalSection
        hasPendingApproval={approvalStatus === 'PENDING_APPROVAL'}
        pendingDiff={pendingDiff}
        onApprove={handleApprove}
        isLoading={isApproving}
      />

      {/* Chapter 11: Footer */}
      <FooterSection />
    </div>
  );
};

export default App;
