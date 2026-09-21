import { AlgorithmSimulator, Step } from "../types";
import { findLineNumber } from "../utils";

export const countingSortSimulator: AlgorithmSimulator = {
  id: "CountingSort",
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
        description: `Driver Call: Starting countingSort on array [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { n },
      });
    }

    const lineHeader = findLineNumber(code, /(?:countingSort|counting_sort|CountingSort|sortArray|sort_array)/i, 1);
    const lineMaxFind = findLineNumber(code, /(?:max|maxVal|max_val|max_element|Math\.max|nums\.max)\s*=/i, lineHeader);
    const lineCountLoop = findLineNumber(code, /for\s*\(?.*count\[|for\s*\(?.*nums|nums\.each|foreach|ipairs|for\s+num/i, lineMaxFind);
    const lineCumulativeLoop = findLineNumber(code, /for\s*\(?.*count\[i\]\s*\+=|for\s*\(?.*1\s*\.\.\s*max|count\.each|for\s+i\s+in/i, lineCountLoop);
    const lineOutputBuild = findLineNumber(code, /for\s*\(?.*output\[|for\s*\(?.*n\s*-\s*1|cnt\.times|while\s*\(?.*count|nums\[idx\]/i, lineCumulativeLoop);
    const lineReturn = findLineNumber(code, /return|nums$/i, lineOutputBuild);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function countingSort(nums) with ${n} non-negative integer elements.`,
      array: [...nums],
      activeIndices: [],
      status: "idle",
      vars: { n },
    });

    const maxVal = Math.max(...nums, 0);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineMaxFind,
      description: `Finding maximum value in array: max = ${maxVal}. Initializing count array of size ${maxVal + 1}.`,
      array: [...nums],
      activeIndices: [],
      status: "counting",
      vars: { max: maxVal },
    });

    const count = new Array(maxVal + 1).fill(0);

    for (let i = 0; i < n; i++) {
      count[nums[i]]++;

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineCountLoop,
        description: `Frequency Counting: Element nums[${i}] = ${nums[i]}. Incrementing count[${nums[i]}] to ${count[nums[i]]}.`,
        array: [...nums],
        activeIndices: [i],
        status: "counting",
        vars: { i },
      });
    }

    // Cumulative sum
    for (let i = 1; i <= maxVal; i++) {
      count[i] += count[i - 1];

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineCumulativeLoop,
        description: `Computing prefix sums: count[${i}] = ${count[i]} (cumulative count of elements <= ${i}).`,
        array: [...nums],
        activeIndices: [],
        status: "counting",
        vars: { i },
      });
    }

    const output = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      const val = nums[i];
      const pos = count[val] - 1;
      output[pos] = val;
      count[val]--;

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineOutputBuild,
        description: `Placing element ${val} at output position ${pos}.`,
        array: [...output.map((v) => (v === undefined ? 0 : v))],
        activeIndices: [pos],
        status: "shifting",
        vars: { i, idx: pos },
      });
    }

    for (let i = 0; i < n; i++) {
      nums[i] = output[i];
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturn,
      description: `Counting sort complete! Final sorted array: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [],
      status: "sorted",
      vars: { n },
    });

    return steps;
  },
};
