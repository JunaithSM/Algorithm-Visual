import { ALL_ALGORITHMS, getAlgorithmCode } from "./lib/algorithms";
import { generateSteps } from "./lib/visualizer/simulator";

for (const algo of ALL_ALGORITHMS) {
  const code = getAlgorithmCode(algo.id, "typescript");
  const steps = generateSteps(algo.id, [5, 2, 8, 1, 9], 8, code, 1, false);

  console.log(`\n=== ${algo.name} (${algo.id}) ===`);
  const lines = code.split("\n");
  steps.slice(0, 10).forEach(s => {
    const lineContent = (lines[s.lineNumber - 1] || "OUT OF BOUNDS").trim();
    console.log(`Step ${s.stepNumber} [Line ${s.lineNumber}]: "${lineContent}" -> ${s.description.slice(0, 60)}`);
  });
  if (steps.length > 10) {
    console.log(`... (${steps.length - 10} more steps)`);
  }
}
