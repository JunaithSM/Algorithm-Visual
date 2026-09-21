import { AlgorithmSimulator, Step, SubArrayRange } from "../types";
import { findLineNumber } from "../utils";

export const mergeSortSimulator: AlgorithmSimulator = {
  id: "MergeSort",
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
        description: `Driver Call: Starting mergeSort on array [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { n },
      });
    }

    const lineHeader = findLineNumber(code, /(?:mergeSort|merge_sort|MergeSort|sortArray)/i, 1);
    const lineDivide = findLineNumber(code, /(?:mid|middle)\s*=/i, 2, lineHeader);
    const lineMergeCall = findLineNumber(code, /(?:merge\s*\(|mergeSub|mergeArray)/i, 4, lineDivide);
    const lineMergeHeader = findLineNumber(code, /(?:function\s+merge|def\s+merge|void\s+merge|merge\s*\(left|merge\s*\(nums)/i, 6, lineMergeCall);
    const lineMergeInit = findLineNumber(code, /(?:int\s+i|let\s+i|var\s+i|i\s*=\s*0|i\s*=\s*left|i\s*,\s*j\s*=\s*0)/i, lineMergeHeader, lineMergeHeader);
    const lineMergeLoop = findLineNumber(code, /while\s*\(?.*(?:i\s*<|j\s*<|k\s*<|left|n1)/i, 10, lineMergeHeader);
    const lineMergeCompare = findLineNumber(code, /if\s*\(?.*(?:left\[|L\[|R\[|nums\[|leftPart|leftVal|<=)/i, 11, lineMergeLoop);
    const lineMergePlace = findLineNumber(code, /(?:push|append|temp\[|res\.|\bnums\[k\]|placedIdx|nums\[k\+\+\])/i, 11, lineMergeCompare);
    const lineMergeFlush = findLineNumber(code, /(?:concat|extend|copy|slice|flush|nums\[k\])/i, 12, lineMergePlace);
    const lineReturn = findLineNumber(code, /return/i, 14);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function mergeSort(nums) with ${n} elements.`,
      array: [...nums],
      activeIndices: [],
      subArrayRange: [0, n - 1],
      status: "idle",
      vars: { n },
    });

    function mergeSortHelper(arr: number[], left: number, right: number) {
      if (left >= right) return;

      const mid = Math.floor(left + (right - left) / 2);

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineDivide,
        description: `Dividing sub-array [index ${left} .. ${right}]: mid = ${mid}. Left range: [${left}..${mid}], Right range: [${mid + 1}..${right}].`,
        array: [...arr],
        activeIndices: [left, right],
        subArrayRange: [left, right],
        subArrayRanges: [
          { range: [left, mid], label: "Left Sub-Array", color: "cyan" },
          { range: [mid + 1, right], label: "Right Sub-Array", color: "purple" }
        ],
        status: "comparing",
        vars: { left, mid, right },
      });

      mergeSortHelper(arr, left, mid);
      mergeSortHelper(arr, mid + 1, right);

      // Merge phase
      const leftPart = arr.slice(left, mid + 1);
      const rightPart = arr.slice(mid + 1, right + 1);

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMergeCall,
        description: `Merging sorted sub-arrays: Left [${leftPart.join(", ")}] and Right [${rightPart.join(", ")}].`,
        array: [...arr],
        activeIndices: Array.from({ length: right - left + 1 }, (_, k) => left + k),
        subArrayRange: [left, right],
        subArrayRanges: [
          { range: [left, mid], label: "Left Part", color: "cyan" },
          { range: [mid + 1, right], label: "Right Part", color: "purple" }
        ],
        status: "merging",
        vars: { left, mid, right },
      });

      let i = 0;
      let j = 0;
      let k = left;

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMergeInit > 0 ? lineMergeInit : lineMergeHeader,
        description: `Initializing merge pointers: i = 0, j = 0, k = ${left}.`,
        array: [...arr],
        activeIndices: [left, right],
        subArrayRange: [left, right],
        subArrayRanges: [
          { range: [left, mid], label: "Left Part", color: "cyan" },
          { range: [mid + 1, right], label: "Right Part", color: "purple" }
        ],
        status: "merging",
        vars: { i: 0, j: 0, k: left, left, mid, right },
      });

      while (i < leftPart.length && j < rightPart.length) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMergeCompare > lineMergeHeader ? lineMergeCompare : (lineMergeLoop > 0 ? lineMergeLoop : lineMergeCall),
          description: `Comparing left element ${leftPart[i]} with right element ${rightPart[j]}.`,
          array: [...arr],
          activeIndices: [left + i, mid + 1 + j],
          subArrayRange: [left, right],
          subArrayRanges: [
            { range: [left, mid], label: "Left Part", color: "cyan" },
            { range: [mid + 1, right], label: "Right Part", color: "purple" }
          ],
          status: "comparing",
          vars: { i, j, k, left, mid, right },
        });

        const placedVal = leftPart[i] <= rightPart[j] ? leftPart[i] : rightPart[j];
        const currentK = k;
        const currentI = i;
        const currentJ = j;

        if (leftPart[i] <= rightPart[j]) {
          arr[k] = leftPart[i];
          i++;
        } else {
          arr[k] = rightPart[j];
          j++;
        }

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMergePlace > lineMergeHeader ? lineMergePlace : lineMergeCompare,
          description: `Placed element ${placedVal} into merged position index ${currentK}.`,
          array: [...arr],
          activeIndices: [currentK],
          subArrayRange: [left, right],
          subArrayRanges: [
            { range: [left, mid], label: "Left Part", color: "cyan" },
            { range: [mid + 1, right], label: "Right Part", color: "purple" }
          ],
          status: "merging",
          vars: { i: currentI, j: currentJ, k: currentK, left, mid, right },
        });

        k++;
      }

      while (i < leftPart.length) {
        arr[k] = leftPart[i];

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMergeFlush > lineMergeHeader ? lineMergeFlush : lineMergePlace,
          description: `Flushing remaining left element ${leftPart[i]} to index ${k}.`,
          array: [...arr],
          activeIndices: [k],
          subArrayRange: [left, right],
          subArrayRanges: [
            { range: [left, mid], label: "Left Part", color: "cyan" },
            { range: [mid + 1, right], label: "Right Part", color: "purple" }
          ],
          status: "merging",
          vars: { i, j, k },
        });

        i++;
        k++;
      }

      while (j < rightPart.length) {
        arr[k] = rightPart[j];

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMergeFlush > lineMergeHeader ? lineMergeFlush : lineMergePlace,
          description: `Flushing remaining right element ${rightPart[j]} to index ${k}.`,
          array: [...arr],
          activeIndices: [k],
          subArrayRange: [left, right],
          subArrayRanges: [
            { range: [left, mid], label: "Left Part", color: "cyan" },
            { range: [mid + 1, right], label: "Right Part", color: "purple" }
          ],
          status: "merging",
          vars: { i, j, k },
        });

        j++;
        k++;
      }
    }

    mergeSortHelper(nums, 0, n - 1);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturn,
      description: `Merge sort complete! Final sorted array: [${nums.join(", ")}].`,
      array: [...nums],
      activeIndices: [],
      status: "sorted",
      vars: { n },
    });

    return steps;
  },
};
