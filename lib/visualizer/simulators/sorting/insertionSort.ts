import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const insertionSortSimulator: AlgorithmSimulator = {
  id: "InsertionSort",
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
        description: `Driver Call: Starting insertionSort on array [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { n },
      });
    }

    const lineHeader = findLineNumber(code, /(?:insertionSort|insertion_sort|InsertionSort|sortArray)/i, 1);
    const lineOuterLoop = findLineNumber(code, /for\s*\(?.*i\s*=/i, 2, lineHeader);
    const lineKeyPick = findLineNumber(code, /(?:key|val|current|temp)\s*=/i, 3, lineOuterLoop);
    const lineShiftLoop = findLineNumber(code, /(?:while|for)\s*\(?.*j\s*>(?:=)?|while\s*\(?.*key/i, 4, lineKeyPick);
    const lineShift = findLineNumber(code, /(?:\[j(?:\s*\+\s*1)?\]\s*=\s*\[|swap)/i, 5, lineShiftLoop);
    const lineInsert = findLineNumber(code, /\[j(?:\s*\+\s*1)?\]\s*=/i, 6, lineShift);
    const lineReturn = findLineNumber(code, /return/i, 8);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function insertionSort(nums) with ${n} elements.`,
      array: [...nums],
      activeIndices: [],
      subArrayRange: [0, n - 1],
      status: "idle",
      vars: { n },
    });

    for (let i = 1; i < n; i++) {
      const key = nums[i];
      let j = i - 1;
      const sortedPrefixRange: [number, number] = [0, i];
      const subRanges: SubArrayRange[] = [
        { range: [0, i - 1], label: "Sorted Prefix", color: "emerald" },
        { range: [i, i], label: "Key Element", color: "amber" }
      ];

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineOuterLoop,
        description: `Pass i = ${i}: Preparing to insert key element nums[${i}] (${key}) into sorted prefix [0 .. ${i - 1}].`,
        array: [...nums],
        activeIndices: [i],
        subArrayRange: sortedPrefixRange,
        subArrayRanges: subRanges,
        status: "idle",
        vars: { i, key, n },
      });

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineKeyPick > 0 ? lineKeyPick : lineOuterLoop,
        description: `Selected key = ${key} from index ${i}.`,
        array: [...nums],
        activeIndices: [i],
        subArrayRange: sortedPrefixRange,
        subArrayRanges: subRanges,
        status: "idle",
        vars: { i, key, j },
      });

      while (j >= 0 && nums[j] > key) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineShiftLoop > 0 ? lineShiftLoop : lineKeyPick,
          description: `Comparing key (${key}) with nums[${j}] (${nums[j]}): ${nums[j]} > ${key} is true.`,
          array: [...nums],
          activeIndices: [j, j + 1],
          subArrayRange: sortedPrefixRange,
          subArrayRanges: subRanges,
          status: "comparing",
          vars: { i, key, j },
        });

        nums[j + 1] = nums[j];

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineShift > 0 ? lineShift : lineShiftLoop,
          description: `Shifting element ${nums[j]} rightwards to index ${j + 1}.`,
          array: [...nums],
          activeIndices: [j + 1],
          subArrayRange: sortedPrefixRange,
          subArrayRanges: subRanges,
          status: "shifting",
          vars: { i, key, j },
        });

        j--;
      }

      if (j >= 0) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineShiftLoop > 0 ? lineShiftLoop : lineKeyPick,
          description: `Comparing key (${key}) with nums[${j}] (${nums[j]}): ${nums[j]} <= ${key}. Insertion position found at index ${j + 1}.`,
          array: [...nums],
          activeIndices: [j],
          subArrayRange: sortedPrefixRange,
          subArrayRanges: subRanges,
          status: "comparing",
          vars: { i, key, j },
        });
      }

      nums[j + 1] = key;

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineInsert > 0 ? lineInsert : lineOuterLoop,
        description: `Inserted key ${key} into position at index ${j + 1}. Array state is now [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [j + 1],
        subArrayRange: sortedPrefixRange,
        status: "swapping",
        vars: { i, key, insertedAt: j + 1 },
      });
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturn,
      description: `Insertion sort complete! Final sorted array: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [],
      status: "sorted",
      vars: { n },
    });

    return steps;
  },
};
