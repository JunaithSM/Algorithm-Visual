import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const exponentialSearchSimulator: AlgorithmSimulator = {
  id: "ExponentialSearch",
  category: "Searching",
  generateSteps(inputArray, target, code, startLineNumber) {
    const steps: Step[] = [];
    let stepCount = 1;
    const nums = [...inputArray].sort((a, b) => a - b);
    const n = nums.length;

    if (startLineNumber && startLineNumber > 0) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: startLineNumber,
        description: `Driver Call: Invoking exponentialSearch on sorted array [${nums.join(", ")}] with target ${target}.`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { target },
      });
    }

    const lineHeader = findLineNumber(code, /(?:exponentialSearch|exponential_search|ExponentialSearch)/i, 1);
    const lineFirstCheck = findLineNumber(code, /if\s*\(?.*(?:nums|arr)\[0\]/i, lineHeader);
    const lineBoundLoop = findLineNumber(code, /while\s*\(?.*i\s*<\s*n.*nums|while\s*\(?.*i\s*</i, lineFirstCheck);
    const lineBinarySearchCall = findLineNumber(code, /(?:binarySearch|binary_search|BinarySearch|while\s*\(.*low)/i, lineBoundLoop);
    const lineReturnNotFound = findLineNumber(code, /return\s+-\s*1|-1$/i, lineBinarySearchCall);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function exponentialSearch(nums, target = ${target}).`,
      array: [...nums],
      activeIndices: [],
      status: "idle",
      vars: { target },
    });

    if (nums[0] === target) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineFirstCheck,
        description: `Target ${target} found immediately at index 0!`,
        array: [...nums],
        activeIndices: [0],
        subArrayRange: [0, 0],
        foundIndex: 0,
        status: "found",
        vars: { i: 0, target },
      });
      return steps;
    }

    let i = 1;
    while (i < n && nums[i] <= target) {
      const boundLow = Math.floor(i / 2);
      const boundHigh = Math.min(i, n - 1);

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineBoundLoop,
        description: `Exponential bound expansion: checking index i = ${i}, nums[${i}] = ${nums[i]} <= target ${target}. Doubling i to ${i * 2}.`,
        array: [...nums],
        activeIndices: [i],
        subArrayRange: [boundLow, boundHigh],
        subArrayRanges: [
          { range: [boundLow, boundHigh], label: "Bound Window", color: "cyan" }
        ],
        status: "comparing",
        vars: { i, target },
      });

      if (nums[i] === target) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineBoundLoop,
          description: `Target ${target} found during exponential bound search at index ${i}!`,
          array: [...nums],
          activeIndices: [i],
          subArrayRange: [boundLow, boundHigh],
          subArrayRanges: [
            { range: [i, i], label: "Match Found", color: "emerald" }
          ],
          foundIndex: i,
          status: "found",
          vars: { i, target },
        });
        return steps;
      }

      i = i * 2;
    }

    let left = Math.floor(i / 2);
    let right = Math.min(i, n - 1);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineBinarySearchCall,
      description: `Bound established! Performing binary search in range [left = ${left}, right = ${right}].`,
      array: [...nums],
      activeIndices: [left, right],
      subArrayRange: [left, right],
      subArrayRanges: [
        { range: [left, right], label: "Binary Range", color: "purple" }
      ],
      status: "comparing",
      vars: { left, right, target },
    });

    // Sub-range binary search
    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineBinarySearchCall,
        description: `Binary search step in range [${left}, ${right}]: mid = ${mid}, nums[${mid}] = ${nums[mid]}.`,
        array: [...nums],
        activeIndices: [mid],
        subArrayRange: [left, right],
        subArrayRanges: [
          { range: [left, right], label: "Binary Range", color: "purple" },
          { range: [mid, mid], label: "Mid Probe", color: "amber" }
        ],
        status: nums[mid] === target ? "found" : "comparing",
        vars: { left, right, mid, target },
      });

      if (nums[mid] === target) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineBinarySearchCall,
          description: `Target ${target} found at index ${mid}! Returning index ${mid}.`,
          array: [...nums],
          activeIndices: [mid],
          subArrayRange: [left, right],
          subArrayRanges: [
            { range: [mid, mid], label: "Match Found", color: "emerald" }
          ],
          foundIndex: mid,
          status: "found",
          vars: { left, right, mid, target },
        });
        return steps;
      }

      if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturnNotFound,
      description: `Target ${target} not found in array. Returning -1.`,
      array: [...nums],
      activeIndices: [],
      status: "not_found",
      vars: { target },
    });

    return steps;
  },
};
