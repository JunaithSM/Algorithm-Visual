import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const binarySearchSimulator: AlgorithmSimulator = {
  id: "BinarySearch",
  category: "Searching",
  generateSteps(inputArray, target, code, startLineNumber) {
    const steps: Step[] = [];
    let stepCount = 1;
    const nums = [...inputArray].sort((a, b) => a - b);
    let left = 0;
    let right = nums.length - 1;

    if (startLineNumber && startLineNumber > 0) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: startLineNumber,
        description: `Driver Call: Invoking binarySearch on sorted array [${nums.join(", ")}] with target ${target}.`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { target },
      });
    }

    const lineHeader = findLineNumber(code, /(?:binarySearch|binary_search|BinarySearch|search)/i, 1);
    const lineInit = findLineNumber(code, /(?:left|low|start)\s*=\s*/i, 2, lineHeader);
    const lineLoop = findLineNumber(code, /while\s*\(?.*(?:left|low|start)/i, 3, lineInit);
    const lineMid = findLineNumber(code, /(?:mid|middle)\s*=/i, 4, lineLoop);
    const lineMatch = findLineNumber(code, /if\s*\(?.*(?:mid|middle|==|===).*target/i, 5, lineMid);
    const lineMoveRight = findLineNumber(code, /(?:left|low|start)\s*=\s*(?:mid|middle)\s*\+\s*1/i, 6, lineMatch);
    const lineMoveLeft = findLineNumber(code, /(?:right|high|end)\s*=\s*(?:mid|middle)\s*-\s*1/i, 7, lineMoveRight);
    const lineReturnNotFound = findLineNumber(code, /return\s+-\s*1|-1$/i, 8);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function binarySearch(nums, target = ${target}).`,
      array: [...nums],
      activeIndices: [left, right],
      subArrayRange: [left, right],
      subArrayRanges: [
        { range: [left, right], label: "Search Range", color: "cyan" }
      ],
      status: "idle",
      vars: { left, right, target },
    });

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineInit > 0 ? lineInit : lineHeader,
      description: `Initializing search bounds: left = 0, right = ${right}. Array is sorted: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [left, right],
      subArrayRange: [left, right],
      subArrayRanges: [
        { range: [left, right], label: "Search Range", color: "cyan" }
      ],
      status: "idle",
      vars: { left, right, target },
    });

    while (left <= right) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineLoop > 0 ? lineLoop : lineInit,
        description: `Evaluating search range condition: left (${left}) <= right (${right}).`,
        array: [...nums],
        activeIndices: [left, right],
        subArrayRange: [left, right],
        subArrayRanges: [
          { range: [left, right], label: "Search Range", color: "cyan" }
        ],
        status: "comparing",
        vars: { left, right, target },
      });

      const mid = Math.floor(left + (right - left) / 2);

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMid > 0 ? lineMid : lineLoop,
        description: `Calculating mid index: mid = ${left} + Math.floor((${right} - ${left}) / 2) = ${mid}. Element nums[${mid}] = ${nums[mid]}.`,
        array: [...nums],
        activeIndices: [mid],
        subArrayRange: [left, right],
        subArrayRanges: [
          { range: [left, right], label: "Search Range", color: "cyan" },
          { range: [mid, mid], label: "Mid Probe", color: "amber" }
        ],
        status: "comparing",
        vars: { left, right, mid, target },
      });

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMatch > 0 ? lineMatch : lineMid,
        description: `Comparing middle element nums[${mid}] (${nums[mid]}) with target (${target}).`,
        array: [...nums],
        activeIndices: [mid],
        subArrayRange: [left, right],
        subArrayRanges: [
          { range: [left, right], label: "Search Range", color: "cyan" },
          { range: [mid, mid], label: "Mid Probe", color: "amber" }
        ],
        status: nums[mid] === target ? "found" : "comparing",
        vars: { left, right, mid, target },
      });

      if (nums[mid] === target) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMatch > 0 ? lineMatch : lineMid,
          description: `Target ${target} found at mid index ${mid}! Returning index ${mid}.`,
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
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMoveRight > 0 ? lineMoveRight : lineMatch,
          description: `nums[${mid}] (${nums[mid]}) < target (${target}). Adjusting left boundary to mid + 1 = ${mid + 1}.`,
          array: [...nums],
          activeIndices: [mid],
          subArrayRange: [left, right],
          subArrayRanges: [
            { range: [left, right], label: "Search Range", color: "cyan" }
          ],
          status: "comparing",
          vars: { left: mid + 1, right, mid, target },
        });
        left = mid + 1;
      } else {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMoveLeft > 0 ? lineMoveLeft : lineMatch,
          description: `nums[${mid}] (${nums[mid]}) > target (${target}). Adjusting right boundary to mid - 1 = ${mid - 1}.`,
          array: [...nums],
          activeIndices: [mid],
          subArrayRange: [left, right],
          subArrayRanges: [
            { range: [left, right], label: "Search Range", color: "cyan" }
          ],
          status: "comparing",
          vars: { left, right: mid - 1, mid, target },
        });
        right = mid - 1;
      }
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturnNotFound,
      description: `Search space exhausted (left > right). Target ${target} not found in array. Returning -1.`,
      array: [...nums],
      activeIndices: [],
      status: "not_found",
      vars: { left, right, target },
    });

    return steps;
  },
};
