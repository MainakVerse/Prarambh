"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  allStages,
  phases,
  statusMeta,
  statusRibbon,
  type Stage,
  type StageStatus,
} from "@/lib/stages";
import { cn } from "@/lib/cn";

const ROTATE_MS = 4000;

const legendOrder: StageStatus[] = ["signed-off", "done", "active", "blocked"];

/** One-line gate summary per phase, shown under the stage list. */
function phaseSummary(index: number): string {
  const stages = phases[index].stages;
  const closed = stages.filter(
    (s) => s.status === "done" || s.status === "signed-off"
  ).length;
  const blocked = stages.filter((s) => s.status === "blocked").length;
  if (blocked > 0) return `${blocked} gate blocked — approver notified`;
  if (closed === stages.length) return "All gates closed for this phase";
  return `${closed} of ${stages.length} gates closed`;
}

function phaseIndexOf(stage: Stage): number {
  return phases.findIndex((p) => p.stages.some((s) => s.id === stage.id));
}

/**
 * Anchored info bubble. Rendered inside a `relative` trigger wrapper;
 * pops with a spring, closes via the shared outside-click/Escape handler.
 */
function Bubble({
  open,
  className,
  arrowClassName,
  style,
  children,
}: {
  open: boolean;
  className?: string;
  arrowClassName?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          initial={
            reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 6 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 4 }}
          transition={{ type: "spring", duration: 0.3, bounce: 0.35 }}
          style={style}
          className={cn(
            "absolute z-30 w-64 max-w-full cursor-default rounded-2xl bg-white/95 p-3.5 text-left shadow-xl ring-1 ring-primary-200/70 backdrop-blur",
            className
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute h-2.5 w-2.5 rotate-45 bg-white/95 ring-1 ring-primary-200/70",
              arrowClassName
            )}
          />
          <div className="relative">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Shared bubble body for a stage: deliverable, owner, and gate criteria. */
function StageBubbleBody({ stage }: { stage: Stage }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-ink">
          <span className="tnum mr-1.5 text-ink-muted">{stage.id}.</span>
          {stage.name}
        </p>
        <StatusPill status={stage.status} />
      </div>
      <dl className="mt-2.5 space-y-1.5 text-xs">
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 font-semibold text-ink-muted">
            Deliverable
          </dt>
          <dd className="text-ink-body">{stage.deliverable}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 font-semibold text-ink-muted">Owner</dt>
          <dd className="text-ink-body">{stage.owner}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 font-semibold text-ink-muted">Gate</dt>
          <dd className="text-ink-body">{stage.gate}</dd>
        </div>
      </dl>
    </>
  );
}

/**
 * Animated product mockup: gate-health ribbon on top, then a rotating
 * panel that cycles through the 5 phases (one screen per phase).
 * Auto-advances; pauses on hover/focus or while an info bubble is open.
 * Every element — ribbon segments, legend chips, stage rows — is clickable
 * and pops an info bubble; tabs allow manual phase selection.
 */
