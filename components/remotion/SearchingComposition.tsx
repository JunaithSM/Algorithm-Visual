"use client";

import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Step } from "@/lib/visualizer/simulator";
import { CheckCircle, XCircle, Search } from "lucide-react";

export interface SearchingCompositionProps {
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
    cardBg: "bg-sky-500/20",
    cardBorder: "border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.5)]",
    cardText: "text-sky-200",
  },
  low: {
    badge: "bg-sky-500/25 border-sky-400 text-sky-300 font-bold",
    cardBg: "bg-sky-500/20",
    cardBorder: "border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.5)]",
    cardText: "text-sky-200",
  },
  left: {
    badge: "bg-sky-500/25 border-sky-400 text-sky-300 font-bold",
    cardBg: "bg-sky-500/20",
    cardBorder: "border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.5)]",
    cardText: "text-sky-200",
  },
  j: {
    badge: "bg-amber-500/25 border-amber-400 text-amber-300 font-bold",
    cardBg: "bg-amber-500/20",
    cardBorder: "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]",
    cardText: "text-amber-200",
  },
  high: {
    badge: "bg-amber-500/25 border-amber-400 text-amber-300 font-bold",
    cardBg: "bg-amber-500/20",
    cardBorder: "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]",
    cardText: "text-amber-200",
  },
  right: {
    badge: "bg-amber-500/25 border-amber-400 text-amber-300 font-bold",
    cardBg: "bg-amber-500/20",
    cardBorder: "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]",
    cardText: "text-amber-200",
  },
  k: {
    badge: "bg-purple-500/25 border-purple-400 text-purple-300 font-bold",
    cardBg: "bg-purple-500/20",
    cardBorder: "border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.5)]",
    cardText: "text-purple-200",
  },
  mid: {
    badge: "bg-purple-500/25 border-purple-400 text-purple-300 font-bold",
    cardBg: "bg-purple-500/20",
    cardBorder: "border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.5)]",
    cardText: "text-purple-200",
  },
  pos: {
    badge: "bg-purple-500/25 border-purple-400 text-purple-300 font-bold",
    cardBg: "bg-purple-500/20",
    cardBorder: "border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.5)]",
    cardText: "text-purple-200",
  },
  target: {
    badge: "bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold",
    cardBg: "bg-emerald-500/20",
    cardBorder: "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]",
    cardText: "text-emerald-200",
  },
};

function getPointerStyles(varName: string) {
  const key = varName.toLowerCase().trim();
  return (
    POINTER_COLOR_MAP[key] || {
      badge: "bg-pink-500/25 border-pink-400 text-pink-300 font-bold",
      cardBg: "bg-pink-500/20",
      cardBorder: "border-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.5)]",
      cardText: "text-pink-200",
    }
  );
}

