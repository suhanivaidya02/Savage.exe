import React, { useState, useEffect, lazy, Suspense, useCallback, useRef, useMemo } from 'react';
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
  TariffRates,
  KPIs,
  Weights,
  ChargingEvent,
  AgentTelemetry,
  VehicleExplanation,
  DisruptionDiff,
} from './types';

// Lazy-load Three.js WebGL Scene
const SceneBackground = lazy(() => import('./components/scene/SceneBackground'));

// Initial default tariff rates in Delhi NCR
const DEFAULT_TARIFF_RATES: TariffRates = {
  night: 5.0,
  solar: 6.0,
  peak: 11.0,
  normal: 8.0,
};

export const App: React.FC = () => {
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDisrupting, setIsDisrupting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Motion & Mock State
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mockMode, setMockMode] = useState(getForceMockMode());
  const [stationTint, setStationTint] = useState('#ff1e42'); // Hot Red

  // Unified Lenis + GSAP ScrollTrigger hook
  const { scrollProgress, activeSection, scrollTo } = useLenisScrollTrigger({
    reduceMotion,
  });

  // Fleet & Optimization State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [tariff, setTariff] = useState<TariffSlot[]>([]);
  const [tariffRates, setTariffRates] = useState<TariffRates>(DEFAULT_TARIFF_RATES);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [weights, setWeights] = useState<Weights>({ w_cost: 1.0, w_health: 1.0, w_avail: 1.0 });
  const [rawSchedules, setRawSchedules] = useState<Record<string, ChargingEvent[]>>({});
  const [schedules, setSchedules] = useState<Record<string, ChargingEvent[]>>({});
  const [telemetry, setTelemetry] = useState<AgentTelemetry[]>([]);
  const [explanations, setExplanations] = useState<Record<string, VehicleExplanation>>({});
  const [pendingDiff, setPendingDiff] = useState<DisruptionDiff | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<string>('APPROVED');

  const optimizeDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // LIVE REAL-TIME CALCULATION ENGINE
  // Calculates live costs, savings, and KPIs immediately on slider / tariff changes
  // ============================================================================
  const recalculateLiveMetrics = useCallback(
    (
      currentSchedules: Record<string, ChargingEvent[]>,
      currentRates: TariffRates,
      currentWeights: Weights,
      baseKpis: KPIs | null
    ) => {
      if (!currentSchedules || Object.keys(currentSchedules).length === 0) return;

      const updatedSchedules: Record<string, ChargingEvent[]> = {};
      let totalCalculatedCost = 0;
      let totalEnergyKwh = 0;

      // Weight adjustment factors
      // Higher w_cost: shifts a percentage of energy to lowest night tariff
      const costShiftFactor = Math.min(0.35, Math.max(-0.25, (currentWeights.w_cost - 1.0) * 0.12));
      // Higher w_health: penalizes high fast charge, shifting to slower depot
      const healthFactor = Math.max(0.7, 1.0 - (currentWeights.w_health - 1.0) * 0.08);
      // Higher w_avail: demands slightly larger SoC buffer before shift
      const availBufferFactor = 1.0 + (currentWeights.w_avail - 1.0) * 0.05;

      for (const [vId, events] of Object.entries(currentSchedules)) {
        updatedSchedules[vId] = events.map((ev) => {
          const hour = ev.hour;
          let rate = currentRates.normal;

          if (hour >= 23 || hour < 6) {
            rate = currentRates.night;
          } else if (hour >= 10 && hour <= 15) {
            rate = currentRates.solar;
          } else if (hour >= 17 && hour <= 21) {
            rate = currentRates.peak;
          }

          // Effective adjusted rate based on cost optimization shift
          const effectiveRate = Math.max(
            currentRates.night,
            rate * (1 - costShiftFactor)
          );

          const adjustedEnergy = ev.energy_kwh * availBufferFactor;
          const cost = Math.round(adjustedEnergy * effectiveRate * 10) / 10;

          totalCalculatedCost += cost;
          totalEnergyKwh += adjustedEnergy;

          return {
            ...ev,
            energy_kwh: Math.round(adjustedEnergy * 10) / 10,
            tariff_rate: rate,
            cost_inr: cost,
          };
        });
      }

      totalCalculatedCost = Math.round(totalCalculatedCost);
      totalEnergyKwh = Math.round(totalEnergyKwh * 10) / 10;

      // Naive baseline cost: unmanaged charging immediately during peak hour (18:00)
      const naiveCost = Math.round(totalEnergyKwh * currentRates.peak);
      const savingsInr = Math.max(0, naiveCost - totalCalculatedCost);
      const savingsPct = naiveCost > 0 ? Math.round((savingsInr / naiveCost) * 1000) / 10 : 0;
      const avgCostPerKwh = totalEnergyKwh > 0 ? Math.round((totalCalculatedCost / totalEnergyKwh) * 100) / 100 : 0;

      // Ready on time percentage (higher w_avail guarantees 100%)
      const readyPct = Math.min(
        100,
        Math.max(88, Math.round(92 + (currentWeights.w_avail - 1.0) * 8 - (currentWeights.w_cost > 2.5 ? (currentWeights.w_cost - 2.5) * 4 : 0)))
      );

      const newKpis: KPIs = {
        total_optimized_cost_inr: totalCalculatedCost,
        naive_cost_inr: naiveCost,
        savings_inr: savingsInr,
        savings_percent: savingsPct,
        total_energy_kwh: totalEnergyKwh,
        avg_cost_per_kwh: avgCostPerKwh,
        ready_on_time_pct: readyPct,
        fast_charge_degradations_prevented: Math.round(8 * currentWeights.w_health),
      };

      setSchedules(updatedSchedules);
      setKpis(newKpis);

      // Update 24-slot tariff array for Gantt chart
      setTariff((prev) =>
        prev.map((slot) => {
          const h = slot.hour;
          let r = currentRates.normal;
          let tier = 'Normal';
          if (h >= 23 || h < 6) {
            r = currentRates.night;
            tier = 'Night Off-Peak';
          } else if (h >= 10 && h <= 15) {
            r = currentRates.solar;
            tier = 'Solar Clean';
          } else if (h >= 17 && h <= 21) {
            r = currentRates.peak;
            tier = 'Evening Peak';
          }
          return { ...slot, rate_inr_per_kwh: r, tier };
        })
      );
    },
    []
  );

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
        setRawSchedules(opt.schedules);
        recalculateLiveMetrics(opt.schedules, DEFAULT_TARIFF_RATES, weights, opt.kpis);
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

  // LIVE OPTIMIZER SLIDER HANDLER (Instant 0ms calculation + debounced backend solver)
  const handleLiveWeightsChange = (newWeights: Weights) => {
    setWeights(newWeights);
    // Instant mathematical recomputation on the client!
    recalculateLiveMetrics(rawSchedules, tariffRates, newWeights, kpis);

    // Debounce backend API call to update PuLP MILP solver
    if (optimizeDebounceRef.current) {
      clearTimeout(optimizeDebounceRef.current);
    }
    optimizeDebounceRef.current = setTimeout(async () => {
      try {
        const res = await runOptimize(newWeights);
        setTelemetry(res.agent_telemetry);
      } catch (e) {
        console.warn('Backend solver sync skipped:', e);
      }
    }, 400);
  };

  // LIVE TARIFF RATE CHANGE HANDLER (Live cost recomputation when user adjusts rates)
  const handleLiveTariffChange = (newRates: TariffRates) => {
    setTariffRates(newRates);
    // Instant mathematical recomputation on the client!
    recalculateLiveMetrics(rawSchedules, newRates, weights, kpis);
  };

  // Disruption Handler
  const handleTriggerDisruption = async (type: string, params: Record<string, any>) => {
    setIsDisrupting(true);
    try {
      const res = await triggerDisruption(type, params);
      setPendingDiff(res.diff);
      setApprovalStatus(res.status);
      setRawSchedules(res.proposed_plan.schedules);
      recalculateLiveMetrics(res.proposed_plan.schedules, tariffRates, weights, res.proposed_plan.kpis);
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
    <div className="relative min-h-screen bg-[#070305] text-slate-100 selection:bg-red-600 selection:text-white">
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

      {/* Kinetic Hot Red Scroll Progress Track & Chapter Capsule */}
      <CinematicCarHero
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        reduceMotion={reduceMotion}
      />

      {/* FIXED FULL-VIEWPORT 3D WEBGL BACKGROUND LAYER (z-0) */}
      <Suspense fallback={<div className="fixed inset-0 bg-[#070305] pointer-events-none z-0" />}>
        <SceneBackground
          scrollProgress={scrollProgress}
          reduceMotion={reduceMotion}
          activeSection={activeSection}
          stationColor={stationTint}
        />
      </Suspense>

      {/* SCROLLABLE FOREGROUND CONTENT LAYER (z-20) - MEMOIZED TO PREVENT SCROLL RE-RENDERING */}
      {useMemo(
        () => (
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

            {/* Chapter 5: Multi-Objective Optimizer & Live Tariff Tweak Sliders */}
            <ScrollReveal reduceMotion={reduceMotion}>
              <OptimizerControlsSection
                weights={weights}
                tariffRates={tariffRates}
                kpis={kpis}
                onLiveWeightsChange={handleLiveWeightsChange}
                onLiveTariffChange={handleLiveTariffChange}
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
        ),
        [
          kpis,
          reduceMotion,
          vehicles,
          shifts,
          telemetry,
          weights,
          tariffRates,
          handleLiveWeightsChange,
          handleLiveTariffChange,
          isOptimizing,
          schedules,
          tariff,
          explanations,
          handleTriggerDisruption,
          pendingDiff,
          isDisrupting,
          approvalStatus,
          handleApprove,
          isApproving,
          scrollTo,
        ]
      )}
    </div>
  );
};

export default App;
