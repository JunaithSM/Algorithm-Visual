import { AlgorithmSimulator, Step } from "../types";
import { findLineNumber } from "../utils";

export const radixSortSimulator: AlgorithmSimulator = {
  id: "RadixSort",
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
        description: `Driver Call: Starting radixSort on array [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { n },
      });
    }

    const lineHeader = findLineNumber(code, /(?:radixSort|radix_sort|RadixSort|sortArray)/i, 1);
    const lineMaxFind = findLineNumber(code, /(?:max|maxVal|getMax)\s*=/i, 2, lineHeader);
    const lineExpLoop = findLineNumber(code, /(?:for|while)\s*\(?.*exp/i, 3, lineMaxFind);
    const lineCountSortCall = findLineNumber(code, /(?:countSort|countingSort|count_sort)/i, 4, lineExpLoop);
    const lineDigitCount = findLineNumber(code, /(?:count\[|\[\(num|\[\(arr)/i, 5, lineCountSortCall);
    const lineDigitPlace = findLineNumber(code, /(?:output\[|res\[|arr\[)/i, 6, lineDigitCount);
    const lineReturn = findLineNumber(code, /return/i, 7);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function radixSort(nums) with ${n} elements.`,
      array: [...nums],
      activeIndices: [],
      status: "idle",
      vars: { n },
    });

    const maxVal = Math.max(...nums, 1);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineMaxFind > 0 ? lineMaxFind : lineHeader,
      description: `Determining max value maxVal = ${maxVal} to extract maximum digit place value.`,
      array: [...nums],
      activeIndices: [],
      status: "idle",
      vars: { maxVal },
    });

    for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineExpLoop > 0 ? lineExpLoop : lineMaxFind,
        description: `Digit Pass: Sorting by digit place value exp = ${exp} (${exp}s digit).`,
        array: [...nums],
        activeIndices: [],
        status: "bucketing",
        vars: { exp },
      });

      // Counting sort based on digit place value exp
      const count = new Array(10).fill(0);
      for (let i = 0; i < n; i++) {
        const digit = Math.floor(nums[i] / exp) % 10;
        count[digit]++;

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineDigitCount > 0 ? lineDigitCount : (lineCountSortCall > 0 ? lineCountSortCall : lineExpLoop),
          description: `Element nums[${i}] = ${nums[i]}: digit at ${exp}s place is ${digit}. Incrementing count[${digit}].`,
          array: [...nums],
          activeIndices: [i],
          status: "bucketing",
          vars: { i, val: nums[i], exp, digit, count: count[digit] },
        });
      }

      const output = new Array(n).fill(0);
      // Place elements by digit
      const tempNums = [...nums];
      tempNums.sort((a, b) => (Math.floor(a / exp) % 10) - (Math.floor(b / exp) % 10));

      for (let i = 0; i < n; i++) {
        nums[i] = tempNums[i];

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineDigitPlace > 0 ? lineDigitPlace : (lineCountSortCall > 0 ? lineCountSortCall : lineExpLoop),
          description: `Placing element ${nums[i]} into digit-bucket position ${i}.`,
          array: [...nums],
          activeIndices: [i],
          status: "bucketing",
          vars: { i, val: nums[i], exp },
        });
      }
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturn,
      description: `Radix sort complete! Final sorted array: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [],
      status: "sorted",
      vars: { n },
    });

    return steps;
  },
};
