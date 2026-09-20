"use client";

import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Step } from "@/lib/visualizer/simulator";
import { CheckCircle, XCircle } from "lucide-react";

export interface AlgorithmCompositionProps {
  steps: Step[];
  isDarkMode: boolean;
  algorithmId: string;
  category: string;
  stepDurationFrames?: number;
}

/** Pointer & Variable Color Config Map */
const POINTER_COLOR_MAP: Record<
  string,
  {
    badge: string;
    cardBg: string;
    cardBorder: string;
    cardText: string;
  }
> = {
  // Pointer 'i', 'low', 'left' -> Sky Blue
  i: {
    badge: "bg-sky-500/25 border-sky-400 text-sky-300 font-bold",
    cardBg: "bg-sky-500/20",
    cardBorder: "border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.6)]",
    cardText: "text-sky-200",
  },
  low: {
    badge: "bg-sky-500/25 border-sky-400 text-sky-300 font-bold",
    cardBg: "bg-sky-500/20",
    cardBorder: "border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.6)]",
    cardText: "text-sky-200",
  },
  left: {
    badge: "bg-sky-500/25 border-sky-400 text-sky-300 font-bold",
    cardBg: "bg-sky-500/20",
    cardBorder: "border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.6)]",
    cardText: "text-sky-200",
  },
  // Pointer 'j', 'high', 'right' -> Amber / Yellow
  j: {
    badge: "bg-amber-500/25 border-amber-400 text-amber-300 font-bold",
    cardBg: "bg-amber-500/20",
    cardBorder: "border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.6)]",
    cardText: "text-amber-200",
  },
  high: {
    badge: "bg-amber-500/25 border-amber-400 text-amber-300 font-bold",
    cardBg: "bg-amber-500/20",
    cardBorder: "border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.6)]",
    cardText: "text-amber-200",
  },
  right: {
    badge: "bg-amber-500/25 border-amber-400 text-amber-300 font-bold",
    cardBg: "bg-amber-500/20",
    cardBorder: "border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.6)]",
    cardText: "text-amber-200",
  },
  // Pointer 'k', 'mid', 'pos', 'position' -> Purple / Indigo
  k: {
    badge: "bg-purple-500/25 border-purple-400 text-purple-300 font-bold",
    cardBg: "bg-purple-500/20",
    cardBorder: "border-purple-400 shadow-[0_0_18px_rgba(192,132,252,0.6)]",
    cardText: "text-purple-200",
  },
  mid: {
    badge: "bg-purple-500/25 border-purple-400 text-purple-300 font-bold",
    cardBg: "bg-purple-500/20",
    cardBorder: "border-purple-400 shadow-[0_0_18px_rgba(192,132,252,0.6)]",
    cardText: "text-purple-200",
  },
  pos: {
    badge: "bg-purple-500/25 border-purple-400 text-purple-300 font-bold",
    cardBg: "bg-purple-500/20",
    cardBorder: "border-purple-400 shadow-[0_0_18px_rgba(192,132,252,0.6)]",
    cardText: "text-purple-200",
  },
  position: {
    badge: "bg-purple-500/25 border-purple-400 text-purple-300 font-bold",
    cardBg: "bg-purple-500/20",
    cardBorder: "border-purple-400 shadow-[0_0_18px_rgba(192,132,252,0.6)]",
    cardText: "text-purple-200",
  },
  // Target -> Emerald Green
  target: {
    badge: "bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold",
    cardBg: "bg-emerald-500/20",
    cardBorder: "border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.6)]",
    cardText: "text-emerald-200",
  },
};

function getPointerStyles(varName: string) {
  const key = varName.toLowerCase().trim();
  return (
    POINTER_COLOR_MAP[key] || {
      badge: "bg-pink-500/25 border-pink-400 text-pink-300 font-bold",
      cardBg: "bg-pink-500/20",
      cardBorder: "border-pink-400 shadow-[0_0_18px_rgba(244,114,182,0.6)]",
      cardText: "text-pink-200",
    }
  );
}

