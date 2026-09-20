"use client";

import React from "react";
import {
  BookOpen,
  Code2,
  Play,
  Columns2,
  FileText,
  ArrowRight,
} from "lucide-react";
import { getAlgorithmTheory } from "@/lib/algorithms/theoryData";

export interface DescriptionPanelProps {
  algorithmId: string;
  isDarkMode: boolean;
  onSelectView?: (view: "split" | "code" | "visualizer" | "description") => void;
  activeView?: "split" | "code" | "visualizer" | "description";
}

export const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
  algorithmId,
  isDarkMode,
  onSelectView,
  activeView = "description",
}) => {
  const theory = getAlgorithmTheory(algorithmId);

  return (
    <div
      className={`flex flex-col h-full border rounded-lg overflow-hidden transition-colors font-sans relative ${
        isDarkMode
          ? "border-neutral-800 bg-neutral-950 text-neutral-100"
          : "border-neutral-200 bg-white text-neutral-900"
      }`}
    >
      {/* Top Header Bar */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b text-xs font-medium z-10 shrink-0 ${
          isDarkMode
            ? "border-neutral-800 bg-neutral-950 text-neutral-300"
            : "border-neutral-200 bg-neutral-50 text-neutral-700"
        }`}
      >
        {/* Left Title */}
        <div className="flex items-center gap-2 font-semibold">
          <BookOpen className="w-4 h-4 opacity-70" />
          <span className="text-xs tracking-tight uppercase font-mono">{theory.name} Theory</span>
        </div>

      </div>

      {/* Editorial Standard Reading View Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 font-sans">
        <article className="max-w-3xl mx-auto space-y-10 selection:bg-neutral-800 selection:text-white">
          {/* Article Header & Lead */}
          <header className="space-y-4 border-b pb-6 border-neutral-800/60">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded border ${
                  isDarkMode
                    ? "border-neutral-800 bg-neutral-900 text-neutral-400"
                    : "border-neutral-200 bg-neutral-100 text-neutral-600"
                }`}
              >
                {theory.category} Algorithm
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              {theory.name}
            </h1>

            <p className="text-base text-neutral-400 leading-relaxed font-normal">
              {theory.summary}
            </p>
          </header>

          {/* Real-World Analogy Blockquote */}
          <section>
            <blockquote
              className={`border-l-2 pl-4 py-1.5 my-2 text-sm leading-relaxed italic ${
                isDarkMode
                  ? "border-neutral-500 text-neutral-300"
                  : "border-neutral-400 text-neutral-700"
              }`}
            >
              <span className="font-semibold not-italic block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Intuition & Real-World Analogy
              </span>
              "{theory.realWorldAnalogy}"
            </blockquote>
          </section>

          {/* Core Concept Strategy */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 border-b pb-2 border-neutral-800/40">
              Core Strategy
            </h2>
            <p className="text-sm leading-relaxed text-neutral-300">
              {theory.coreIntuition}
            </p>
          </section>

          {/* Step-by-Step Execution Procedure */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 border-b pb-2 border-neutral-800/40">
              How It Works: Step-by-Step Logic
            </h2>

            <ol className="space-y-3 text-sm leading-relaxed">
              {theory.stepByStepLogic.map((stepText, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-neutral-400 mt-0.5 font-bold shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="text-neutral-200">{stepText}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Concrete Dry-Run Example */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 border-neutral-800/40">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                Step-by-Step Dry Run Example
              </h2>
              <span className="font-mono text-xs text-neutral-400">
                Input: {theory.example.initialInput}
                {theory.example.target && ` | Target: ${theory.example.target}`}
              </span>
            </div>

            <p className="text-xs text-neutral-400">
              {theory.example.title}
            </p>

            <div className="space-y-3">
              {theory.example.steps.map((s) => (
                <div
                  key={s.stepNumber}
                  className={`p-4 rounded-md border text-xs space-y-2 ${
                    isDarkMode
                      ? "bg-neutral-900/40 border-neutral-800"
                      : "bg-neutral-50 border-neutral-200"
                  }`}
                >
                  <div className="font-semibold text-neutral-200 text-xs">
                    Step {s.stepNumber}: {s.title}
                  </div>
                  <p className="text-neutral-400 leading-relaxed">{s.description}</p>
                  {s.visualState && (
                    <div
                      className={`p-2 rounded font-mono text-[11px] border ${
                        isDarkMode
                          ? "bg-black/60 border-neutral-800 text-neutral-300"
                          : "bg-white border-neutral-300 text-neutral-800"
                      }`}
                    >
                      {s.visualState}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              className={`p-3 rounded border text-xs font-mono ${
                isDarkMode
                  ? "bg-neutral-900/60 border-neutral-800 text-neutral-300"
                  : "bg-neutral-100 border-neutral-300 text-neutral-800"
              }`}
            >
              Result: {theory.example.conclusion}
            </div>
          </section>

          {/* Time & Space Complexity Table */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 border-b pb-2 border-neutral-800/40">
              Complexity Analysis & Properties
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr
                    className={`border-b text-neutral-400 font-mono text-[11px] uppercase ${
                      isDarkMode ? "border-neutral-800" : "border-neutral-200"
                    }`}
                  >
                    <th className="py-2.5 px-3 font-semibold">Metric / Property</th>
                    <th className="py-2.5 px-3 font-semibold">Value</th>
                    <th className="py-2.5 px-3 font-semibold">Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/40">
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-medium text-neutral-300">Best Time Complexity</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-100">{theory.complexity.bestTime}</td>
                    <td className="py-2.5 px-3 text-neutral-400">Best-case input scenario bounds</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-medium text-neutral-300">Average Time Complexity</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-100">{theory.complexity.averageTime}</td>
                    <td className="py-2.5 px-3 text-neutral-400">Expected runtime across typical inputs</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-medium text-neutral-300">Worst Time Complexity</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-100">{theory.complexity.worstTime}</td>
                    <td className="py-2.5 px-3 text-neutral-400">Upper limit runtime bound</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-medium text-neutral-300">Auxiliary Space</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-100">{theory.complexity.spaceComplexity}</td>
                    <td className="py-2.5 px-3 text-neutral-400">Additional memory required</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-medium text-neutral-300">Stability</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-100">{theory.complexity.stable ? "Stable" : "Unstable"}</td>
                    <td className="py-2.5 px-3 text-neutral-400">Preserves relative ordering of equal elements</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-medium text-neutral-300">In-Place</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-100">{theory.complexity.inPlace ? "Yes" : "No"}</td>
                    <td className="py-2.5 px-3 text-neutral-400">Modifies input memory directly</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Advantages & Trade-offs */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Pros */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b pb-1.5 border-neutral-800/40">
                Advantages
              </h3>
              <ul className="space-y-2 text-xs text-neutral-300">
                {theory.pros.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-neutral-500 font-bold">•</span>
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b pb-1.5 border-neutral-800/40">
                Trade-offs
              </h3>
              <ul className="space-y-2 text-xs text-neutral-300">
                {theory.cons.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-neutral-500 font-bold">•</span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Practical Applications */}
          <section className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b pb-1.5 border-neutral-800/40">
              Applications
            </h3>
            <div className="flex flex-wrap gap-2">
              {theory.applications.map((app, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded text-xs font-medium border ${
                    isDarkMode
                      ? "border-neutral-800 bg-neutral-900 text-neutral-300"
                      : "border-neutral-200 bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {app}
                </span>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};
