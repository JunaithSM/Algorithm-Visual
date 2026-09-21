import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const cocktailSortSimulator: AlgorithmSimulator = {
  id: "CocktailSort",
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
        description: `Driver Call: Starting cocktailSort on array [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { n },
      });
    }

    const lineHeader = findLineNumber(code, /(?:cocktailSort|cocktail_sort|CocktailSort|sortArray)/i, 1);
    const lineForwardLoop = findLineNumber(code, /for\s+i\s+in\s+range|for\s*\(?.*i/i, 2, lineHeader);
    const lineForwardCompare = findLineNumber(code, /if\s*\(?.*(?:>|<|swap)/i, 3, lineForwardLoop);
    const lineForwardSwap = findLineNumber(code, /(?:\bswap\b|swapAt|\.swap|temp|\b[a-zA-Z0-9_\$]+\s*,\s*[a-zA-Z0-9_\$]+\s*=|\[.*\]\s*=|@\$\w+|\^=)/i, 4, lineForwardCompare);
    const lineBackwardLoop = findLineNumber(code, /for\s+i\s+in\s+range|for\s*\(?.*i/i, 5, lineForwardSwap);
    const lineBackwardCompare = findLineNumber(code, /if\s*\(?.*(?:>|<|swap)/i, 6, lineBackwardLoop);
    const lineBackwardSwap = findLineNumber(code, /(?:\bswap\b|swapAt|\.swap|temp|\b[a-zA-Z0-9_\$]+\s*,\s*[a-zA-Z0-9_\$]+\s*=|\[.*\]\s*=|@\$\w+|\^=)/i, 7, lineBackwardCompare);
    const lineReturn = findLineNumber(code, /return/i, 8);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function cocktailSort(nums) with ${n} elements.`,
      array: [...nums],
      activeIndices: [],
      subArrayRange: [0, n - 1],
      status: "idle",
      vars: { n },
    });

    let swapped = true;
    let start = 0;
    let end = n - 1;

    while (swapped) {
      swapped = false;
      const currentRange: [number, number] = [start, end];

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineForwardLoop,
        description: `Forward Pass (Left to Right): Bubbling largest element to end (range index ${start} to ${end}).`,
        array: [...nums],
        activeIndices: [start, end],
        subArrayRange: currentRange,
        subArrayRanges: [
          { range: [start, end], label: "Forward Sweep", color: "cyan" }
        ],
        status: "idle",
        vars: { start, end },
      });

      for (let i = start; i < end; i++) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineForwardLoop,
          description: `Comparing adjacent nums[${i}] (${nums[i]}) and nums[${i + 1}] (${nums[i + 1]}).`,
          array: [...nums],
          activeIndices: [i, i + 1],
          subArrayRange: currentRange,
          subArrayRanges: [
            { range: [start, end], label: "Forward Sweep", color: "cyan" }
          ],
          status: "comparing",
          vars: { start, end, i },
        });

        if (nums[i] > nums[i + 1]) {
          [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
          swapped = true;

          steps.push({
            stepNumber: stepCount++,
            lineNumber: lineForwardSwap > 0 ? lineForwardSwap : lineForwardCompare,
            description: `Forward Pass Swap: Swapped nums[${i}] and nums[${i + 1}]. Array state is now [${nums.join(", ")}].`,
            array: [...nums],
            activeIndices: [i, i + 1],
            subArrayRange: currentRange,
            subArrayRanges: [
              { range: [start, end], label: "Forward Sweep", color: "cyan" }
            ],
            status: "swapping",
            vars: { start, end, i },
          });
        }
      }

      if (!swapped) break;

      swapped = false;
      end--;

      const backRange: [number, number] = [start, end];

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineBackwardLoop > 0 ? lineBackwardLoop : lineForwardLoop,
        description: `Backward Pass (Right to Left): Bubbling smallest element to front (range index ${end} down to ${start}).`,
        array: [...nums],
        activeIndices: [start, end],
        subArrayRange: backRange,
        subArrayRanges: [
          { range: [start, end], label: "Backward Sweep", color: "purple" }
        ],
        status: "idle",
        vars: { start, end },
      });

      for (let i = end - 1; i >= start; i--) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineBackwardLoop > 0 ? lineBackwardLoop : lineForwardLoop,
          description: `Comparing adjacent nums[${i}] (${nums[i]}) and nums[${i + 1}] (${nums[i + 1]}).`,
          array: [...nums],
          activeIndices: [i, i + 1],
          subArrayRange: backRange,
          subArrayRanges: [
            { range: [start, end], label: "Backward Sweep", color: "purple" }
          ],
          status: "comparing",
          vars: { start, end, i },
        });

        if (nums[i] > nums[i + 1]) {
          [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
          swapped = true;

          steps.push({
            stepNumber: stepCount++,
            lineNumber: lineBackwardSwap > 0 ? lineBackwardSwap : lineBackwardCompare,
            description: `Backward Pass Swap: Swapped nums[${i}] and nums[${i + 1}]. Array state is now [${nums.join(", ")}].`,
            array: [...nums],
            activeIndices: [i, i + 1],
            subArrayRange: backRange,
            subArrayRanges: [
              { range: [start, end], label: "Backward Sweep", color: "purple" }
            ],
            status: "swapping",
            vars: { start, end, i },
          });
        }
      }

      start++;
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturn,
      description: `Cocktail shaker sort complete! Final sorted array: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [],
      status: "sorted",
      vars: { n },
    });

    return steps;
  },
};