export const AlgorithmComposition: React.FC<AlgorithmCompositionProps> = ({
  steps = [],
  isDarkMode = true,
  algorithmId = "Algorithm",
  stepDurationFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!steps || steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400 font-mono text-xs">
        No execution steps generated.
      </div>
    );
  }

  const rawStepIndex = Math.floor(frame / stepDurationFrames);
  const stepIndex = Math.min(rawStepIndex, steps.length - 1);
  const currentStep = steps[stepIndex];

  const stepFrame = frame % stepDurationFrames;
  const springScale = spring({
    frame: stepFrame,
    fps,
    config: { damping: 12, mass: 0.4 },
  });

  const fadeOpacity = interpolate(stepFrame, [0, 8], [0.6, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      className={`w-full h-full p-6 flex flex-col justify-between font-sans overflow-y-auto select-none ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Pointer Color Legend */}
      <div className="flex items-center justify-center gap-4 text-[11px] font-mono pb-2 flex-wrap opacity-90">
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
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-emerald-300 font-bold">target</span>
        </div>
      </div>

      {/* Array Cards Visualizer with Remotion Spring Physics */}
      <div className="flex flex-col items-center justify-center my-auto py-2">
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
              cardBorder = "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]";
              cardText = "text-emerald-300 font-bold";
            } else if (activePointers.length > 0) {
              const primaryPtr = activePointers[0][0];
              const style = getPointerStyles(primaryPtr);
              cardBg = style.cardBg;
              cardBorder = style.cardBorder;
              cardText = `${style.cardText} font-bold`;
            }

            const scaleStyle =
              activePointers.length > 0 || isFound
                ? { transform: `scale(${0.95 + springScale * 0.12})`, opacity: fadeOpacity }
                : { transform: `scale(1)` };

            return (
              <div
                key={idx}
                style={scaleStyle}
                className="flex flex-col items-center gap-1.5 transition-all duration-150"
              >
                {/* Pointer Badges */}
                <div className="flex items-center justify-center gap-1 min-h-5.5">
                  {activePointers.map(([ptrName]) => {
                    const style = getPointerStyles(ptrName);
                    return (
                      <span
                        key={ptrName}
                        className={`px-2 py-0.5 rounded-full text-[10px] border font-mono font-extrabold uppercase tracking-wider shadow-sm ${style.badge}`}
                      >
                        {ptrName}
                      </span>
                    );
                  })}
                </div>

                {/* Remotion Animated Card Element */}
                <div
                  className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-mono text-base font-bold shadow-md transition-all duration-150 ${cardBg} ${cardBorder} ${cardText}`}
                >
                  {val}
                </div>

                <span className="text-[11px] font-mono text-neutral-400">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>

        {/* Status Badge */}
        {currentStep && (
          <div className="mt-3 flex items-center gap-2">
            {currentStep.status === "found" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                <CheckCircle className="w-4 h-4" />
                Target Found
              </div>
            )}
            {currentStep.status === "not_found" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-semibold shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                <XCircle className="w-4 h-4" />
                Target Not Found
              </div>
            )}
            {currentStep.status === "comparing" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-400 text-xs font-semibold shadow-[0_0_12px_rgba(56,189,248,0.3)]">
                Comparing Elements
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Variable Inspector */}
      {currentStep && Object.keys(currentStep.vars).length > 0 && (
        <div
          className={`p-3 rounded-lg border text-xs mb-3 ${
            isDarkMode ? "bg-neutral-950 border-neutral-800" : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Live Variables Inspector:
          </div>
          <div className="flex items-center gap-2.5 flex-wrap font-mono">
            {Object.entries(currentStep.vars).map(([key, val]) => {
              const style = getPointerStyles(key);
              return (
                <div
                  key={key}
                  className={`px-3 py-1 rounded-md border flex items-center gap-1.5 transition ${style.badge}`}
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
        className={`p-3 rounded-lg border text-xs font-mono ${
          isDarkMode ? "bg-neutral-950 border-neutral-800 text-neutral-300" : "bg-neutral-50 border-neutral-200 text-neutral-800"
        }`}
      >
        <div className="text-[11px] font-sans font-semibold text-neutral-400 uppercase tracking-wider mb-1">
          Step Description:
        </div>
        <p className="leading-relaxed">
          {currentStep?.description || "Select a function call instance to start visualization."}
        </p>
      </div>
    </div>
  );
};
