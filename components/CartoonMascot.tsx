"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { soundFx } from "@/lib/visualizer/soundEffects";

export type MascotState = "idle" | "laughing" | "talking";

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
  talkMsPerChar: 6, // Milliseconds of talking per character in string
  minTalkDurationMs: 800, // Minimum talk duration in ms (allows at least 1.2s of cute chatter)
  maxTalkDurationMs: 1500, // Maximum talk duration in ms

  /**
   * SPRITE STATES CONFIGURATION
   * Easily set single frameWidth, frameHeight, offsetX, and offsetY per state!
   */
  states: {
    idle: {
      src: "/spritesheet/idlespritesheet.png",
      rows: 1,
      cols: 10,
      frameWidth: 100,
      frameHeight: 100,
      offsetX: 0,
      offsetY: 0,
      fps: 8,
    },
    talking: {
      src: "/spritesheet/talkingspritesheet.png",
      rows: 1,
      cols: 19,
      frameWidth: 100,
      frameHeight: 100,
      offsetX: 0,
      offsetY: 0,
      fps: 8 ,
    },
    laughing: {
      src: "/spritesheet/laughingspritesheet.png",
      rows: 1,
      cols: 11,
      frameWidth: 100,
      frameHeight: 100,
      offsetX: 0,
      offsetY: 0,
      fps: 8,
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
  /** Direct ref to the anchor element (preferred over targetAnchorId to avoid duplicate ID issues) */
  anchorRef?: React.RefObject<HTMLDivElement | null>;
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
  anchorRef,
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
  const [isAnchorVisible, setIsAnchorVisible] = useState<boolean>(true);
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImagesRef = useRef<Record<string, HTMLImageElement>>({});
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const currentFrameIndexRef = useRef<number>(0);
  const talkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onWelcomeCompleteRef = useRef(onWelcomeComplete);

  // Keep the ref in sync with the latest prop (avoids stale closure)
  useEffect(() => {
    onWelcomeCompleteRef.current = onWelcomeComplete;
  }, [onWelcomeComplete]);

  // Hydration Safe: Check sessionStorage only after client component mounts (runs ONCE)
  useEffect(() => {
    setIsMounted(true);
    try {
      if (sessionStorage.getItem(SESSION_WELCOMED_KEY) === "true") {
        setIsWelcoming(false);
        setCurrentState("idle");
        onWelcomeCompleteRef.current?.();
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

  // Preload all sprite sheet images with robust onload handlers
  useEffect(() => {
    let loadedCount = 0;
    const entries = Object.entries(MASCOT_CONFIG.states);

    entries.forEach(([key, stateCfg]) => {
      let img = loadedImagesRef.current[stateCfg.src];
      if (!img) {
        img = new Image();
        img.onload = () => {
          setImagesLoaded((prev) => !prev);
        };
        img.src = stateCfg.src;
        loadedImagesRef.current[stateCfg.src] = img;
      }
      if (img.complete) {
        loadedCount++;
      } else {
        img.onload = () => {
          setImagesLoaded((prev) => !prev);
        };
      }
    });

    if (loadedCount >= entries.length) {
      setImagesLoaded(true);
    }
  }, []);

  // Update target anchor coordinates (Top Left of Simulator Panel near Step Description)
  useEffect(() => {
    let rafId: number;

    const updatePosition = () => {
      // Prefer ref (avoids duplicate ID issue with mobile + desktop VisualizerPanels)
      const anchorEl = anchorRef?.current ?? document.getElementById(targetAnchorId);
      if (anchorEl) {
        // Check if anchor element is visible in layout DOM (not hidden via CSS display: none)
        const rects = anchorEl.getClientRects();
        const hasSize = anchorEl.offsetWidth > 0 || anchorEl.offsetHeight > 0;
        if (rects.length === 0 && !hasSize) {
          setIsAnchorVisible(false);
          return;
        }

        const rect = anchorEl.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          setIsAnchorVisible(false);
          return;
        }

        setIsAnchorVisible(true);

        // Center the mascot sprite over the anchor element's center point
        const anchorCenterX = rect.left + rect.width / 2;
        const anchorCenterY = rect.top + rect.height / 2;
        setAnchorPos({
          x: anchorCenterX - displaySize / 2,
          y: anchorCenterY - displaySize / 2,
        });
      } else {
        setIsAnchorVisible(false);
      }
    };

    updatePosition();
    // Run again next frame to capture post-mount layout shifts
    rafId = requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      observer.disconnect();
    };
  }, [targetAnchorId, anchorRef, displaySize]);

  // Initial Welcome Sequence: Interactive click sequence per welcome message
  useEffect(() => {
    if (!isWelcoming || !isAnchorVisible) return;

    const messages = MASCOT_CONFIG.welcomeMessages;
    const isLastSlide = welcomeStep === messages.length - 1;

    currentFrameIndexRef.current = 0;
    lastFrameTimeRef.current = 0;

    if (isLastSlide) {
      setCurrentState("laughing");
      soundFx.playMascotLaugh();
    } else {
      const rawMsg = messages[welcomeStep] || "";
      const formattedMsg = rawMsg.replace(
        "{algorithm}",
        algorithmTitle || "Algorithms"
      );
      const talkDuration = getTalkDurationMs(formattedMsg);

      setCurrentState("talking");
      soundFx.playMascotTalkBeep();

      const beepInterval = setInterval(() => {
        soundFx.playMascotTalkBeep();
      }, 130);

      const talkTimer = setTimeout(() => {
        clearInterval(beepInterval);
        setCurrentState("idle");
      }, talkDuration);

      return () => {
        clearInterval(beepInterval);
        clearTimeout(talkTimer);
      };
    }
  }, [welcomeStep, isWelcoming, isAnchorVisible, algorithmTitle]);

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
    if (isWelcoming || !isAnchorVisible) return;

    // Cancel any previously scheduled idle transition from a prior invocation.
    // We MUST snapshot the old timer id before overwriting talkTimerRef.current,
    // otherwise the cleanup closure would cancel the *new* timer we're about to create.
    const prevTimer = talkTimerRef.current;
    if (prevTimer) {
      clearTimeout(prevTimer);
      talkTimerRef.current = null;
    }

    currentFrameIndexRef.current = 0;
    lastFrameTimeRef.current = 0;

    if (stepStatus === "found" || stepStatus === "sorted") {
      setCurrentState("laughing");
      soundFx.playMascotLaugh();
      const laughTimer = setTimeout(() => {
        setCurrentState("idle");
        talkTimerRef.current = null;
      }, 1600);
      talkTimerRef.current = laughTimer;
      // Return cleanup so if deps change before 1600ms the laugh timer is cancelled
      return () => {
        clearTimeout(laughTimer);
        talkTimerRef.current = null;
      };
    }

    const textToMeasure = stepText || (typeof stepTrigger === "string" ? stepTrigger : "");
    const talkDuration = getTalkDurationMs(textToMeasure);

    // Switch to talking state for dynamic talk duration based on text length
    setCurrentState("talking");
    soundFx.playMascotTalkBeep();

    const beepInterval = setInterval(() => {
      soundFx.playMascotTalkBeep();
    }, 130);

    // Store the idle timer so it can be cancelled by the *next* effect invocation.
    // Use a local variable so the cleanup closure below can cancel it without touching
    // talkTimerRef.current (which may have been overwritten by then).
    const idleTimer = setTimeout(() => {
      clearInterval(beepInterval);
      setCurrentState("idle");
      talkTimerRef.current = null;
    }, talkDuration);
    talkTimerRef.current = idleTimer;

    return () => {
      clearInterval(beepInterval);
      clearTimeout(idleTimer);
      talkTimerRef.current = null;
    };
  }, [stepTrigger, stepText, stepStatus, isWelcoming, isAnchorVisible]);

  // Main 60fps Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    currentFrameIndexRef.current = 0;
    lastFrameTimeRef.current = 0;

    let animationFrameId: number;

    const render = (time: number) => {
      const stateCfg = MASCOT_CONFIG.states[currentState] || MASCOT_CONFIG.states.idle;
      const currentSrc = stateCfg.src;
      const targetFps = fps || stateCfg.fps || 10;
      const frameInterval = 1000 / targetFps;

      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = time;
      }

      const delta = time - lastFrameTimeRef.current;
      const cols = stateCfg.cols || 1;
      const rows = stateCfg.rows || 1;
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

        const frameIndex = currentFrameIndexRef.current % totalFrames;
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

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentState, fps, imagesLoaded]);

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

  // Use React Portal to render at document.body level, escaping any parent
  // CSS transforms (e.g. animate-in) that break position: fixed containment.
  const mascotJsx = (
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

  // Portal to document.body so fixed positioning is relative to viewport
  if (!isMounted || !isAnchorVisible) return null;
  return createPortal(mascotJsx, document.body);
};