export const SearchingComposition: React.FC<SearchingCompositionProps> = ({
  steps = [],
  isDarkMode = true,
  algorithmId = "SearchAlgorithm",
  stepDurationFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const targetBadgeRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!steps || steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400 font-mono text-xs">
        No execution steps generated for searching.
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

  const targetValue = currentStep.vars.target ?? "N/A";
  const isComparing = currentStep.status === "comparing";

  // HTML5 Canvas Overlay Drawing for Accurate Electric Dashed Arc Line & Glowing Endpoints
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

    if (isComparing && currentStep.activeIndices.length > 0) {
      let p1: { x: number; y: number } | null = null;
      let p2: { x: number; y: number } | null = null;

      if (currentStep.activeIndices.length >= 2) {
        const el1 = cardRefs.current[currentStep.activeIndices[0]];
        const el2 = cardRefs.current[currentStep.activeIndices[1]];
        if (el1 && el2) {
          const r1 = el1.getBoundingClientRect();
          const r2 = el2.getBoundingClientRect();
          p1 = { x: r1.left + r1.width / 2 - rect.left, y: r1.top + r1.height / 2 - rect.top };
          p2 = { x: r2.left + r2.width / 2 - rect.left, y: r2.top + r2.height / 2 - rect.top };
        }
      } else if (targetBadgeRef.current && cardRefs.current[currentStep.activeIndices[0]]) {
        const el1 = targetBadgeRef.current;
        const el2 = cardRefs.current[currentStep.activeIndices[0]];
        if (el1 && el2) {
          const r1 = el1.getBoundingClientRect();
          const r2 = el2.getBoundingClientRect();
          p1 = { x: r1.left + r1.width / 2 - rect.left, y: r1.top + r1.height / 2 - rect.top };
          p2 = { x: r2.left + r2.width / 2 - rect.left, y: r2.top + r2.height / 2 - rect.top };
        }
      }

      if (p1 && p2) {
        const midX = (p1.x + p2.x) / 2;
        const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const arcHeight = Math.min(55, distance * 0.35 + 15);
        const midY = Math.min(p1.y, p2.y) - arcHeight;

        // Glowing gradient stroke
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, "#34d399"); // Emerald Green
        grad.addColorStop(0.5, "#38bdf8"); // Sky Blue
        grad.addColorStop(1, "#c084fc"); // Purple

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -frame * 2.5; // Flowing electric dashes!
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Pulsing Endpoint Circles
        [p1, p2].forEach((pt, idx) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 6 + Math.sin(frame * 0.25) * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = idx === 0 ? "#34d399" : "#c084fc";
          ctx.shadowColor = idx === 0 ? "#34d399" : "#c084fc";
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
      {/* HTML5 Canvas Overlay for Pixel-Accurate Animated Dashed Comparison Lines */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-30"
      />

      {/* Top Bar: Target Display & Pointer Legend */}
      <div className="flex items-center justify-between border-b pb-3 border-neutral-800/60 flex-wrap gap-2 transition-all duration-300 z-10">
        <div
          ref={targetBadgeRef}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold transition-all duration-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          <span>Searching Target: {String(targetValue)}</span>
        </div>

        {/* Pointer Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono opacity-90">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span className="text-sky-300 font-bold">i / low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="text-amber-300 font-bold">j / high</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
            <span className="text-purple-300 font-bold">k / mid / pos</span>
          </div>
        </div>
      </div>

      {/* Array Cards Search Visualizer */}
      <div className="flex flex-col items-center justify-center my-auto py-2 z-10">
        <div className="flex items-center justify-center gap-4 flex-wrap min-h-27.5">
          {currentStep?.array.map((val, idx) => {
            const isFound = currentStep.foundIndex === idx;

            const activePointers = currentStep
              ? Object.entries(currentStep.vars).filter(
                  ([key, v]) => typeof v === "number" && v === idx
                )
              : [];

            let cardBg = isDarkMode ? "bg-neutral-900" : "bg-neutral-100";
            let cardBorder = isDarkMode ? "border-neutral-800" : "border-neutral-300";
            let cardText = isDarkMode ? "text-neutral-200" : "text-neutral-800";

            if (isFound) {
              cardBg = "bg-emerald-500/25";
              cardBorder = "border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.7)]";
              cardText = "text-emerald-300 font-bold";
            } else if (activePointers.length > 0) {
              const primaryPtr = activePointers[0][0];
              const style = getPointerStyles(primaryPtr);
              cardBg = style.cardBg;
              cardBorder = style.cardBorder;
              cardText = `${style.cardText} font-bold`;
            }

            const isHighlighted = activePointers.length > 0 || isFound;
            const cardScale = isHighlighted ? 1.0 + springProgress * 0.08 : 1.0;

            return (
              <div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                style={{
                  transform: `scale(${cardScale})`,
                }}
                className="flex flex-col items-center gap-1.5 transition-all duration-500 ease-in-out relative"
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

                {/* Animated Search Element Box */}
                <div
                  className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-mono text-base font-bold shadow-md transition-all duration-500 ease-in-out ${cardBg} ${cardBorder} ${cardText}`}
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

        {/* Status Badge */}
        {currentStep && (
          <div className="mt-3 flex items-center gap-2 transition-all duration-300 min-h-8">
            {currentStep.status === "found" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all duration-300">
                <CheckCircle className="w-4 h-4" />
                Target Found
              </div>
            )}
            {currentStep.status === "not_found" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-semibold shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-all duration-300">
                <XCircle className="w-4 h-4" />
                Target Not Found
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
            Searching Variables:
          </div>
          <div className="flex items-center gap-2.5 flex-wrap font-mono">
            {Object.entries(currentStep.vars).map(([key, val]) => {
              const style = getPointerStyles(key);
              return (
                <div
                  key={key}
                  className={`px-3 py-1 rounded-md border flex items-center gap-1.5 transition-all duration-500 ease-in-out ${style.badge}`}
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
          Search Trace Log:
        </div>
        <p className="leading-relaxed transition-all duration-300">
          {currentStep?.description || "Select a function call instance to start searching."}
        </p>
      </div>
    </div>
  );
};
