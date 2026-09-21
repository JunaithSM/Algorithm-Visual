import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const interpolationSearchSimulator: AlgorithmSimulator = {
  id: "InterpolationSearch",
  category: "Searching",
  generateSteps(inputArray, target, code, startLineNumber) {
    const steps: Step[] = [];
    let stepCount = 1;
    const nums = [...inputArray].sort((a, b) => a - b);
    let low = 0;
    let high = nums.length - 1;

    if (startLineNumber && startLineNumber > 0) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: startLineNumber,
        description: `Driver Call: Invoking interpolationSearch on array [${nums.join(", ")}] with target ${target}.`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { target },
      });
    }

    const lineHeader = findLineNumber(code, /(?:interpolationSearch|interpolation_search|InterpolationSearch)/i, 1);
    const lineInit = findLineNumber(code, /(?:low|left)\s*=\s*0|0\s*\.\./i, lineHeader);
    const lineLoop = findLineNumber(code, /while\s*\(?\s*(?:low|left)\s*<=|while\s*\(?.*target/i, lineInit);
    const linePos = findLineNumber(code, /(?:pos|position)\s*=/i, lineLoop);
    const lineMatch = findLineNumber(code, /if\s*\(?.*(?:pos|position|arr|nums).*(?:==|===).*target/i, linePos);
    const lineMoveRight = findLineNumber(code, /(?:low|left)\s*=\s*(?:pos|position)\s*\+\s*1/i, lineMatch);
    const lineMoveLeft = findLineNumber(code, /(?:high|right)\s*=\s*(?:pos|position)\s*-\s*1/i, lineMoveRight);
    const lineReturnNotFound = findLineNumber(code, /return\s+-\s*1|-1$/i, lineMoveLeft);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function interpolationSearch(nums, target = ${target}).`,
      array: [...nums],
      activeIndices: [low, high],
      subArrayRange: [low, high],
      subArrayRanges: [
        { range: [low, high], label: "Search Window", color: "cyan" }
      ],
      status: "idle",
      vars: { low, high, target },
    });

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineInit,
      description: `Initializing search bounds: low = 0, high = ${high}. Array sorted: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [low, high],
      subArrayRange: [low, high],
      subArrayRanges: [
        { range: [low, high], label: "Search Window", color: "cyan" }
      ],
      status: "idle",
      vars: { low, high, target },
    });

    while (low <= high && target >= nums[low] && target <= nums[high]) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineLoop,
        description: `Evaluating loop condition: target ${target} is within range [nums[${low}] = ${nums[low]}, nums[${high}] = ${nums[high]}].`,
        array: [...nums],
        activeIndices: [low, high],
        subArrayRange: [low, high],
        subArrayRanges: [
          { range: [low, high], label: "Search Window", color: "cyan" }
        ],
        status: "comparing",
        vars: { low, high, target },
      });

      if (low === high) {
        if (nums[low] === target) {
          steps.push({
            stepNumber: stepCount++,
            lineNumber: lineMatch,
            description: `Single element left low == high (${low}). Match found! Target ${target} at index ${low}.`,
            array: [...nums],
            activeIndices: [low],
            subArrayRange: [low, high],
            subArrayRanges: [
              { range: [low, low], label: "Match Found", color: "emerald" }
            ],
            foundIndex: low,
            status: "found",
            vars: { low, high, pos: low, target },
          });
          return steps;
        }
        break;
      }

      const denominator = nums[high] - nums[low];
      const pos = denominator === 0 ? low : low + Math.floor(((high - low) / denominator) * (target - nums[low]));

      steps.push({
        stepNumber: stepCount++,
        lineNumber: linePos,
        description: `Interpolating probe position: pos = ${low} + Math.floor(((${high} - ${low})/(${nums[high]} - ${nums[low]})) * (${target} - ${nums[low]})) = ${pos}.`,
        array: [...nums],
        activeIndices: [pos],
        subArrayRange: [low, high],
        subArrayRanges: [
          { range: [low, high], label: "Search Window", color: "cyan" },
          { range: [pos, pos], label: "Probe", color: "amber" }
        ],
        status: "comparing",
        vars: { low, high, pos, target },
      });

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMatch,
        description: `Comparing element at estimated probe position nums[${pos}] (${nums[pos]}) with target (${target}).`,
        array: [...nums],
        activeIndices: [pos],
        subArrayRange: [low, high],
        subArrayRanges: [
          { range: [low, high], label: "Search Window", color: "cyan" },
          { range: [pos, pos], label: "Probe", color: "amber" }
        ],
        status: nums[pos] === target ? "found" : "comparing",
        vars: { low, high, pos, target },
      });

      if (nums[pos] === target) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMatch,
          description: `Interpolation match found! nums[${pos}] (${nums[pos]}) == target (${target}). Returning index ${pos}.`,
          array: [...nums],
          activeIndices: [pos],
          subArrayRange: [low, high],
          subArrayRanges: [
            { range: [pos, pos], label: "Match Found", color: "emerald" }
          ],
          foundIndex: pos,
          status: "found",
          vars: { low, high, pos, target },
        });
        return steps;
      }

      if (nums[pos] < target) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMoveRight,
          description: `nums[${pos}] (${nums[pos]}) < target (${target}). Adjusting low = pos + 1 = ${pos + 1}.`,
          array: [...nums],
          activeIndices: [pos],
          subArrayRange: [low, high],
          subArrayRanges: [
            { range: [low, high], label: "Search Window", color: "cyan" }
          ],
          status: "comparing",
          vars: { low: pos + 1, high, pos, target },
        });
        low = pos + 1;
      } else {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMoveLeft,
          description: `nums[${pos}] (${nums[pos]}) > target (${target}). Adjusting high = pos - 1 = ${pos - 1}.`,
          array: [...nums],
          activeIndices: [pos],
          subArrayRange: [low, high],
          subArrayRanges: [
            { range: [low, high], label: "Search Window", color: "cyan" }
          ],
          status: "comparing",
          vars: { low, high: pos - 1, pos, target },
        });
        high = pos - 1;
      }
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturnNotFound,
      description: `Target ${target} is outside remaining search range or not found. Returning -1.`,
      array: [...nums],
      activeIndices: [],
      status: "not_found",
      vars: { low, high, target },
    });

    return steps;
  },
};
