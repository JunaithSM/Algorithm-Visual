"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
  Sliders,
  Gauge,
  Code2,
  Volume2,
  VolumeX,
  RotateCw,
} from "lucide-react";
import { Step, generateSteps } from "@/lib/visualizer/simulator";
import { parseCodeInstances, ParsedInstance } from "@/lib/visualizer/codeParser";
import { SearchingCanvasSimulator } from "@/components/canvas/SearchingCanvasSimulator";
import { SortingCanvasSimulator } from "@/components/canvas/SortingCanvasSimulator";
import { soundFx } from "@/lib/visualizer/soundEffects";
import { getAlgorithmById } from "@/lib/algorithms";
import { CartoonMascot } from "@/components/CartoonMascot";

interface VisualizerPanelProps {
  algorithmId: string;
  category: string;
  isDarkMode: boolean;
  code?: string;
  onStepChange?: (step: Step | null) => void;
  algorithmTitle?: string;
  onSelectView?: (view: "split" | "code" | "visualizer" | "description") => void;
  activeView?: "split" | "code" | "visualizer" | "description";
}

export const VisualizerPanel: React.FC<VisualizerPanelProps> = ({
  algorithmId,
  category,
  isDarkMode,
  code = "",
  onStepChange,
  algorithmTitle,
  onSelectView,
  activeView = "split",
}) => {
  const algorithmObj = getAlgorithmById(algorithmId);
  const displayTitle = algorithmTitle || algorithmObj?.name || algorithmId;
  // Code call instances
  const [instances, setInstances] = useState<ParsedInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>("");

  // Step Animation state
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(2000); // step delay interval in ms (default: 2s)
  const [animSpeed, setAnimSpeed] = useState<number>(1); // canvas animation rate multiplier
  const [volume, setVolume] = useState<number>(0.5); // audio volume multiplier 0.0 - 1.0
  const [isLineByLine, setIsLineByLine] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [isWelcomeComplete, setIsWelcomeComplete] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevStepRef = useRef<number>(-1);
  const settingsRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const mascotAnchorRef = useRef<HTMLDivElement>(null);

  // Close settings popover menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSettingsOpen &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  // Automatically parse function call instances from Monaco Editor code string
  useEffect(() => {
    const parsed = parseCodeInstances(code, algorithmId, category);
    setInstances(parsed);

    if (!parsed.some((i) => i.id === selectedInstanceId)) {
      setSelectedInstanceId(parsed[0]?.id || "");
    }
  }, [code, algorithmId, category]);

  const activeInstance =
    instances.find((i) => i.id === selectedInstanceId) || instances[0];

  // Generate simulation steps whenever the selected instance, algorithm, code, or line-by-line mode changes
  useEffect(() => {
    if (activeInstance) {
      const generated = generateSteps(
        algorithmId,
        activeInstance.array,
        activeInstance.target ?? 9,
        code,
        activeInstance.lineNumber,
        isLineByLine
      );
      setSteps(generated);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      prevStepRef.current = -1;
    }
  }, [
    activeInstance?.id,
    activeInstance?.rawCall,
    activeInstance?.lineNumber,
    algorithmId,
    category,
    code,
    isLineByLine,
  ]);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  // Notify parent of current step change for Monaco line highlighting & sound effects
  useEffect(() => {
    if (steps.length > 0 && currentStepIndex < steps.length) {
      const step = steps[currentStepIndex];
      onStepChange?.(step);

      // Synthesize audio sound effects on step transition
      if (prevStepRef.current !== currentStepIndex) {
        prevStepRef.current = currentStepIndex;

        const maxVal = Math.max(...step.array, 10);
        if (step.status === "found" || step.status === "sorted") {
          soundFx.playSuccess();
        } else if (step.status === "not_found") {
          soundFx.playFailure();
        } else if (step.status === "swapping") {
          const v1 = step.array[step.activeIndices[0]] || 5;
          const v2 = step.array[step.activeIndices[1]] || 10;
          soundFx.playSwap(v1, v2, maxVal);
        } else if (step.status === "comparing" && step.activeIndices.length > 0) {
          const val = step.array[step.activeIndices[0]] || 5;
          soundFx.playCompare(val, maxVal);
        }
      }
    } else {
      onStepChange?.(null);
    }
  }, [currentStepIndex, steps, onStepChange]);

  const handleStepPrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    prevStepRef.current = -1;
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    soundFx.volume = val;
    if (val > 0 && soundFx.muted) {
      soundFx.muted = false;
      setIsMuted(false);
    } else if (val === 0 && !soundFx.muted) {
      soundFx.muted = true;
      setIsMuted(true);
    }
  };

  const handleToggleMute = () => {
    soundFx.muted = !soundFx.muted;
    setIsMuted(soundFx.muted);
  };

  const handleResetSettings = () => {
    setSpeed(2000);
    setAnimSpeed(0.5);
    setVolume(0.5);
    soundFx.volume = 0.5;
    soundFx.muted = false;
    setIsMuted(false);
    setIsLineByLine(false);
  };

  return (
    <div
      className={`flex flex-col h-full border rounded-lg overflow-hidden transition-colors relative font-sans ${
        isDarkMode
          ? "border-neutral-800 bg-neutral-950 text-white"
          : "border-neutral-200 bg-white text-neutral-900"
      }`}
    >
      {/* Panel Header */}
      <div
        className={`grid grid-cols-3 items-center px-4 py-2 border-b text-xs font-medium ${
          isDarkMode
            ? "border-neutral-800 bg-neutral-950 text-neutral-200"
            : "border-neutral-200 bg-neutral-50 text-neutral-800"
        }`}
      >
        {/* Left: Algorithm Title (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-2 font-semibold">
          <span>{displayTitle}</span>
        </div>

        {/* Center/Left: Function Instance Dropdown & Line Number (Left on Mobile, Center on Desktop) */}
        <div className="flex items-center justify-start lg:justify-center gap-2 font-sans col-span-2 lg:col-span-1 min-w-0">
          {instances.length > 0 && (
            <>
              <select
                value={activeInstance?.id || selectedInstanceId}
                onChange={(e) => {
                  setSelectedInstanceId(e.target.value);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                  prevStepRef.current = -1;
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-sans border font-medium cursor-pointer focus:outline-none transition min-w-0 max-w-[70%] truncate ${
                  isDarkMode
                    ? "bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700"
                    : "bg-white border-neutral-300 text-neutral-800 hover:border-neutral-400"
                }`}
              >
                {instances.map((inst) => (
                  <option
                    key={inst.id}
                    value={inst.id}
                    className={isDarkMode ? "bg-neutral-900 text-white" : "bg-white text-black"}
                  >
                    {inst.name}
                  </option>
                ))}
              </select>

              {activeInstance?.lineNumber && (
                <span className={`text-[11px] font-sans font-medium whitespace-nowrap ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                  Line {activeInstance.lineNumber}
                </span>
              )}
            </>
          )}
        </div>

        {/* Right: Header Buttons (Settings) */}
        <div className="flex items-center justify-end gap-2">
          <button
            ref={settingsBtnRef}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title="Simulator Settings"
            className={`p-1.5 rounded-md border transition cursor-pointer flex items-center justify-center ${
              isSettingsOpen
                ? "bg-sky-500/20 border-sky-500/40 text-sky-400"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dedicated Step Description Sub-Header Bar (Below Header, Above Controls - Non-Floating) */}
      {(() => {
        const descText =
          steps.length > 0 && currentStepIndex < steps.length
            ? steps[currentStepIndex].description
            : "No execution steps generated.";
        let globalCharIdx = 0;
        const words = descText.split(" ");

        return (
          <div
            className={`px-4 py-1.5 border-b text-xs font-medium flex items-center gap-3 font-sans transition-colors relative ${
              isDarkMode
                ? "border-neutral-800 bg-neutral-900/60 text-neutral-200"
                : "border-neutral-200 bg-neutral-100/60 text-neutral-800"
            }`}
          >
            {/* Left Anchor for Cartoon Mascot Guide (Top Left of Simulator Panel near Step Description) */}
            <div ref={mascotAnchorRef} className="w-11 h-11 shrink-0 flex items-center justify-center" />

            <CartoonMascot
              anchorRef={mascotAnchorRef}
              algorithmTitle={displayTitle}
              stepTrigger={isWelcomeComplete ? currentStepIndex : "welcome"}
              stepText={isWelcomeComplete ? descText : ""}
              stepStatus={isWelcomeComplete ? steps[currentStepIndex]?.status : undefined}
              onWelcomeComplete={() => setIsWelcomeComplete(true)}
            />

            <span className={`text-[11px] font-semibold whitespace-nowrap shrink-0 ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
              {steps.length > 0 ? `Step ${currentStepIndex + 1} of ${steps.length}` : "Step 0"}
            </span>

            {/* Step Description Text Reveal: Multi-line word-wrapped display */}
            {isWelcomeComplete && (
              <div
                key={`${currentStepIndex}-${descText}`}
                title={descText}
                className={`text-xs font-sans font-normal leading-relaxed flex flex-wrap items-center min-w-0 flex-1 break-words ${
                  isDarkMode ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                {words.map((word, wIdx) => (
                  <span key={wIdx} className="inline-flex whitespace-nowrap mr-1 align-baseline">
                    {word.split("").map((char) => {
                      const delay = Math.min(globalCharIdx * 10, 350);
                      globalCharIdx++;
                      return (
                        <span
                          key={globalCharIdx}
                          style={{ animationDelay: `${delay}ms` }}
                          className="inline-block animate-letter-slide-up"
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Settings Popover Dropdown Menu (Top Right - Dynamic Dark/Light Theme) */}
      <div
        ref={settingsRef}
        className={`absolute top-12 right-4 z-50 w-72 p-4 rounded-xl border shadow-2xl transition-all duration-200 ease-out origin-top-right font-sans ${
          isDarkMode
            ? "border-neutral-800 bg-neutral-900 text-neutral-100"
            : "border-neutral-200 bg-white text-neutral-900"
        } ${
          isSettingsOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Popover Header */}
        <div
          className={`flex items-center justify-between pb-2.5 mb-3 border-b ${
            isDarkMode ? "border-neutral-800" : "border-neutral-100"
          }`}
        >
          <div
            className={`flex items-center gap-2 font-semibold text-xs uppercase tracking-wider ${
              isDarkMode ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            <Settings className={`w-3.5 h-3.5 ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`} />
            <span>Settings</span>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className={`p-1 rounded-md transition cursor-pointer ${
              isDarkMode
                ? "hover:bg-neutral-800 text-neutral-400 hover:text-white"
                : "hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800"
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-sans">
          {/* 1. Step Delay Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <Sliders className={`w-3.5 h-3.5 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`} />
                <span>Step Delay</span>
              </div>
              <span className={`font-semibold ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                {(speed / 1000).toFixed(2)}s
              </span>
            </div>
            <input
              type="range"
              min="250"
              max="3000"
              step="50"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                isDarkMode ? "bg-neutral-800 accent-white" : "bg-neutral-200 accent-black"
              }`}
            />
            <div
              className={`flex justify-between text-[10px] font-sans ${
                isDarkMode ? "text-neutral-500" : "text-neutral-400"
              }`}
            >
              <span>0.25s (Fast)</span>
              <span>3.00s (Slow)</span>
            </div>
          </div>

          {/* 2. Animation Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <Gauge className={`w-3.5 h-3.5 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`} />
                <span>Animation Rate</span>
              </div>
              <span className={`font-semibold ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                {animSpeed.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              value={animSpeed}
              onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                isDarkMode ? "bg-neutral-800 accent-white" : "bg-neutral-200 accent-black"
              }`}
            />
            <div
              className={`flex justify-between text-[10px] font-sans ${
                isDarkMode ? "text-neutral-500" : "text-neutral-400"
              }`}
            >
              <span>0.10x (Slow Motion)</span>
              <span>2.00x (Instant)</span>
            </div>
          </div>

          {/* 3. Volume & Mute Section */}
          <div
            className={`space-y-2 pt-1 border-t ${
              isDarkMode ? "border-neutral-800" : "border-neutral-100"
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                  ) : (
                    <Volume2 className={`w-3.5 h-3.5 ${isDarkMode ? "text-neutral-300" : "text-neutral-600"}`} />
                  )}
                  <span>Volume</span>
                </div>
                <span className={`font-semibold ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                  {isMuted ? "Muted" : `${Math.round(volume * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDarkMode ? "bg-neutral-800 accent-white" : "bg-neutral-200 accent-black"
                }`}
              />
            </div>

            {/* Mute Toggle Row */}
            <div className="flex items-center justify-between pt-1">
              <span className={`font-medium ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>
                Mute Sound
              </span>
              <button
                type="button"
                onClick={handleToggleMute}
                aria-label="Toggle Mute"
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center ${
                  isMuted
                    ? isDarkMode
                      ? "bg-white"
                      : "bg-black"
                    : isDarkMode
                    ? "bg-neutral-800"
                    : "bg-neutral-200"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ${
                    isMuted
                      ? isDarkMode
                        ? "translate-x-4 bg-black"
                        : "translate-x-4 bg-white"
                      : isDarkMode
                      ? "translate-x-0 bg-neutral-400"
                      : "translate-x-0 bg-white"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 4. Line-by-Line Execution Toggle Row */}
          <div
            className={`flex items-center justify-between pt-2 border-t ${
              isDarkMode ? "border-neutral-800" : "border-neutral-100"
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              <Code2 className={`w-3.5 h-3.5 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`} />
              <span>Line-by-Line Mode</span>
            </div>
            <button
              type="button"
              onClick={() => setIsLineByLine(!isLineByLine)}
              aria-label="Toggle Line-by-Line Mode"
              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center ${
                isLineByLine
                  ? isDarkMode
                    ? "bg-white"
                    : "bg-black"
                  : isDarkMode
                  ? "bg-neutral-800"
                  : "bg-neutral-200"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ${
                  isLineByLine
                    ? isDarkMode
                      ? "translate-x-4 bg-black"
                      : "translate-x-4 bg-white"
                    : isDarkMode
                    ? "translate-x-0 bg-neutral-400"
                    : "translate-x-0 bg-white"
                }`}
              />
            </button>
          </div>

          {/* 5. Reset Settings Button */}
          <div className={`pt-2 border-t ${isDarkMode ? "border-neutral-800" : "border-neutral-100"}`}>
            <button
              onClick={handleResetSettings}
              className={`w-full py-1.5 px-3 rounded-md transition flex items-center justify-center gap-2 text-xs font-medium cursor-pointer ${
                isDarkMode
                  ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`} />
              <span>Reset Settings</span>
            </button>
          </div>
        </div>
      </div>


      {/* Main HTML5 Canvas Simulator Canvas Container */}
      <div className="flex-1 overflow-hidden relative">
        {/* Floating Centered Animation Controls (Top Centered above canvas - Smooth Hide/Show) */}
        <div
          className={`absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 ease-out ${
            isDarkMode
              ? "bg-neutral-900/80 border-neutral-800 text-white shadow-black/50"
              : "bg-white/80 border-neutral-200 text-neutral-900 shadow-neutral-200/50"
          }`}
        >
          {/* 1. Previous Step Button */}
          <button
            onClick={handleStepPrev}
            title="Previous Step"
            className={`rounded-full flex items-center justify-center transition-all duration-300 ease-out cursor-pointer shrink-0 ${
              isDarkMode
                ? "bg-neutral-800/80 border border-neutral-700/60 text-neutral-200 hover:bg-neutral-700 hover:text-white"
                : "bg-neutral-100 border border-neutral-200 text-neutral-700 hover:bg-neutral-200 hover:text-black"
            } ${
              currentStepIndex > 0 && steps.length > 0
                ? "w-8 h-8 opacity-100 scale-100 pointer-events-auto"
                : "w-0 h-8 opacity-0 scale-75 pointer-events-none overflow-hidden p-0! border-0! m-0!"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 2. Play / Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause Animation" : "Play Animation"}
            className={`rounded-full flex items-center justify-center transition-all duration-300 ease-out cursor-pointer shadow shrink-0 ${
              isDarkMode
                ? "bg-white text-black hover:bg-neutral-200"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            } ${
              steps.length > 0 && (isPlaying || currentStepIndex < steps.length - 1)
                ? "w-9 h-9 opacity-100 scale-100 pointer-events-auto"
                : "w-0 h-9 opacity-0 scale-75 pointer-events-none overflow-hidden p-0! border-0! m-0!"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* 3. Next Step Button */}
          <button
            onClick={handleStepNext}
            title="Next Step"
            className={`rounded-full flex items-center justify-center transition-all duration-300 ease-out cursor-pointer shrink-0 ${
              isDarkMode
                ? "bg-neutral-800/80 border border-neutral-700/60 text-neutral-200 hover:bg-neutral-700 hover:text-white"
                : "bg-neutral-100 border border-neutral-200 text-neutral-700 hover:bg-neutral-200 hover:text-black"
            } ${
              currentStepIndex < steps.length - 1 && steps.length > 0
                ? "w-8 h-8 opacity-100 scale-100 pointer-events-auto"
                : "w-0 h-8 opacity-0 scale-75 pointer-events-none overflow-hidden p-0! border-0! m-0!"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* 4. Reset Button */}
          <button
            onClick={handleReset}
            title="Reset Animation"
            className={`rounded-full flex items-center justify-center transition-all duration-300 ease-out cursor-pointer shrink-0 ${
              isDarkMode
                ? "bg-neutral-800/80 border border-neutral-700/60 text-neutral-200 hover:bg-neutral-700 hover:text-white"
                : "bg-neutral-100 border border-neutral-200 text-neutral-700 hover:bg-neutral-200 hover:text-black"
            } ${
              currentStepIndex > 0 && steps.length > 0
                ? "w-8 h-8 opacity-100 scale-100 pointer-events-auto"
                : "w-0 h-8 opacity-0 scale-75 pointer-events-none overflow-hidden p-0! border-0! m-0!"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {category === "Sorting" ? (
          <SortingCanvasSimulator
            steps={steps}
            currentStepIndex={currentStepIndex}
            isDarkMode={isDarkMode}
            algorithmId={algorithmId}
            speed={speed}
            animSpeed={animSpeed}
          />
        ) : (
          <SearchingCanvasSimulator
            steps={steps}
            currentStepIndex={currentStepIndex}
            isDarkMode={isDarkMode}
            algorithmId={algorithmId}
            speed={speed}
            animSpeed={animSpeed}
          />
        )}
      </div>
    </div>
  );
};
