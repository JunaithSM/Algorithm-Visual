import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const jumpSearchSimulator: AlgorithmSimulator = {
  id: "JumpSearch",
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
        description: `Driver Call: Invoking jumpSearch on sorted array [${nums.join(", ")}] with target ${target}.`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { target },
      });
    }

    const lineHeader = findLineNumber(code, /(?:jumpSearch|jump_search|JumpSearch)/i, 1);
    const lineStepCalc = findLineNumber(code, /(?:step|blockSize|sqrt)\s*=/i, lineHeader);
    const lineJumpLoop = findLineNumber(code, /while\s*\(?.*(?:step|blockSize|prev|nums).*</i, lineStepCalc);
    const lineLinearLoop = findLineNumber(code, /while\s*\(?.*(?:prev|i|nums).*</i, lineJumpLoop);
    const lineMatch = findLineNumber(code, /if\s*\(?.*(?:prev|i|nums).*(?:==|===).*target/i, lineLinearLoop);
    const lineReturnNotFound = findLineNumber(code, /return\s+-\s*1|-1$/i, lineMatch);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function jumpSearch(nums, target = ${target}).`,
      array: [...nums],
      activeIndices: [],
      status: "idle",
      vars: { n, target },
    });

    const stepSize = Math.floor(Math.sqrt(n));
    let step = stepSize;
    let prev = 0;

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineStepCalc,
      description: `Calculating optimal jump step size: step = Math.floor(sqrt(${n})) = ${stepSize}.`,
      array: [...nums],
      activeIndices: [0],
      subArrayRange: [0, Math.min(step, n) - 1],
      subArrayRanges: [
        { range: [0, Math.min(step, n) - 1], label: "Initial Block", color: "cyan" }
      ],
      status: "idle",
      vars: { step: stepSize, prev: 0, n, target },
    });

    while (nums[Math.min(step, n) - 1] < target) {
      const checkIdx = Math.min(step, n) - 1;
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineJumpLoop,
        description: `Jumping block forward: checking block end nums[${checkIdx}] (${nums[checkIdx]}) < target (${target}).`,
        array: [...nums],
        activeIndices: [prev, checkIdx],
        subArrayRange: [prev, checkIdx],
        subArrayRanges: [
          { range: [prev, checkIdx], label: "Jump Block", color: "cyan" }
        ],
        status: "comparing",
        vars: { prev, step, n, target },
      });

      prev = step;
      step += stepSize;

      if (prev >= n) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineJumpLoop,
          description: `Jump block past array bounds (prev = ${prev} >= n = ${n}). Target not present.`,
          array: [...nums],
          activeIndices: [],
          status: "not_found",
          vars: { prev, step, n, target },
        });
        return steps;
      }
    }

    const blockEnd = Math.min(step, n) - 1;

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineJumpLoop,
      description: `Target is within current block between index ${prev} and index ${blockEnd}.`,
      array: [...nums],
      activeIndices: [prev, blockEnd],
      subArrayRange: [prev, blockEnd],
      subArrayRanges: [
        { range: [prev, blockEnd], label: "Search Block", color: "purple" }
      ],
      status: "comparing",
      vars: { prev, step, n, target },
    });

    // Linear search inside identified block
    while (nums[prev] < target) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineLinearLoop,
        description: `Linear search within block: nums[${prev}] (${nums[prev]}) < target (${target}). Incrementing prev.`,
        array: [...nums],
        activeIndices: [prev],
        subArrayRange: [prev, blockEnd],
        subArrayRanges: [
          { range: [prev, blockEnd], label: "Search Block", color: "purple" }
        ],
        status: "comparing",
        vars: { prev, step, n, target },
      });

      prev++;

      if (prev === Math.min(step, n)) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineReturnNotFound,
          description: `Reached end of block without finding target ${target}. Returning -1.`,
          array: [...nums],
          activeIndices: [],
          status: "not_found",
          vars: { prev, step, n, target },
        });
        return steps;
      }
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineMatch,
      description: `Checking exact match at prev index ${prev}: nums[${prev}] (${nums[prev]}) == target (${target})?`,
      array: [...nums],
      activeIndices: [prev],
      subArrayRange: [prev, blockEnd],
      subArrayRanges: [
        { range: [prev, blockEnd], label: "Search Block", color: "purple" }
      ],
      status: nums[prev] === target ? "found" : "not_found",
      vars: { prev, step, n, target },
    });

    if (nums[prev] === target) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMatch,
        description: `Target ${target} found at index ${prev}! Returning index ${prev}.`,
        array: [...nums],
        activeIndices: [prev],
        subArrayRange: [prev, blockEnd],
        subArrayRanges: [
          { range: [prev, blockEnd], label: "Match Found", color: "emerald" }
        ],
        foundIndex: prev,
        status: "found",
        vars: { prev, step, n, target },
      });
      return steps;
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturnNotFound,
      description: `Target ${target} not found in array. Returning -1.`,
      array: [...nums],
      activeIndices: [],
      status: "not_found",
      vars: { prev, target },
    });

    return steps;
  },
};
