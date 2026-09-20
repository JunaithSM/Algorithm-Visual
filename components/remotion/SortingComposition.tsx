"use client";

import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Step } from "@/lib/visualizer/simulator";
import { CheckCircle, ArrowUpDown } from "lucide-react";

export interface SortingCompositionProps {
  steps: Step[];
  isDarkMode: boolean;
  algorithmId: string;
  category: string;
  stepDurationFrames?: number;
}

const POINTER_COLOR_MAP: Record<
  string,
  {
    badge: string;
    cardBg: string;
    cardBorder: string;
    cardText: string;
  }
> = {
  i: {
    badge: "bg-sky-500/25 border-sky-400 text-sky-300 font-bold",
    cardBg: "bg-sky-500/30",
    cardBorder: "border-sky-400 shadow-[0_0_24px_rgba(56,189,248,0.7)]",
    cardText: "text-sky-200",
  },
  j: {
    badge: "bg-amber-500/25 border-amber-400 text-amber-300 font-bold",
    cardBg: "bg-amber-500/30",
    cardBorder: "border-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.7)]",
    cardText: "text-amber-200",
  },
  k: {
    badge: "bg-purple-500/25 border-purple-400 text-purple-300 font-bold",
    cardBg: "bg-purple-500/30",
    cardBorder: "border-purple-400 shadow-[0_0_24px_rgba(192,132,252,0.7)]",
    cardText: "text-purple-200",
  },
  pivot: {
    badge: "bg-rose-500/25 border-rose-400 text-rose-300 font-bold",
    cardBg: "bg-rose-500/30",
    cardBorder: "border-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.7)]",
    cardText: "text-rose-200",
  },
  minidx: {
    badge: "bg-indigo-500/25 border-indigo-400 text-indigo-300 font-bold",
    cardBg: "bg-indigo-500/30",
    cardBorder: "border-indigo-400 shadow-[0_0_24px_rgba(129,140,248,0.7)]",
    cardText: "text-indigo-200",
  },
};

function getPointerStyles(varName: string) {
  const key = varName.toLowerCase().trim();
  return (
    POINTER_COLOR_MAP[key] || {
      badge: "bg-pink-500/25 border-pink-400 text-pink-300 font-bold",
      cardBg: "bg-pink-500/30",
      cardBorder: "border-pink-400 shadow-[0_0_24px_rgba(244,114,182,0.7)]",
      cardText: "text-pink-200",
    }
  );
}

