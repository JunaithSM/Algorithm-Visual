"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, Code2, Play, Columns2, FileText } from "lucide-react";
import { CodeArea } from "@/components/CodeArea";
import {
  AlgorithmCategory,
  SEARCHING_ALGORITHMS,
  SORTING_ALGORITHMS,
  getAlgorithmById,
  getAlgorithmCode,
} from "@/lib/algorithms";

import { VisualizerPanel } from "@/components/VisualizerPanel";
import { DescriptionPanel } from "@/components/DescriptionPanel";
import { Step } from "@/lib/visualizer/simulator";
import { WorkspaceNavTabs } from "@/components/WorkspaceNavTabs";

export default function AlgorithmPage({
  params,
}: {
  params: Promise<{ category: string; algorithm: string }>;
}) {
  const resolvedParams = use(params);

  const category = (resolvedParams.category || "Searching") as AlgorithmCategory;
  const algorithmId = resolvedParams.algorithm || "LinearSearch";

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("c");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [fontSize, setFontSize] = useState<number>(14);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);

  // Active Workspace Panel View State: 'split' | 'code' | 'visualizer' | 'description'
  const [activeView, setActiveView] = useState<"split" | "code" | "visualizer" | "description">("split");

  // Resizable Split Workspace State
  const [splitRatio, setSplitRatio] = useState<number>(50); // percentage for left code area (20% to 80%)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Dragging event listeners for workspace split resizing
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const clamped = Math.max(20, Math.min(80, percentage));
      setSplitRatio(clamped);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Get matching algorithm object
  const currentAlgorithm = getAlgorithmById(algorithmId);

  // Code state
  const [code, setCode] = useState<string>(() =>
    getAlgorithmCode(algorithmId, "c")
  );

  // Update code content whenever algorithm route or language changes
  useEffect(() => {
    const newCode = getAlgorithmCode(algorithmId, selectedLanguage);
    setCode(newCode);
  }, [algorithmId, selectedLanguage]);

  const isDarkMode =
    theme.includes("dark") || theme === "hc-black" || theme === "dracula" || theme === "one-dark";

  const fontSizes = Array.from(
    new Set([10, 12, 14, 16, 18, 20, 24, 28, 32, fontSize])
  ).sort((a, b) => a - b);

  return (
    <main
      className={`flex flex-col h-screen font-sans transition-colors duration-200 relative overflow-hidden ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Global Transparent Overlay during dragging to prevent iframe/monaco mouse capture */}
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
      )}

      {/* Header Bar */}
      <header
        className={`flex items-center justify-between px-4 py-2.5 border-b text-xs font-sans font-medium z-10 ${
          isDarkMode
            ? "border-neutral-800 bg-black text-neutral-300"
            : "border-neutral-200 bg-white text-neutral-700"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Open Content Tab"
            className={`p-1.5 rounded-md border transition cursor-pointer flex items-center justify-center ${
              isDarkMode
                ? "bg-neutral-900 border-neutral-800 text-neutral-200 hover:text-white hover:border-neutral-700"
                : "bg-neutral-100 border-neutral-300 text-neutral-700 hover:text-black hover:border-neutral-400"
            }`}
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Current Route Breadcrumb */}
          <div className="flex items-center gap-1.5 font-sans text-xs">
            <span className="text-neutral-500">/</span>
            <span className="text-neutral-400 font-semibold">{category}</span>
            <span className="text-neutral-500">/</span>
            <span className="font-semibold text-sky-400">{currentAlgorithm.name}</span>
          </div>
        </div>

        {/* Desktop Navigation Tabs in Header (Icon + Name with Animated Background Pill) */}
        <div className="hidden lg:flex items-center">
          <WorkspaceNavTabs
            activeView={activeView}
            onSelectView={(v) => setActiveView(v)}
            isDarkMode={isDarkMode}
            variant="header"
          />
        </div>
      </header>

      {/* Main Workspace Area Container (Smooth Fade Transition) */}
      <div
        key={activeView}
        className="flex-1 p-2 overflow-hidden min-h-0 pb-20 lg:pb-2 animate-in fade-in-50 duration-300 ease-out"
      >
        {activeView === "description" ? (
          <DescriptionPanel
            algorithmId={algorithmId}
            isDarkMode={isDarkMode}
            onSelectView={(v) => setActiveView(v)}
            activeView={activeView}
          />
        ) : activeView === "code" ? (
          <CodeArea
            value={code}
            language={selectedLanguage}
            onLanguageChange={(lang) => setSelectedLanguage(lang)}
            theme={theme}
            onThemeChange={(t) => setTheme(t)}
            fontSize={fontSize}
            highlightedLine={currentStep?.lineNumber}
            onChange={(val) => setCode(val || "")}
            onFontSizeChange={(newSize) => setFontSize(newSize)}
            className={isDarkMode ? "border-neutral-800" : "border-neutral-200"}
            onSelectView={(v) => setActiveView(v)}
            activeView={activeView}
          />
        ) : activeView === "visualizer" ? (
          <VisualizerPanel
            algorithmId={algorithmId}
            category={category}
            isDarkMode={isDarkMode}
            code={code}
            onStepChange={(step) => setCurrentStep(step)}
            onSelectView={(v) => setActiveView(v)}
            activeView={activeView}
          />
        ) : (
          /* Split View Mode (Desktop Split View, Single Visualizer View on Mobile) */
          <>
            {/* Mobile View: Render Visualizer Full Screen */}
            <div className="block lg:hidden h-full w-full">
              <VisualizerPanel
                algorithmId={algorithmId}
                category={category}
                isDarkMode={isDarkMode}
                code={code}
                onStepChange={(step) => setCurrentStep(step)}
                onSelectView={(v) => setActiveView(v)}
                activeView={activeView}
              />
            </div>

            {/* Desktop View: Resizable Split Panel View */}
            <div
              ref={containerRef}
              className={`hidden lg:flex h-full flex-row gap-0 overflow-hidden ${
                isDragging ? "select-none" : ""
              }`}
            >
              {/* Left Side: Code Editor Area */}
              <div
                className="h-full min-h-87.5 flex flex-col overflow-hidden w-full lg:w-(--split-width) shrink-0"
                style={{ "--split-width": `${splitRatio}%` } as React.CSSProperties}
              >
                <CodeArea
                  value={code}
                  language={selectedLanguage}
                  onLanguageChange={(lang) => setSelectedLanguage(lang)}
                  theme={theme}
                  onThemeChange={(t) => setTheme(t)}
                  fontSize={fontSize}
                  highlightedLine={currentStep?.lineNumber}
                  onChange={(val) => setCode(val || "")}
                  onFontSizeChange={(newSize) => setFontSize(newSize)}
                  className={isDarkMode ? "border-neutral-800" : "border-neutral-200"}
                  onSelectView={(v) => setActiveView(v)}
                  activeView={activeView}
                />
              </div>

              {/* Resizable Vertical Divider Handle Bar (Desktop) */}
              <div
                onMouseDown={() => setIsDragging(true)}
                title="Drag to resize code and visualizer panels"
                className={`hidden lg:flex w-3 items-center justify-center cursor-col-resize group z-20 select-none transition-colors shrink-0 ${
                  isDragging
                    ? "bg-sky-500/20"
                    : isDarkMode
                    ? "hover:bg-neutral-800"
                    : "hover:bg-neutral-200"
                }`}
              >
                <div
                  className={`w-1 h-8 rounded-full transition-colors ${
                    isDragging
                      ? "bg-sky-400"
                      : isDarkMode
                      ? "bg-neutral-700 group-hover:bg-sky-400"
                      : "bg-neutral-400 group-hover:bg-sky-500"
                  }`}
                />
              </div>

              {/* Right Side: Execution Visualizer Animation Panel */}
              <div className="h-full min-h-87.5 flex flex-col overflow-hidden flex-1 min-w-0 w-full">
                <VisualizerPanel
                  algorithmId={algorithmId}
                  category={category}
                  isDarkMode={isDarkMode}
                  code={code}
                  onStepChange={(step) => setCurrentStep(step)}
                  onSelectView={(v) => setActiveView(v)}
                  activeView={activeView}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Bottom Navigation Tab Bar (Mobile Only - Animated Background Pill) */}
      <div className="flex lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xs sm:max-w-sm justify-center">
        <WorkspaceNavTabs
          activeView={activeView}
          onSelectView={(v) => setActiveView(v)}
          isDarkMode={isDarkMode}
          variant="mobile"
        />
      </div>

      {/* Content Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Content Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 z-50 flex flex-col border-r transition-transform duration-300 ease-in-out shadow-2xl ${
          isDarkMode
            ? "bg-neutral-950 border-neutral-800 text-white"
            : "bg-white border-neutral-200 text-black"
        } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? "border-neutral-800" : "border-neutral-200"
        }`}>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-neutral-400" />
            <h2 className="font-semibold text-sm tracking-tight">Content Navigation</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`p-1.5 rounded-md hover:bg-neutral-800/50 transition cursor-pointer ${
              isDarkMode ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* SEARCHING SECTION */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 px-2">
              Searching Algorithms
            </h3>
            <ul className="space-y-1">
              {SEARCHING_ALGORITHMS.map((algo) => {
                const isActive = category === "Searching" && algorithmId === algo.id;
                return (
                  <li key={algo.id}>
                    <Link
                      href={`/Searching/${algo.id}`}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                        isActive
                          ? isDarkMode
                            ? "bg-neutral-800 text-white font-semibold"
                            : "bg-neutral-200 text-black font-semibold"
                          : isDarkMode
                          ? "text-neutral-400 hover:text-white hover:bg-neutral-900"
                          : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                      }`}
                    >
                      <span>{algo.name}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-400" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* SORTING SECTION */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 px-2">
              Sorting Algorithms
            </h3>
            <ul className="space-y-1">
              {SORTING_ALGORITHMS.map((algo) => {
                const isActive = category === "Sorting" && algorithmId === algo.id;
                return (
                  <li key={algo.id}>
                    <Link
                      href={`/Sorting/${algo.id}`}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                        isActive
                          ? isDarkMode
                            ? "bg-neutral-800 text-white font-semibold"
                            : "bg-neutral-200 text-black font-semibold"
                          : isDarkMode
                          ? "text-neutral-400 hover:text-white hover:bg-neutral-900"
                          : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                      }`}
                    >
                      <span>{algo.name}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-400" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>
    </main>
  );
}
