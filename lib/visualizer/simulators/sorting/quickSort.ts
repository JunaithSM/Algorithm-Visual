import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const quickSortSimulator: AlgorithmSimulator = {
  id: "QuickSort",
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
        description: `Driver Call: Starting quickSort on array [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { n },
      });
    }

    const lineHeader = findLineNumber(code, /(?:quickSort|quick_sort|QuickSort|sortArray)/i, 1);
    const linePartitionCall = findLineNumber(code, /(?:partition\s*\(|pivotIdx|pivot_idx|p\s*=)/i, 2, lineHeader);
    const linePivotPick = findLineNumber(code, /(?:pivot|pivotVal)\s*=/i, 4, linePartitionCall);
    const linePartitionLoop = findLineNumber(code, /for\s*\(?.*j/i, 5, linePivotPick);
    const lineCompare = findLineNumber(code, /if\s*\(?.*(?:<=|>=|<|>)/i, 6, linePartitionLoop);
    const lineIncrementI = findLineNumber(code, /i\s*\+\+|i\s*\+=\s*1|i\s*=\s*i\s*\+\s*1/i, 6, lineCompare);
    const lineSwap = findLineNumber(code, /(?:\bswap\b|swapAt|\.swap|temp|\b[a-zA-Z0-9_\$]+\s*,\s*[a-zA-Z0-9_\$]+\s*=|\[.*\]\s*=|@\$\w+|\^=)/i, 7, lineCompare);
    const lineReturn = findLineNumber(code, /return/i, 9);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function quickSort(nums) with ${n} elements.`,
      array: [...nums],
      activeIndices: [],
      subArrayRange: [0, n - 1],
      status: "idle",
      vars: { n },
    });

    function quickSortHelper(arr: number[], low: number, high: number) {
      if (low >= high) return;

      steps.push({
        stepNumber: stepCount++,
        lineNumber: linePartitionCall,
        description: `Partitioning sub-array range [index ${low} .. ${high}].`,
        array: [...arr],
        activeIndices: [low, high],
        subArrayRange: [low, high],
        subArrayRanges: [
          { range: [low, high], label: "Partition Range", color: "blue" },
        ],
        status: "pivoting",
        vars: { low, high },
      });

      const pivot = arr[high];
      let i = low - 1;

      steps.push({
        stepNumber: stepCount++,
        lineNumber: linePivotPick > 0 ? linePivotPick : linePartitionCall,
        description: `Selected pivot element = ${pivot} at index ${high}. Pointer i set to ${i}.`,
        array: [...arr],
        activeIndices: [high],
        subArrayRange: [low, high],
        subArrayRanges: [
          { range: [low, high], label: "Partition Range", color: "blue" },
          { range: [high, high], label: "Pivot", color: "amber" },
        ],
        status: "pivoting",
        vars: { low, high, pivot, i },
      });

      for (let j = low; j < high; j++) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: linePartitionLoop > 0 ? linePartitionLoop : linePivotPick,
          description: `Scanning index j = ${j} (nums[${j}] = ${arr[j]}).`,
          array: [...arr],
          activeIndices: [j, high],
          subArrayRange: [low, high],
          subArrayRanges: [
            { range: [low, high], label: "Partition Range", color: "blue" },
            { range: [high, high], label: "Pivot", color: "amber" },
          ],
          status: "comparing",
          vars: { low, high, pivot, i, j },
        });

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineCompare > 0 ? lineCompare : linePartitionLoop,
          description: `Comparing element nums[${j}] (${arr[j]}) <= pivot (${pivot})?`,
          array: [...arr],
          activeIndices: [j, high],
          subArrayRange: [low, high],
          subArrayRanges: [
            { range: [low, high], label: "Partition Range", color: "blue" },
            { range: [high, high], label: "Pivot", color: "amber" },
          ],
          status: "comparing",
          vars: { low, high, pivot, i, j },
        });

        if (arr[j] <= pivot) {
          i++;

          steps.push({
            stepNumber: stepCount++,
            lineNumber: lineIncrementI > 0 ? lineIncrementI : lineCompare,
            description: `nums[${j}] (${arr[j]}) <= pivot (${pivot}). Incremented pointer i to ${i}.`,
            array: [...arr],
            activeIndices: [i >= 0 ? i : j, j],
            subArrayRange: [low, high],
            subArrayRanges: [
              { range: [low, high], label: "Partition Range", color: "blue" },
              { range: [high, high], label: "Pivot", color: "amber" },
            ],
            status: "shifting",
            vars: { low, high, pivot, i, j },
          });

          [arr[i], arr[j]] = [arr[j], arr[i]];

          steps.push({
            stepNumber: stepCount++,
            lineNumber: lineSwap > 0 ? lineSwap : lineCompare,
            description: i === j ? `nums[${j}] (${arr[i]}) <= pivot (${pivot}). Swapped nums[${i}] with itself.` : `Swapped nums[${i}] and nums[${j}].`,
            array: [...arr],
            activeIndices: [i, j],
            subArrayRange: [low, high],
            subArrayRanges: [
              { range: [low, high], label: "Partition Range", color: "blue" },
              { range: [high, high], label: "Pivot", color: "amber" },
            ],
            status: "swapping",
            vars: { low, high, pivot, i, j },
          });
        }
      }

      // Place pivot in correct position (i + 1)
      const pivotIdx = i + 1;
      [arr[pivotIdx], arr[high]] = [arr[high], arr[pivotIdx]];

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineSwap > 0 ? lineSwap : lineCompare,
        description: `Placed pivot ${pivot} into final partitioned position at index ${pivotIdx}.`,
        array: [...arr],
        activeIndices: [pivotIdx, high],
        subArrayRange: [low, high],
        subArrayRanges: [
          { range: [low, high], label: "Partition Range", color: "blue" },
          { range: [pivotIdx, pivotIdx], label: "Pivot", color: "amber" },
        ],
        status: "swapping",
        vars: { low, high, pivot, i },
      });

      const postRanges = [];
      if (pivotIdx - 1 >= low) {
        postRanges.push({ range: [low, pivotIdx - 1] as [number, number], label: "Left (<= Pivot)", color: "cyan" as const });
      }
      postRanges.push({ range: [pivotIdx, pivotIdx] as [number, number], label: "Pivot Fixed", color: "amber" as const });
      if (high >= pivotIdx + 1) {
        postRanges.push({ range: [pivotIdx + 1, high] as [number, number], label: "Right (> Pivot)", color: "purple" as const });
      }

      steps.push({
        stepNumber: stepCount++,
        lineNumber: linePartitionCall,
        description: `Partition complete! Pivot ${pivot} locked at index ${pivotIdx}. Sub-arrays to sort: [${low}..${pivotIdx - 1}] and [${pivotIdx + 1}..${high}].`,
        array: [...arr],
        activeIndices: [pivotIdx],
        subArrayRange: [low, high],
        subArrayRanges: postRanges,
        status: "pivoting",
        vars: { low, high, pivot, i },
      });

      quickSortHelper(arr, low, pivotIdx - 1);
      quickSortHelper(arr, pivotIdx + 1, high);
    }

    quickSortHelper(nums, 0, n - 1);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturn,
      description: `Quick sort complete! Final sorted array: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [],
      status: "sorted",
      vars: { n },
    });

    return steps;
  },
};
