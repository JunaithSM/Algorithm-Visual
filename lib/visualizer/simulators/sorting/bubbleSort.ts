import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const bubbleSortSimulator: AlgorithmSimulator = {
  id: "BubbleSort",
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
        description: `Driver Call: Starting bubbleSort on array [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { n },
      });
    }

    const lineHeader = findLineNumber(code, /(?:bubbleSort|bubble_sort|BubbleSort|sortArray)/i, 1);
    const lineOuterLoop = findLineNumber(code, /for\s*\(?.*i\s*=/i, 2, lineHeader);
    const lineInnerLoop = findLineNumber(code, /for\s*\(?.*j\s*=/i, 3, lineOuterLoop);
    const lineCompare = findLineNumber(code, /if\s*\(?.*(?:>|<|swap)/i, 4, lineInnerLoop);
    const lineSwap = findLineNumber(code, /(?:\bswap\b|swapAt|\.swap|temp|\b[a-zA-Z0-9_\$]+\s*,\s*[a-zA-Z0-9_\$]+\s*=|\[.*\]\s*=|@\$\w+|\^=)/i, 5, lineCompare);
    const lineReturnSorted = findLineNumber(code, /return/i, 6);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function bubbleSort(nums) with ${n} elements.`,
      array: [...nums],
      activeIndices: [],
      subArrayRange: [0, n - 1],
      status: "idle",
      vars: { n },
    });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      const unsortedRange: [number, number] = [0, n - i - 1];
      const subRanges: SubArrayRange[] = [
        { range: [0, n - i - 1], label: "Unsorted Sweep", color: "cyan" },
        ...(i > 0 ? [{ range: [n - i, n - 1] as [number, number], label: "Sorted Portion", color: "emerald" as const }] : [])
      ];

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineOuterLoop,
        description: `Outer loop pass i = ${i + 1} of ${n - 1}. Bubbling largest unsorted element to end.`,
        array: [...nums],
        activeIndices: [],
        subArrayRange: unsortedRange,
        subArrayRanges: subRanges,
        status: "idle",
        vars: { i, n },
      });

      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineInnerLoop,
          description: `Inner loop j = ${j}: Comparing adjacent elements nums[${j}] (${nums[j]}) and nums[${j + 1}] (${nums[j + 1]}).`,
          array: [...nums],
          activeIndices: [j, j + 1],
          subArrayRange: unsortedRange,
          subArrayRanges: subRanges,
          status: "comparing",
          vars: { i, j },
        });

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineCompare > 0 ? lineCompare : lineInnerLoop,
          description: `Evaluating if nums[${j}] (${nums[j]}) > nums[${j + 1}] (${nums[j + 1]})?`,
          array: [...nums],
          activeIndices: [j, j + 1],
          subArrayRange: unsortedRange,
          subArrayRanges: subRanges,
          status: "comparing",
          vars: { i, j },
        });

        if (nums[j] > nums[j + 1]) {
          [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
          swapped = true;

          steps.push({
            stepNumber: stepCount++,
            lineNumber: lineSwap > 0 ? lineSwap : lineCompare,
            description: `Swapped out-of-order elements: nums[${j}] and nums[${j + 1}]. Array is now [${nums.join(", ")}].`,
            array: [...nums],
            activeIndices: [j, j + 1],
            subArrayRange: unsortedRange,
            subArrayRanges: subRanges,
            status: "swapping",
            vars: { i, j },
          });
        }
      }

      if (!swapped) break;
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturnSorted,
      description: `Bubble sort complete! Array is fully sorted: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [],
      status: "sorted",
      vars: { n },
    });

    return steps;
  },
};
