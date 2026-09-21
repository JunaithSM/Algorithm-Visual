import { ALL_ALGORITHMS, getAlgorithmCode } from "./lib/algorithms";
import { generateSteps } from "./lib/visualizer/simulator";

const LANGUAGES = ["typescript", "javascript", "python", "java", "cpp", "c", "csharp", "go"];

console.log("======================================================================");
console.log("DIAGNOSTIC: LINE HIGHLIGHT MATCHING ACROSS ALGORITHMS & LANGUAGES");
console.log("======================================================================\n");

let totalTested = 0;
let totalFailed = 0;

for (const algo of ALL_ALGORITHMS) {
  console.log(`\n📌 ${algo.name} (${algo.id}) [Category: ${algo.category}]:`);

  for (const lang of LANGUAGES) {
    const code = getAlgorithmCode(algo.id, lang);
    const lines = code.split("\n");
    const target = 9;
    const testArr = [9, 2, 10, 5, 1, 4, 8];

    try {
      const steps = generateSteps(algo.id, testArr, target, code, 1, false);

      let matchedLinesCount = 0;
      const invalidLines: number[] = [];
      const lineSummary: { lineNum: number; content: string; desc: string }[] = [];

      for (const s of steps) {
        if (s.lineNumber > 0 && s.lineNumber <= lines.length) {
          matchedLinesCount++;
          const content = (lines[s.lineNumber - 1] || "").trim();
          if (lineSummary.length < 5) {
            lineSummary.push({ lineNum: s.lineNumber, content, desc: s.description });
          }
        } else if (s.lineNumber > 0) {
          invalidLines.push(s.lineNumber);
        }
      }

      totalTested++;
      if (invalidLines.length > 0 || matchedLinesCount === 0) {
        totalFailed++;
        console.log(`  ❌ Lang: ${lang.padEnd(10)} | Steps: ${steps.length} | Matched: ${matchedLinesCount}/${steps.length} | Invalid Lines: [${invalidLines.join(", ")}]`);
      } else {
        const uniqueLineNums = new Set(steps.map(s => s.lineNumber));
        console.log(`  ✅ Lang: ${lang.padEnd(10)} | Steps: ${steps.length} | Unique Lines Highlighted: [${[...uniqueLineNums].sort((a,b)=>a-b).join(", ")}] (of ${lines.length} lines)`);
      }
    } catch (e: any) {
      totalFailed++;
      console.error(`  ❌ Lang: ${lang.padEnd(10)} | ERROR: ${e.message}`);
    }
  }
}

console.log("\n======================================================================");
console.log(`TOTAL TESTED: ${totalTested} | PASSED: ${totalTested - totalFailed} | FAILED: ${totalFailed}`);
console.log("======================================================================");
