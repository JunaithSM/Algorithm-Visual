import { AlgorithmSimulator } from "./types";

const simulatorRegistry = new Map<string, AlgorithmSimulator>();

export function registerSimulator(simulator: AlgorithmSimulator): void {
  const key = simulator.id.toLowerCase().trim();
  simulatorRegistry.set(key, simulator);
}

export function getSimulator(algoId: string): AlgorithmSimulator | undefined {
  const key = algoId.toLowerCase().trim();
  return simulatorRegistry.get(key);
}

export function getAllSimulators(): AlgorithmSimulator[] {
  return Array.from(simulatorRegistry.values());
}