export function HeroMockup() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || bubble !== null) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % phases.length),
      ROTATE_MS
    );
    return () => clearInterval(timer);
  }, [paused, bubble]);

  // Close the open bubble on outside click or Escape.
  useEffect(() => {
    if (bubble === null) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-bubble-anchor]")) setBubble(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBubble(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [bubble]);

  const toggleBubble = (key: string) =>
    setBubble((b) => (b === key ? null : key));

  const goToPhase = (i: number) => {
    setIndex(i);
    setBubble(null);
  };

  const phase = phases[index];

  return (
    <GlassCard
      variant="strong"
      className="p-4 sm:p-6"
      role="group"
      aria-roledescription="carousel"
      aria-label="Prarambh phase navigator — 13 project stages across 5 phases"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div>
        {/* Window chrome */}
        <div aria-hidden className="mb-4 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
          <span className="ml-3 text-xs font-medium text-ink-muted">
            Aurora CRM Rollout · Stage gates
          </span>
        </div>

        {/* Stage-gate health ribbon: 13 clickable segments, 2px gaps */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-ink-soft">
              Gate health
            </span>
            <span className="tnum text-xs font-medium text-ink-muted">
              7 of 13 gates in motion
            </span>
          </div>
          <div className="relative">
            <div className="flex gap-0.5 overflow-hidden rounded-full">
              {allStages.map((stage) => {
                const phaseIdx = phaseIndexOf(stage);
                const key = `ribbon-${stage.id}`;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    data-bubble-anchor
                    aria-expanded={bubble === key}
                    aria-label={`Stage ${stage.id} — ${stage.name}: ${statusMeta[stage.status].label}. Click for details.`}
                    onClick={() => toggleBubble(key)}
                    className={cn(
                      "h-2.5 flex-1 cursor-pointer transition-all duration-300",
                      "hover:scale-y-150 focus-visible:scale-y-150 focus-visible:outline-none",
                      statusRibbon[stage.status],
                      phaseIdx === index || bubble === key
                        ? "opacity-100"
                        : "opacity-35 hover:opacity-70"
                    )}
                  />
                );
              })}
            </div>
            {/* Ribbon bubbles: anchored under the strip, clamped to card edges */}
            {allStages.map((stage, i) => {
              const key = `ribbon-${stage.id}`;
              if (bubble !== key) return null;
              // Segment center as % of ribbon width; bubble (w-64 = 16rem)
              // stays clamped inside the card, arrow tracks the segment.
              const pct = ((i + 0.5) / allStages.length) * 100;
              const targetPhase = phaseIndexOf(stage);
              return (
                <div key={key} data-bubble-anchor>
                  <Bubble
                    open
                    className="top-full mt-2.5"
                    style={{
                      left: `clamp(0px, calc(${pct}% - 8rem), calc(100% - 16rem))`,
                    }}
                    arrowClassName={cn(
                      "-top-[5px]",
                      i < 3 ? "left-4" : i > allStages.length - 4 ? "right-4" : "left-[calc(50%-5px)]"
                    )}
                  >
                    <StageBubbleBody stage={stage} />
                    {targetPhase !== index && (
                      <button
                        type="button"
                        onClick={() => goToPhase(targetPhase)}
                        className="mt-2.5 text-xs font-semibold text-primary-700 underline-offset-2 hover:underline"
                      >
                        View {phases[targetPhase].name} phase →
                      </button>
                    )}
                  </Bubble>
                </div>
              );
            })}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
            {legendOrder.map((status) => {
              const key = `legend-${status}`;
              const count = allStages.filter((s) => s.status === status).length;
              return (
                <li key={status} className="relative" data-bubble-anchor>
                  <button
                    type="button"
                    aria-expanded={bubble === key}
                    onClick={() => toggleBubble(key)}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium text-ink-muted transition-colors",
                      bubble === key
                        ? "bg-white/80 text-ink-soft shadow-neo-xs"
                        : "hover:bg-white/60 hover:text-ink-soft"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        statusMeta[status].dot
                      )}
                    />
                    {statusMeta[status].label}
                  </button>
                  <Bubble
                    open={bubble === key}
                    className="left-0 top-full mt-2"
                    arrowClassName="-top-[5px] left-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <StatusPill status={status} />
                      <span className="tnum text-xs font-semibold text-ink-muted">
                        {count} of {allStages.length} stages
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-ink-body">
                      {statusMeta[status].description}
                    </p>
                  </Bubble>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Rotating phase panel — fixed height so the card never jumps */}
        <div className="relative mt-4 h-64 sm:h-60" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -24 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-bold uppercase tracking-wider text-primary-700">
                  {phase.name}
                </p>
                <p className="tnum text-xs font-medium text-ink-muted">
                  Phase {index + 1} of {phases.length}
                </p>
              </div>

              <ul className="mt-3 space-y-2">
                {phase.stages.map((stage) => {
                  const key = `stage-${stage.id}`;
                  return (
                    <li key={stage.id} className="relative" data-bubble-anchor>
                      <button
                        type="button"
                        aria-expanded={bubble === key}
                        aria-label={`${stage.name} — ${statusMeta[stage.status].label}. Click for gate details.`}
                        onClick={() => toggleBubble(key)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-all",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                          stage.status === "active"
                            ? "bg-white/85 shadow-neo-xs ring-1 ring-primary-200"
                            : "bg-white/50",
                          bubble === key
                            ? "bg-white/95 shadow-neo-xs ring-1 ring-primary-300"
                            : "hover:bg-white/80 hover:shadow-neo-xs"
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="tnum grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cream-100 text-xs font-bold text-ink-soft shadow-neo-inset-sm">
                            {stage.id}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">
                              {stage.name}
                            </p>
                            <p className="truncate text-xs text-ink-muted">
                              {stage.deliverable}
                            </p>
                          </div>
                        </div>
                        <span className="flex shrink-0 items-center gap-1.5">
                          <StatusPill status={stage.status} />
                          <svg
                            aria-hidden
                            viewBox="0 0 12 12"
                            className={cn(
                              "h-3 w-3 text-ink-faint transition-transform",
                              bubble === key && "rotate-180 text-primary-600"
                            )}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2.5 4.5 6 8l3.5-3.5" />
                          </svg>
                        </span>
                      </button>
                      <Bubble
                        open={bubble === key}
                        className="left-0 right-0 top-full mt-1.5 w-auto"
                        arrowClassName="-top-[5px] left-6"
                      >
                        <StageBubbleBody stage={stage} />
                      </Bubble>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-3 text-xs font-medium text-ink-muted">
                {phaseSummary(index)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Phase tabs — manual control + progress indicator */}
        <div
          role="tablist"
          aria-label="Select phase"
          className="mt-4 flex gap-1.5 border-t border-white/70 pt-4"
        >
          {phases.map((p, i) => (
            <button
              key={p.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${p.name} (phase ${i + 1} of ${phases.length})`}
              onClick={() => goToPhase(i)}
              className={cn(
                "group flex-1 rounded-lg px-1 py-1.5 transition-colors",
                i === index ? "bg-white/70" : "hover:bg-white/40"
              )}
            >
              <span
                className={cn(
                  "mx-auto block h-1 w-full max-w-10 rounded-full transition-colors",
                  i === index
                    ? "bg-primary-500"
                    : "bg-ink-faint/40 group-hover:bg-ink-faint"
                )}
              />
              <span
                className={cn(
                  "mt-1.5 hidden truncate text-[10px] font-semibold sm:block",
                  i === index ? "text-primary-700" : "text-ink-muted"
                )}
              >
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
