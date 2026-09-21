import { ALL_ALGORITHMS, getAlgorithmCode } from "./lib/algorithms";
import { generateSteps } from "./lib/visualizer/simulator";

const algo = ALL_ALGORITHMS.find(a => a.id === "MergeSort")!;
const code = getAlgorithmCode(algo.id, "typescript");
const steps = generateSteps(algo.id, [5, 2, 8, 1, 9], 8, code, 1, false);

console.log(`\n=== Code Lines for MergeSort TypeScript ===`);
code.split("\n").forEach((l, i) => console.log(`${(i + 1).toString().padStart(2)}: ${l}`));

console.log(`\n=== Generated Steps for MergeSort ===`);
steps.forEach(s => {
  const lineContent = (code.split("\n")[s.lineNumber - 1] || "OUT OF BOUNDS").trim();
  console.log(`Step ${s.stepNumber.toString().padStart(2)} [Line ${s.lineNumber.toString().padStart(2)}]: "${lineContent.padEnd(35)}" -> ${s.description}`);
});
