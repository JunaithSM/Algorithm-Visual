/**
 * Core types for the modular algorithm simulator system.
 * This file is the leaf of the dependency graph — no circular imports.
 */

export type StepStatus =
  | "idle"
  | "comparing"
  | "swapping"
  | "found"
  | "not_found"
  | "sorted"
  | "merging"
  | "pivoting"
  | "shifting"
  | "counting"
  | "bucketing";

export interface SubArrayRange {
  range: [number, number];
  label: string;
  color?: "cyan" | "purple" | "amber" | "emerald" | "blue" | "rose";
}

export interface Step {
  stepNumber: number;
  lineNumber: number;
  description: string;
  array: number[];
  activeIndices: number[];
  foundIndex?: number;
  subArrayRange?: [number, number];
  subArrayRanges?: SubArrayRange[];
  status: StepStatus;
  vars: Record<string, string | number>;
}

export interface AlgorithmSimulator {
  id: string;
  category: "Searching" | "Sorting";
  generateSteps(
    inputArray: number[],
    target: number,
    code?: string,
    startLineNumber?: number,
    isLineByLine?: boolean
  ): Step[];
}