export const SortingComposition: React.FC<SortingCompositionProps> = ({
  steps = [],
  isDarkMode = true,
  algorithmId = "SortAlgorithm",
  stepDurationFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!steps || steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400 font-mono text-xs">
        No execution steps generated for sorting.
      </div>
    );
  }

  const rawStepIndex = Math.floor(frame / stepDurationFrames);
  const stepIndex = Math.min(rawStepIndex, steps.length - 1);
  const currentStep = steps[stepIndex];

  const stepFrame = frame % stepDurationFrames;
  const springProgress = spring({
    frame: stepFrame,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 120 },
  });

  const maxVal = Math.max(...(currentStep?.array || [10]), 1);
  const isComparing = currentStep.status === "comparing";

  // HTML5 Canvas Overlay Drawing for Pixel-Accurate Dynamic Comparison Lines
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isComparing && currentStep.activeIndices.length >= 2) {
      const el1 = cardRefs.current[currentStep.activeIndices[0]];
      const el2 = cardRefs.current[currentStep.activeIndices[1]];

      if (el1 && el2) {
        const r1 = el1.getBoundingClientRect();
        const r2 = el2.getBoundingClientRect();

        const p1 = {
          x: r1.left + r1.width / 2 - rect.left,
          y: r1.top + r1.height / 2 - rect.top,
        };
        const p2 = {
          x: r2.left + r2.width / 2 - rect.left,
          y: r2.top + r2.height / 2 - rect.top,
        };

        const midX = (p1.x + p2.x) / 2;
        const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const arcHeight = Math.min(65, distance * 0.4 + 20);
        const midY = Math.min(p1.y, p2.y) - arcHeight;

        // Glowing gradient stroke
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, "#38bdf8"); // Sky Blue
        grad.addColorStop(0.5, "#c084fc"); // Purple
        grad.addColorStop(1, "#fbbf24"); // Amber

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -frame * 2.5; // Electric flowing dashes!
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Pulsing Endpoint Circles
        [p1, p2].forEach((pt, idx) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 6 + Math.sin(frame * 0.25) * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = idx === 0 ? "#38bdf8" : "#fbbf24";
          ctx.shadowColor = idx === 0 ? "#38bdf8" : "#fbbf24";
          ctx.shadowBlur = 14;
          ctx.fill();
        });
      }
    }
  }, [frame, isComparing, currentStep]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full p-6 flex flex-col justify-between font-sans overflow-y-auto select-none transition-colors duration-500 relative ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* HTML5 Canvas Overlay for Pixel-Accurate Dynamic Comparison Arc */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-30"
      />

      {/* Top Header: Algorithm Name & Pointer Legend */}
      <div className="flex items-center justify-between border-b pb-3 border-neutral-800/60 flex-wrap gap-2 transition-all duration-300 z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold transition-all duration-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
          <span>Sorting Mode: {algorithmId}</span>
        </div>

        {/* Pointer Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono opacity-90">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span className="text-sky-300 font-bold">i</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="text-amber-300 font-bold">j</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
            <span className="text-purple-300 font-bold">k / pivot</span>
          </div>
        </div>
      </div>

      {/* Sorting Height Bars & 3D Physical Swap Visualizer */}
      <div className="flex flex-col items-center justify-center my-auto py-2 z-10">
        <div className="flex items-end justify-center gap-4 flex-wrap min-h-35">
          {currentStep?.array.map((val, idx) => {
            const isSorted = currentStep.status === "sorted";

            const activePointers = currentStep
              ? Object.entries(currentStep.vars).filter(
                  ([key, v]) => typeof v === "number" && v === idx
                )
              : [];

            const isSwapping = currentStep.status === "swapping" && activePointers.length > 0;

            let cardBg = isDarkMode ? "bg-neutral-900" : "bg-neutral-100";
            let cardBorder = isDarkMode ? "border-neutral-800" : "border-neutral-300";
            let cardText = isDarkMode ? "text-neutral-200" : "text-neutral-800";

            if (isSorted) {
              cardBg = "bg-emerald-500/25";
              cardBorder = "border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.7)]";
              cardText = "text-emerald-300 font-bold";
            } else if (isSwapping) {
              cardBg = "bg-rose-500/25";
              cardBorder = "border-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.7)]";
              cardText = "text-rose-300 font-bold";
            } else if (activePointers.length > 0) {
              const primaryPtr = activePointers[0][0];
              const style = getPointerStyles(primaryPtr);
              cardBg = style.cardBg;
              cardBorder = style.cardBorder;
              cardText = `${style.cardText} font-bold`;
            }

            // Physical 3D X/Y Translation during swap
            let translateX = 0;
            let translateY = 0;

            if (currentStep.status === "swapping" && currentStep.activeIndices.length >= 2) {
              const i1 = currentStep.activeIndices[0];
              const i2 = currentStep.activeIndices[1];
              const cardDistance = 72; // width + gap offset

              if (idx === i1) {
                translateX = (i2 - i1) * cardDistance * springProgress;
                translateY = -32 * Math.sin(springProgress * Math.PI);
              } else if (idx === i2) {
                translateX = (i1 - i2) * cardDistance * springProgress;
                translateY = 32 * Math.sin(springProgress * Math.PI);
              }
            }

            const barHeight = Math.max(48, Math.min(130, Math.floor((val / maxVal) * 110)));
            const isHighlighted = activePointers.length > 0 || isSorted || isSwapping;
            const cardScale = isHighlighted ? 1.0 + springProgress * 0.1 : 1.0;

            return (
              <div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                style={{
                  transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${cardScale})`,
                  zIndex: isSwapping ? 30 : isHighlighted ? 20 : 1,
                }}
                className="flex flex-col items-center gap-1.5 transition-all duration-300 ease-out"
              >
                {/* Pointer Badges */}
                <div className="flex items-center justify-center gap-1 min-h-5.5 transition-all duration-300">
                  {activePointers.map(([ptrName]) => {
                    const style = getPointerStyles(ptrName);
                    return (
                      <span
                        key={ptrName}
                        className={`px-2 py-0.5 rounded-full text-[10px] border font-mono font-extrabold uppercase tracking-wider shadow-sm transition-all duration-300 ${style.badge}`}
                      >
                        {ptrName}
                      </span>
                    );
                  })}
                </div>

                {/* Animated Sorting Height Bar Card */}
                <div
                  style={{ height: `${barHeight}px` }}
                  className={`w-14 rounded-lg border-2 flex items-center justify-center font-mono text-base font-bold shadow-md transition-all duration-300 ease-in-out ${cardBg} ${cardBorder} ${cardText}`}
                >
                  {val}
                </div>

                <span className="text-[11px] font-mono text-neutral-400 transition-colors duration-300">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>

        {/* Status Indicator */}
        {currentStep && (
          <div className="mt-3 flex items-center gap-2 transition-all duration-300 min-h-8">
            {currentStep.status === "sorted" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all duration-300">
                <CheckCircle className="w-4 h-4" />
                Array Fully Sorted
              </div>
            )}
            {currentStep.status === "swapping" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-semibold shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-all duration-300 animate-pulse">
                Swapping Elements in Mid-Air
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Variable Inspector */}
      {currentStep && Object.keys(currentStep.vars).length > 0 && (
        <div
          className={`p-3 rounded-lg border text-xs mb-3 transition-all duration-500 z-10 ${
            isDarkMode ? "bg-neutral-950 border-neutral-800" : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Sorting State & Variables:
          </div>
          <div className="flex items-center gap-2.5 flex-wrap font-mono">
            {Object.entries(currentStep.vars).map(([key, val]) => {
              const style = getPointerStyles(key);
              return (
                <div
                  key={key}
                  className={`px-3 py-1 rounded-md border flex items-center gap-1.5 transition-all duration-300 ease-in-out ${style.badge}`}
                >
                  <span className="opacity-80 text-[11px] font-semibold">{key}:</span>
                  <strong className="text-xs font-mono">{String(val)}</strong>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Execution Log Trace */}
      <div
        className={`p-3 rounded-lg border text-xs font-mono transition-all duration-300 z-10 ${
          isDarkMode ? "bg-neutral-950 border-neutral-800 text-neutral-300" : "bg-neutral-50 border-neutral-200 text-neutral-800"
        }`}
      >
        <div className="text-[11px] font-sans font-semibold text-neutral-400 uppercase tracking-wider mb-1">
          Sorting Trace Log:
        </div>
        <p className="leading-relaxed transition-all duration-300">
          {currentStep?.description || "Select a function call instance to start sorting."}
        </p>
      </div>
    </div>
  );
};
