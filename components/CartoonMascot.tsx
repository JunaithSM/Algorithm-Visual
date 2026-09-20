"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundFx } from "@/lib/visualizer/soundEffects";

export type MascotState = "idle" | "laughing" | "talking" | "talking2";

export interface FrameOverride {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface SpriteStateConfig {
  src: string;
  rows: number;
  cols: number;
  frameWidth?: number; // Single width for all frames in sprite image px
  frameHeight?: number; // Single height for all frames in sprite image px
  offsetX?: number; // X offset adjustment for all frames
  offsetY?: number; // Y offset adjustment for all frames
  fps?: number; // Animation speed for this state

  /** Optional column overrides (e.g. col 2 needs unique width or offset) */
  colOverrides?: Record<number, FrameOverride>;
  /** Optional row overrides (e.g. row 1 needs unique height or offset) */
  rowOverrides?: Record<number, FrameOverride>;
  /** Optional specific frame index overrides (0 to 9) */
  frameOverrides?: Record<number, FrameOverride>;
}

/**
 * =========================================================================
 * MASCOT CONFIGURATION CODE
 * =========================================================================
 * Set mascot scale, animation speeds, welcome text, and frame X, Y, W, H per state!
 */
export const MASCOT_CONFIG = {
  /** Display scale / size of the mascot in pixels */
  size: 80, // Change this single number to scale mascot (e.g. 44, 52, 60, 80)

  /** Welcome dialogue sequence text messages */
  welcomeMessages: [
    "Hi! Welcome to Algorithm Visualizer!",
    "Let's learn about {algorithm}",
    "Are you ready?",
    "Let's go!",
  ],

  /** Dynamic talking duration config (calculated based on string length) */
  talkMsPerChar: 25, // Milliseconds of talking per character in string
  minTalkDurationMs: 200, // Minimum talk duration in ms
  maxTalkDurationMs: 2500, // Maximum talk duration in ms

  /**
   * SPRITE STATES CONFIGURATION
   * Easily set single frameWidth, frameHeight, offsetX, and offsetY per state!
   */
  states: {
    idle: {
      src: "/spritesheet/idle.png",
      rows: 2,
      cols: 5,
      frameWidth: 396.6,
      frameHeight: 396.5,
      offsetX: 0,
      offsetY: 0,
      fps: 8,
    },
    talking: {
      src: "/spritesheet/talking.png",
      rows: 2,
      cols: 5,
      frameWidth: 434.4,
      frameHeight: 362,
      offsetX: 0,
      offsetY: 0,
      fps: 10,
    },
    talking2: {
      src: "/spritesheet/talking2.png",
      rows: 2,
      cols: 5,
      frameWidth: 434.4,
      frameHeight: 362,
      offsetX: 0,
      offsetY: 0,
      fps: 10,
    },
    laughing: {
      src: "/spritesheet/laughing.png",
      rows: 2,
      cols: 5,
      frameWidth: 434.4,
      frameHeight: 362,
      offsetX: 0,
      offsetY: 0,
      fps: 12,
    },
  } as Record<MascotState, SpriteStateConfig>,
};

/**
 * Calculates talk duration in milliseconds dynamically based on character length of text.
 */
export const getTalkDurationMs = (text: string): number => {
  const charCount = text ? text.length : 10;
  const rawDuration = charCount * MASCOT_CONFIG.talkMsPerChar;
  return Math.max(
    MASCOT_CONFIG.minTalkDurationMs,
    Math.min(rawDuration, MASCOT_CONFIG.maxTalkDurationMs)
  );
};

export interface CartoonMascotProps {
  /** Target HTML anchor ID to dock next to (default: "mascot-anchor") */
  targetAnchorId?: string;
  /** Active step index or description text to trigger talking animation on change */
  stepTrigger?: any;
  /** Step description text string to calculate character reveal length */
  stepText?: string;
  /** Current step status (e.g. "found", "sorted", "comparing") */
  stepStatus?: string;
  /** Algorithm title name for the welcome message (e.g. "Quick Sort") */
  algorithmTitle?: string;
  /** Scale / display size override in pixels (optional, defaults to MASCOT_CONFIG.size) */
  scale?: number;
  /** Animation FPS speed override (optional) */
  fps?: number;
  /** Callback fired when the initial center-screen welcome sequence finishes */
  onWelcomeComplete?: () => void;
}

const SESSION_WELCOMED_KEY = "mascot_welcome_shown";

export const CartoonMascot: React.FC<CartoonMascotProps> = ({
  targetAnchorId = "mascot-anchor",
  stepTrigger,
  stepText = "",
  stepStatus,
  algorithmTitle,
  scale,
  fps,
  onWelcomeComplete,
}) => {
  const displaySize = scale || MASCOT_CONFIG.size;

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isWelcoming, setIsWelcoming] = useState<boolean>(true);
  const [currentState, setCurrentState] = useState<MascotState>("talking");
  const [welcomeStep, setWelcomeStep] = useState<number>(0);
  const welcomeStepRef = useRef<number>(0);
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImagesRef = useRef<Record<string, HTMLImageElement>>({});
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const currentFrameIndexRef = useRef<number>(0);
  const talkTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hydration Safe: Check sessionStorage only after client component mounts
  useEffect(() => {
    setIsMounted(true);
    try {
      if (sessionStorage.getItem(SESSION_WELCOMED_KEY) === "true") {
        setIsWelcoming(false);
        setCurrentState("idle");
        onWelcomeComplete?.();
      }
    } catch {}
  }, [onWelcomeComplete]);

