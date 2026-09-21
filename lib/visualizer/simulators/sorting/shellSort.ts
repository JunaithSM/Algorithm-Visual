import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const shellSortSimulator: AlgorithmSimulator = {
  id: "ShellSort",
  category: "Sorting",
  generateSteps(inputArray, _target, code, startLineNumber) {
    const steps: Step[] = [];
    let stepCount = 1;
    const nums = [...inputArray];
    const n = nums.length;

    if (startLineNumber && startLineNumber > 0) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: startLineNumber,
        description: `Driver Call: Starting shellSort on array [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { n },
      });
    }

    const lineHeader = findLineNumber(code, /(?:shellSort|shell_sort|ShellSort|sortArray)/i, 1);
    const lineGapLoop = findLineNumber(code, /for\s*\(?.*gap/i, 2, lineHeader);
    const lineOuterLoop = findLineNumber(code, /for\s*\(?.*i\s*=/i, 3, lineGapLoop);
    const lineKeyPick = findLineNumber(code, /(?:temp|key)\s*=/i, 4, lineOuterLoop);
    const lineShiftLoop = findLineNumber(code, /(?:while|for)\s*\(?.*j/i, 5, lineKeyPick);
    const lineShift = findLineNumber(code, /\[j\]\s*=\s*\[j\s*-\s*gap\]/i, 6, lineShiftLoop);
    const lineInsert = findLineNumber(code, /\[j\]\s*=\s*(?:temp|key)/i, 7, lineShift);
    const lineReturn = findLineNumber(code, /return/i, 9);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function shellSort(nums) with ${n} elements.`,
      array: [...nums],
      activeIndices: [],
      subArrayRange: [0, n - 1],
      status: "idle",
      vars: { n },
    });

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineGapLoop,
        description: `Reducing gap size: gap = ${gap}. Performing gapped insertion sort.`,
        array: [...nums],
        activeIndices: [],
        subArrayRange: [0, n - 1],
        status: "idle",
        vars: { gap, n },
      });

      for (let i = gap; i < n; i++) {
        const temp = nums[i];
        let j = i;

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineKeyPick > 0 ? lineKeyPick : lineOuterLoop,
          description: `Selected element nums[${i}] (${temp}) for gap-${gap} insertion sort.`,
          array: [...nums],
          activeIndices: [i],
          subArrayRange: [0, i],
          subArrayRanges: [
            { range: [0, i], label: `Gap-${gap} Sub-Array`, color: "cyan" }
          ],
          status: "shifting",
          vars: { gap, i, j },
        });

        while (j >= gap && nums[j - gap] > temp) {
          steps.push({
            stepNumber: stepCount++,
            lineNumber: lineShiftLoop > 0 ? lineShiftLoop : lineKeyPick,
            description: `Comparing nums[${j - gap}] (${nums[j - gap]}) > temp (${temp}) across gap of ${gap}.`,
            array: [...nums],
            activeIndices: [j - gap, j],
            subArrayRange: [j - gap, j],
            subArrayRanges: [
              { range: [j - gap, j], label: `Gap-${gap} Span`, color: "cyan" }
            ],
            status: "comparing",
            vars: { gap, i, j },
          });

          nums[j] = nums[j - gap];

          steps.push({
            stepNumber: stepCount++,
            lineNumber: lineShift > 0 ? lineShift : lineShiftLoop,
            description: `Shifting element ${nums[j]} rightwards by gap ${gap} to index ${j}.`,
            array: [...nums],
            activeIndices: [j],
            subArrayRange: [j - gap, j],
            subArrayRanges: [
              { range: [j - gap, j], label: `Gap-${gap} Span`, color: "cyan" }
            ],
            status: "shifting",
            vars: { gap, i, j },
          });

          j -= gap;
        }

        nums[j] = temp;

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineInsert > 0 ? lineInsert : lineOuterLoop,
          description: `Placed temp element ${temp} into gap position at index ${j}. Array state: [${nums.join(", ")}].`,
          array: [...nums],
          activeIndices: [j],
          subArrayRange: [0, i],
          subArrayRanges: [
            { range: [0, i], label: `Gap-${gap} Sub-Array`, color: "cyan" }
          ],
          status: "swapping",
          vars: { gap, i, j },
        });
      }
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturn,
      description: `Shell sort complete! Final sorted array: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [],
      status: "sorted",
      vars: { n },
    });

    return steps;
  },
};
