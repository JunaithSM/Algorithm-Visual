import { AlgorithmSimulator, Step } from "../types";
import { findLineNumber } from "../utils";

export const linearSearchSimulator: AlgorithmSimulator = {
  id: "LinearSearch",
  category: "Searching",
  generateSteps(inputArray, target, code, startLineNumber) {
    const steps: Step[] = [];
    let stepCount = 1;
    const nums = [...inputArray];

    if (startLineNumber && startLineNumber > 0) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: startLineNumber,
        description: `Driver Call: Invoking linearSearch on array [${nums.join(", ")}] with target ${target}.`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { target },
      });
    }

    const lineHeader = findLineNumber(code, /(?:linearSearch|linear_search|LinearSearch)/i, 1);
    const lineLoop = findLineNumber(code, /for\s*\(?.*i\s*=|for\s+[a-zA-Z0-9_]+\s+in|while|for\s*\(/i, lineHeader);
    const lineMatch = findLineNumber(code, /if\s*\(?.*(?:==|===|num|target)/i, lineLoop);
    const lineReturnFound = findLineNumber(code, /return\s+(?:i|index|pos)|return\s+i|return\s+\$i|return\s+num/i, lineMatch);
    const lineReturnNotFound = findLineNumber(code, /return\s+-\s*1|-1$/i, lineReturnFound || lineMatch);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function linearSearch(nums, target = ${target}).`,
      array: [...nums],
      activeIndices: [],
      status: "idle",
      vars: { i: 0, target },
    });

    for (let i = 0; i < nums.length; i++) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineLoop,
        description: `Loop iteration i = ${i}. Checking index bounds i < nums.length (${nums.length}).`,
        array: [...nums],
        activeIndices: [i],
        status: "comparing",
        vars: { i, "nums[i]": nums[i], target },
      });

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMatch,
        description: `Comparing element nums[${i}] (${nums[i]}) == target (${target})?`,
        array: [...nums],
        activeIndices: [i],
        status: nums[i] === target ? "found" : "comparing",
        vars: { i, "nums[i]": nums[i], target },
      });

      if (nums[i] === target) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineReturnFound,
          description: `Target ${target} found at index ${i}! Returning index ${i}.`,
          array: [...nums],
          activeIndices: [i],
          foundIndex: i,
          status: "found",
          vars: { i, "nums[i]": nums[i], target },
        });
        return steps;
      }
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturnNotFound,
      description: `Linear search complete. Target ${target} was not found in array. Returning -1.`,
      array: [...nums],
      activeIndices: [],
      status: "not_found",
      vars: { target },
    });

    return steps;
  },
};