  // Preload all sprite sheet images
  useEffect(() => {
    Object.entries(MASCOT_CONFIG.states).forEach(([key, stateCfg]) => {
      if (!loadedImagesRef.current[stateCfg.src]) {
        const img = new Image();
        img.src = stateCfg.src;
        loadedImagesRef.current[stateCfg.src] = img;
      }
    });
  }, []);

  // Update target anchor coordinates (Left of Step Description Bar)
  useEffect(() => {
    const updatePosition = () => {
      const anchorEl = document.getElementById(targetAnchorId);
      if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        setAnchorPos({
          x: rect.left,
          y: rect.top,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      observer.disconnect();
    };
  }, [targetAnchorId]);

  // Initial Welcome Sequence: Interactive click sequence per welcome message
  // Slide 0: "Hi! Welcome to Algorithm Visualizer!" (talking based on text length -> idle)
  // Slide 1: "Let's learn about {algorithm}" (talking based on text length -> idle)
  // Slide 2: "Are you ready?" (talking based on text length -> idle)
  // Slide 3: "Let's go!" (laughing state & giggle sound effect)
  // Slide 4: (Click) -> Glides to anchor on left of Step Description -> Become Idle
  useEffect(() => {
    if (!isWelcoming) return;

    const messages = MASCOT_CONFIG.welcomeMessages;
    const isLastSlide = welcomeStep === messages.length - 1;

    if (isLastSlide) {
      setCurrentState("laughing");
    } else {
      const rawMsg = messages[welcomeStep] || "";
      const formattedMsg = rawMsg.replace(
        "{algorithm}",
        algorithmTitle || "Algorithms"
      );
      const talkDuration = getTalkDurationMs(formattedMsg);

      setCurrentState("talking");
      const talkTimer = setTimeout(() => {
        setCurrentState("idle");
      }, talkDuration);

      return () => clearTimeout(talkTimer);
    }
  }, [welcomeStep, isWelcoming, algorithmTitle]);

  useEffect(() => {
    if (!isWelcoming) return;

    const handleDismiss = () => {
      const messages = MASCOT_CONFIG.welcomeMessages;
      const nextStep = welcomeStepRef.current + 1;

      if (nextStep < messages.length) {
        welcomeStepRef.current = nextStep;
        setWelcomeStep(nextStep);
      } else {
        try {
          sessionStorage.setItem(SESSION_WELCOMED_KEY, "true");
        } catch {}
        setIsWelcoming(false);
        setCurrentState("idle");
        onWelcomeComplete?.();
      }
    };

    const clickTimeout = setTimeout(() => {
      window.addEventListener("click", handleDismiss);
    }, 100);

    return () => {
      clearTimeout(clickTimeout);
      window.removeEventListener("click", handleDismiss);
    };
  }, [isWelcoming, onWelcomeComplete]);

  // React to Step Text / Step Trigger changes (Play, Next, Prev, Step change)
  useEffect(() => {
    if (isWelcoming) return;

    if (talkTimerRef.current) {
      clearTimeout(talkTimerRef.current);
    }

    if (stepStatus === "found" || stepStatus === "sorted") {
      setCurrentState("laughing");
      talkTimerRef.current = setTimeout(() => {
        setCurrentState("idle");
      }, 1600);
    } else {
      const textToMeasure = stepText || (typeof stepTrigger === "string" ? stepTrigger : "");
      const talkDuration = getTalkDurationMs(textToMeasure);

      // Switch to talking state for dynamic talk duration based on text length
      setCurrentState("talking");

      talkTimerRef.current = setTimeout(() => {
        setCurrentState("idle");
      }, talkDuration);
    }

    return () => {
      if (talkTimerRef.current) clearTimeout(talkTimerRef.current);
    };
  }, [stepTrigger, stepText, stepStatus, isWelcoming]);

  // Audio Effect Trigger when Mascot is in laughing or talking state
  useEffect(() => {
    if (currentState === "laughing") {
      soundFx.playMascotLaugh();
      return;
    }

    if (currentState !== "talking" && currentState !== "talking2") return;

    // Play initial cute beep
    soundFx.playMascotTalkBeep();

    const beepInterval = setInterval(() => {
      soundFx.playMascotTalkBeep();
    }, 130);

    return () => clearInterval(beepInterval);
  }, [currentState]);

  // Main 60fps Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stateCfg = MASCOT_CONFIG.states[currentState];
    const currentSrc = stateCfg.src;
    const targetFps = fps || stateCfg.fps || 10;
    const frameInterval = 1000 / targetFps;

    const render = (time: number) => {
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = time;
      const delta = time - lastFrameTimeRef.current;

      const cols = stateCfg.cols || 5;
      const rows = stateCfg.rows || 2;
      const totalFrames = rows * cols;

      if (delta >= frameInterval) {
        lastFrameTimeRef.current = time - (delta % frameInterval);
        currentFrameIndexRef.current = (currentFrameIndexRef.current + 1) % totalFrames;
      }

      const img = loadedImagesRef.current[currentSrc];
      if (img && img.complete && img.naturalWidth > 0) {
        const autoFrameWidth = img.naturalWidth / cols;
        const autoFrameHeight = img.naturalHeight / rows;

        const baseW = stateCfg.frameWidth || autoFrameWidth;
        const baseH = stateCfg.frameHeight || autoFrameHeight;

        const frameIndex = currentFrameIndexRef.current;
        const col = frameIndex % cols;
        const row = Math.floor(frameIndex / cols);

        const colOv = stateCfg.colOverrides?.[col];
        const rowOv = stateCfg.rowOverrides?.[row];
        const frameOv = stateCfg.frameOverrides?.[frameIndex];

        // SX (Source X) calculation: Base column X + global offsetX + col/row/frame offsets
        const sx =
          frameOv?.x !== undefined
            ? frameOv.x
            : col * autoFrameWidth +
              (stateCfg.offsetX || 0) +
              (colOv?.offsetX || 0) +
              (rowOv?.offsetX || 0) +
              (frameOv?.offsetX || 0);

        // SY (Source Y) calculation: Base row Y + global offsetY + col/row/frame offsets
        const sy =
          frameOv?.y !== undefined
            ? frameOv.y
            : row * autoFrameHeight +
              (stateCfg.offsetY || 0) +
              (colOv?.offsetY || 0) +
              (rowOv?.offsetY || 0) +
              (frameOv?.offsetY || 0);

        // Source Width & Height
        const sw = frameOv?.width !== undefined ? frameOv.width : colOv?.width || baseW;
        const sh = frameOv?.height !== undefined ? frameOv.height : rowOv?.height || baseH;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentState, fps]);

  // Calculate current viewport coordinates for single moving mascot component (Hydration Safe)
  let currentX = 0;
  let currentY = 0;

  if (isMounted && typeof window !== "undefined") {
    currentX = window.innerWidth / 2 - displaySize / 2;
    currentY = window.innerHeight / 2 - displaySize / 2;
  }

  if (isMounted && !isWelcoming && anchorPos) {
    currentX = anchorPos.x;
    currentY = anchorPos.y;
  }

  return (
    <div
      style={{
        transform: `translate3d(${currentX}px, ${currentY}px, 0)`,
        transition: isWelcoming
          ? "transform 0.2s ease-out"
          : "transform 0.7s cubic-bezier(0.34, 1.25, 0.64, 1)",
      }}
      className="fixed top-0 left-0 z-50 pointer-events-none select-none flex flex-col items-center justify-center font-sans"
    >
      {/* Welcome Speech Dialogue (Only during initial center screen welcome phase) */}
      {isWelcoming && (
        <div className="absolute bottom-full mb-3 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs shadow-2xl animate-in fade-in zoom-in-90 duration-300 whitespace-nowrap font-medium pointer-events-auto flex flex-col items-center justify-center gap-1">
          {(() => {
            const rawMsg = MASCOT_CONFIG.welcomeMessages[welcomeStep] || "";
            const formattedMsg = rawMsg.replace(
              "{algorithm}",
              algorithmTitle || "Algorithms"
            );
            const welcomeWords = formattedMsg.split(" ");
            let globalCharIdx = 0;

            return (
              <div key={welcomeStep} className="flex items-center overflow-hidden font-sans">
                {welcomeWords.map((word, wIdx) => (
                  <span key={wIdx} className="inline-block whitespace-nowrap mr-1 overflow-hidden align-bottom">
                    {word.split("").map((char) => {
                      const delay = Math.min(globalCharIdx * 15, 450);
                      globalCharIdx++;
                      return (
                        <span
                          key={globalCharIdx}
                          style={{ animationDelay: `${delay}ms` }}
                          className="inline-block animate-letter-slide-up opacity-0"
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </div>
            );
          })()}
          {welcomeStep === 0 && (
            <span className="text-[10px] text-neutral-400 font-normal animate-pulse">
              (Click anywhere to continue)
            </span>
          )}
          {/* Dialogue Tail */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-900 border-r border-b border-neutral-800 rotate-45" />
        </div>
      )}

      {/* Mascot Canvas */}
      <canvas
        ref={canvasRef}
        width={displaySize}
        height={displaySize}
        onClick={() => {
          if (!isWelcoming) {
            setCurrentState("laughing");
            soundFx.playMascotLaugh();
            if (talkTimerRef.current) clearTimeout(talkTimerRef.current);
            talkTimerRef.current = setTimeout(() => {
              setCurrentState("idle");
            }, 1600);
          }
        }}
        className="drop-shadow-lg pointer-events-auto cursor-pointer transition-transform hover:scale-105 active:scale-95"
      />
    </div>
  );
};
