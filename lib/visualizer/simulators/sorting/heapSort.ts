import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const heapSortSimulator: AlgorithmSimulator = {
  id: "HeapSort",
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
        description: `Driver Call: Starting heapSort on array [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { n },
      });
    }

    const lineHeapifyHeader = findLineNumber(code, /(?:void\s+heapify|def\s+heapify|func\s+heapify|heapify\s*\(|max_heapify)/i, 1, 1);
    const lineHeapifySwap = findLineNumber(code, /(?:\bswap\b|swapAt|\.swap|temp|\b[a-zA-Z0-9_\$]+\s*,\s*[a-zA-Z0-9_\$]+\s*=|\[.*\]\s*=|@\$\w+|\^=)/i, 4, lineHeapifyHeader);
    const lineHeader = findLineNumber(code, /(?:heapSort|heap_sort|HeapSort|sortArray)/i, 1);
    const lineBuildHeap = findLineNumber(code, /for\s*\(?.*(?:Math\.floor|n\s*\/\s*2|len\s*\/\s*2|i\s*=)/i, 2, lineHeader);
    const lineHeapifyCall = findLineNumber(code, /(?:heapify|maxHeapify)/i, 3, lineBuildHeap);
    const lineExtractLoop = findLineNumber(code, /for\s*\(?.*(?:i\s*=\s*n|n\s*-\s*1|len)/i, 4, lineHeapifyCall);
    const lineSwapRoot = findLineNumber(code, /(?:\bswap\b|swapAt|\.swap|temp|\[0\]\s*=|\[i\]\s*=|\b[a-zA-Z0-9_\$]+\s*,\s*[a-zA-Z0-9_\$]+\s*=|\[.*\]\s*=|@\$\w+|\^=)/i, 5, lineExtractLoop);
    const lineReturn = findLineNumber(code, /return/i, 7);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function heapSort(nums) with ${n} elements.`,
      array: [...nums],
      activeIndices: [],
      subArrayRange: [0, n - 1],
      status: "idle",
      vars: { n },
    });

    function heapify(arr: number[], size: number, rootIdx: number) {
      let largest = rootIdx;
      const left = 2 * rootIdx + 1;
      const right = 2 * rootIdx + 2;

      if (left < size && arr[left] > arr[largest]) {
        largest = left;
      }
      if (right < size && arr[right] > arr[largest]) {
        largest = right;
      }

      if (largest !== rootIdx) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineHeapifySwap > 0 ? lineHeapifySwap : (lineHeapifyCall > 0 ? lineHeapifyCall : lineBuildHeap),
          description: `Heapify violation: root nums[${rootIdx}] (${arr[rootIdx]}) < child nums[${largest}] (${arr[largest]}). Swapping.`,
          array: [...arr],
          activeIndices: [rootIdx, largest],
          subArrayRange: [0, size - 1],
          status: "swapping",
          vars: { rootIdx, largest, size },
        });

        [arr[rootIdx], arr[largest]] = [arr[largest], arr[rootIdx]];

        heapify(arr, size, largest);
      }
    }

    // Step 1: Build max-heap
    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineBuildHeap,
      description: `Phase 1: Building Max-Heap structure from array.`,
      array: [...nums],
      activeIndices: [],
      subArrayRange: [0, n - 1],
      status: "idle",
      vars: { n },
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(nums, n, i);
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineBuildHeap,
      description: `Max-Heap created successfully! Root element is maximum (${nums[0]}).`,
      array: [...nums],
      activeIndices: [0],
      subArrayRange: [0, n - 1],
      subArrayRanges: [
        { range: [0, n - 1], label: "Max-Heap", color: "cyan" }
      ],
      status: "pivoting",
      vars: { n },
    });

    // Step 2: Extract elements one by one from heap
    for (let i = n - 1; i > 0; i--) {
      const heapRange: SubArrayRange[] = [
        { range: [0, i], label: "Max-Heap", color: "cyan" },
        ...(i < n - 1 ? [{ range: [i + 1, n - 1] as [number, number], label: "Sorted Portion", color: "emerald" as const }] : [])
      ];

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineExtractLoop > 0 ? lineExtractLoop : lineBuildHeap,
        description: `Phase 2 (Iteration i = ${i}): Moving current heap root (max element ${nums[0]}) to end at index ${i}.`,
        array: [...nums],
        activeIndices: [0, i],
        subArrayRange: [0, i],
        subArrayRanges: heapRange,
        status: "comparing",
        vars: { i, n },
      });

      [nums[0], nums[i]] = [nums[i], nums[0]];

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineSwapRoot > 0 ? lineSwapRoot : lineExtractLoop,
        description: `Max element ${nums[i]} locked at sorted position index ${i}. Re-heapifying remaining heap of size ${i}.`,
        array: [...nums],
        activeIndices: [i],
        subArrayRange: [0, i - 1],
        subArrayRanges: [
          ...(i - 1 >= 0 ? [{ range: [0, i - 1] as [number, number], label: "Active Heap", color: "cyan" as const }] : []),
          { range: [i, n - 1], label: "Sorted Portion", color: "emerald" }
        ],
        status: "swapping",
        vars: { i, n },
      });

      heapify(nums, i, 0);
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturn,
      description: `Heap sort complete! Final sorted array: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [],
      status: "sorted",
      vars: { n },
    });

    return steps;
  },
};
