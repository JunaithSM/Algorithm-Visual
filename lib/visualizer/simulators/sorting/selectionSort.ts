import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const selectionSortSimulator: AlgorithmSimulator = {
  id: "SelectionSort",
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
        description: `Driver Call: Starting selectionSort on array [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { n },
      });
    }

    const lineHeader = findLineNumber(code, /(?:selectionSort|selection_sort|SelectionSort|sortArray)/i, 1);
    const lineOuterLoop = findLineNumber(code, /for\s*\(?.*i\s*=/i, 2, lineHeader);
    const lineMinInit = findLineNumber(code, /(?:minIdx|min_idx|minIndex|min)\s*=\s*/i, 3, lineOuterLoop);
    const lineInnerLoop = findLineNumber(code, /for\s*\(?.*j\s*=/i, 4, lineMinInit);
    const lineCompare = findLineNumber(code, /if\s*\(?.*(?:<|>|min)/i, 5, lineInnerLoop);
    const lineMinUpdate = findLineNumber(code, /(?:minIdx|min_idx|minIndex|min)\s*=\s*j/i, 6, lineCompare);
    const lineSwap = findLineNumber(code, /(?:\bswap\b|swapAt|\.swap|temp|\b[a-zA-Z0-9_\$]+\s*,\s*[a-zA-Z0-9_\$]+\s*=|\[.*\]\s*=|@\$\w+|\^=)/i, 7, lineMinUpdate);
    const lineReturn = findLineNumber(code, /return/i, 9);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function selectionSort(nums) with ${n} elements.`,
      array: [...nums],
      activeIndices: [],
      subArrayRange: [0, n - 1],
      status: "idle",
      vars: { n },
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      const unsortedRange: [number, number] = [i, n - 1];

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineOuterLoop,
        description: `Pass i = ${i}: Searching for minimum element in unsorted region [index ${i} to ${n - 1}].`,
        array: [...nums],
        activeIndices: [i],
        subArrayRange: unsortedRange,
        subArrayRanges: [
          { range: [0, Math.max(0, i - 1)], label: "Sorted Portion", color: "emerald" },
          { range: [i, n - 1], label: "Unsorted Region", color: "cyan" }
        ],
        status: "idle",
        vars: { i, minIdx: i, n },
      });

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMinInit > 0 ? lineMinInit : lineOuterLoop,
        description: `Initializing minIdx = ${i} (value nums[${i}] = ${nums[i]}).`,
        array: [...nums],
        activeIndices: [i],
        subArrayRange: unsortedRange,
        subArrayRanges: [
          { range: [i, n - 1], label: "Unsorted Region", color: "cyan" },
          { range: [i, i], label: "Min Probe", color: "amber" }
        ],
        status: "idle",
        vars: { i, minIdx: i },
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineInnerLoop > 0 ? lineInnerLoop : lineMinInit,
          description: `Scanning index j = ${j}: Comparing current element nums[${j}] (${nums[j]}) with current min nums[${minIdx}] (${nums[minIdx]}).`,
          array: [...nums],
          activeIndices: [j, minIdx],
          subArrayRange: unsortedRange,
          subArrayRanges: [
            { range: [i, n - 1], label: "Unsorted Region", color: "cyan" },
            { range: [minIdx, minIdx], label: "Min Probe", color: "amber" }
          ],
          status: "comparing",
          vars: { i, j, minIdx },
        });

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineCompare > 0 ? lineCompare : lineInnerLoop,
          description: `Is nums[${j}] (${nums[j]}) < nums[${minIdx}] (${nums[minIdx]})?`,
          array: [...nums],
          activeIndices: [j, minIdx],
          subArrayRange: unsortedRange,
          subArrayRanges: [
            { range: [i, n - 1], label: "Unsorted Region", color: "cyan" },
            { range: [minIdx, minIdx], label: "Min Probe", color: "amber" }
          ],
          status: "comparing",
          vars: { i, j, minIdx },
        });

        if (nums[j] < nums[minIdx]) {
          minIdx = j;

          steps.push({
            stepNumber: stepCount++,
            lineNumber: lineMinUpdate > 0 ? lineMinUpdate : lineCompare,
            description: `New minimum found! Updating minIdx = ${j} (value ${nums[j]}).`,
            array: [...nums],
            activeIndices: [j],
            subArrayRange: unsortedRange,
            subArrayRanges: [
              { range: [i, n - 1], label: "Unsorted Region", color: "cyan" },
              { range: [minIdx, minIdx], label: "New Min", color: "amber" }
            ],
            status: "comparing",
            vars: { i, j, minIdx },
          });
        }
      }

      if (minIdx !== i) {
        [nums[i], nums[minIdx]] = [nums[minIdx], nums[i]];

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineSwap > 0 ? lineSwap : lineOuterLoop,
          description: `Swapped minimum element ${nums[i]} into sorted position at index ${i}. Array is now [${nums.join(", ")}].`,
          array: [...nums],
          activeIndices: [i, minIdx],
          subArrayRange: unsortedRange,
          subArrayRanges: [
            { range: [0, i], label: "Sorted Portion", color: "emerald" },
            { range: [i + 1, n - 1], label: "Unsorted Region", color: "cyan" }
          ],
          status: "swapping",
          vars: { i, minIdx },
        });
      } else {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineSwap > 0 ? lineSwap : lineOuterLoop,
          description: `Element at index ${i} (${nums[i]}) is already the minimum for this position. No swap needed.`,
          array: [...nums],
          activeIndices: [i],
          subArrayRange: unsortedRange,
          subArrayRanges: [
            { range: [0, i], label: "Sorted Portion", color: "emerald" },
            { range: [i + 1, n - 1], label: "Unsorted Region", color: "cyan" }
          ],
          status: "idle",
          vars: { i, minIdx },
        });
      }
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturn,
      description: `Selection sort complete! Final sorted array: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [],
      status: "sorted",
      vars: { n },
    });

    return steps;
  },
};
