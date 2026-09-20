"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Columns2, Play, Code2, FileText, LucideIcon } from "lucide-react";

export type WorkspaceView = "split" | "code" | "visualizer" | "description";

export interface WorkspaceNavTabsProps {
  activeView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  isDarkMode: boolean;
  variant?: "header" | "mobile";
}

interface TabDef {
  id: WorkspaceView;
  label: string;
  icon: LucideIcon;
  desktopOnly?: boolean;
}

const ALL_TABS: TabDef[] = [
  { id: "split", label: "Split", icon: Columns2, desktopOnly: true },
  { id: "visualizer", label: "Visualizer", icon: Play },
  { id: "code", label: "Code", icon: Code2 },
  { id: "description", label: "Description", icon: FileText },
];

export const WorkspaceNavTabs: React.FC<WorkspaceNavTabsProps> = ({
  activeView,
  onSelectView,
  isDarkMode,
  variant = "header",
}) => {
  const tabs = variant === "mobile" ? ALL_TABS.filter((t) => !t.desktopOnly) : ALL_TABS;

  // On mobile, 'split' view mode falls back to showing the visualizer panel full screen,
  // so we map 'split' -> 'visualizer' for mobile active tab highlighting.
  const effectiveActiveView =
    variant === "mobile" && activeView === "split" ? "visualizer" : activeView;

  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const updatePill = useCallback(() => {
    const currentTabEl = tabRefs.current[effectiveActiveView];
    if (currentTabEl) {
      setPillStyle({
        left: currentTabEl.offsetLeft,
        width: currentTabEl.offsetWidth,
        opacity: 1,
      });
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [effectiveActiveView]);

  useEffect(() => {
    updatePill();
    const rafId = requestAnimationFrame(updatePill);
    return () => cancelAnimationFrame(rafId);
  }, [updatePill, effectiveActiveView]);

  useEffect(() => {
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [updatePill]);

  return (
    <nav
      aria-label="Workspace Navigation Tabs"
      className={`relative flex items-center gap-1 font-sans transition-all duration-300 ease-out select-none ${
        variant === "header"
          ? `p-1 rounded-xl border ${
              isDarkMode
                ? "bg-neutral-900/80 border-neutral-800 text-neutral-400"
                : "bg-neutral-100/90 border-neutral-200 text-neutral-600"
            }`
          : `p-1.5 rounded-full border shadow-2xl backdrop-blur-xl w-full justify-around ${
              isDarkMode
                ? "bg-neutral-950/90 border-neutral-800/80 text-neutral-400 shadow-black/90"
                : "bg-white/90 border-neutral-200/80 text-neutral-600 shadow-neutral-400/30"
            }`
      }`}
    >
      {/* Animated Sliding Background Pill Indicator */}
      <div
        style={{
          transform: `translateX(${pillStyle.left}px)`,
          width: `${pillStyle.width}px`,
          opacity: pillStyle.opacity,
        }}
        className={`absolute left-0 ${
          variant === "header" ? "top-1 bottom-1 rounded-lg" : "top-1.5 bottom-1.5 rounded-full"
        } transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-md pointer-events-none ${
          isDarkMode ? "bg-white" : "bg-black"
        }`}
      />

      {/* Tab Buttons */}
      {tabs.map((tab) => {
        const isActive = effectiveActiveView === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            onClick={() => onSelectView(tab.id)}
            title={tab.label}
            aria-label={tab.label}
            className={`relative z-10 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer focus:outline-none active:scale-95 ${
              variant === "header"
                ? "px-3 py-1.5 rounded-lg text-xs font-semibold"
                : "flex-1 py-2 px-3 rounded-full text-xs font-semibold h-9"
            } ${
              isActive
                ? isDarkMode
                  ? "text-black font-bold"
                  : "text-white font-bold"
                : isDarkMode
                ? "text-neutral-400 hover:text-white"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            <Icon
              className={`${variant === "header" ? "w-4 h-4" : "w-5 h-5"} shrink-0 transition-colors ${
                isActive
                  ? isDarkMode
                    ? tab.id === "visualizer"
                      ? "fill-black text-black"
                      : "text-black"
                    : tab.id === "visualizer"
                    ? "fill-white text-white"
                    : "text-white"
                  : ""
              }`}
            />
            {variant === "header" && (
              <span className="whitespace-nowrap">{tab.label}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
