export interface Step {
  stepNumber: number;
  lineNumber: number;
  description: string;
  array: number[];
  activeIndices: number[];
  foundIndex?: number;
  status: "idle" | "comparing" | "swapping" | "found" | "not_found" | "sorted";
  vars: Record<string, string | number>;
}

/**
 * Searches code string for exact statement pattern to resolve dynamic line numbers.
 */
export function findLineNumber(
  code: string | undefined,
  pattern: RegExp | string,
  defaultLine: number,
  startAfterLine = 1
): number {
  if (!code) return defaultLine;
  const lines = code.split("\n");
  for (let i = Math.max(0, startAfterLine - 1); i < lines.length; i++) {
    const line = lines[i];
    if (typeof pattern === "string") {
      if (line.includes(pattern)) return i + 1;
    } else if (pattern.test(line)) {
      return i + 1;
    }
  }
  return defaultLine;
}

/**
 * Ensures strict line-by-line sequential execution steps with no skipped lines.
 * If two steps jump across line numbers (e.g. from line 4 to line 8),
 * intermediate steps are filled for lines 5, 6, 7 so Monaco highlights every line in order.
 */
function fillSequentialLineSteps(steps: Step[], code?: string): Step[] {
  if (!code || steps.length <= 1) return steps;
  const result: Step[] = [];
  const lines = code.split("\n");

  for (let i = 0; i < steps.length; i++) {
    const currentStep = steps[i];
    const prevStep = result[result.length - 1];

    if (
      prevStep &&
      prevStep.lineNumber > 0 &&
      currentStep.lineNumber > prevStep.lineNumber + 1 &&
      currentStep.lineNumber <= lines.length
    ) {
      const start = prevStep.lineNumber + 1;
      const end = currentStep.lineNumber - 1;

      for (let line = start; line <= end; line++) {
        const lineContent = (lines[line - 1] || "").trim();
        if (lineContent === "" || lineContent === "}") continue;

        result.push({
          stepNumber: result.length + 1,
          lineNumber: line,
          description: `Executing line ${line}: ${lineContent}`,
          array: [...currentStep.array],
          activeIndices: [...currentStep.activeIndices],
          status: currentStep.status === "swapping" ? "comparing" : currentStep.status,
          vars: { ...currentStep.vars },
        });
      }
    }

    result.push({
      ...currentStep,
      stepNumber: result.length + 1,
    });
  }

  return result;
}

export function generateSteps(
  algoId: string,
  inputArray: number[],
  target: number,
  code?: string,
  startLineNumber?: number,
  isLineByLine = true
): Step[] {
  const steps: Step[] = [];
  let stepCount = 1;
  const algoLower = algoId.toLowerCase();

  // Driver invocation step if call line is known
  if (startLineNumber && startLineNumber > 0) {
    steps.push({
      stepNumber: stepCount++,
      lineNumber: startLineNumber,
      description: `Driver Call: Invoking ${algoId} on array [${inputArray.join(
        ", "
      )}]${target !== undefined ? ` with target ${target}` : ""}.`,
      array: [...inputArray],
      activeIndices: [],
      status: "idle",
      vars: { target },
    });
  }

  // 1. INTERPOLATION SEARCH
  if (algoLower.includes("interpolation")) {
    const nums = [...inputArray].sort((a, b) => a - b);
    let low = 0;
    let high = nums.length - 1;

    const lineHeader = findLineNumber(
      code,
      /(?:interpolationSearch|interpolation_search|InterpolationSearch)/,
      1
    );
    const lineInit = findLineNumber(code, /(?:low|left)\s*=\s*0/, 2);
    const lineLoop = findLineNumber(
      code,
      /while\s*\(?\s*(?:low|left)\s*<=/,
      3
    );
    const lineEqualCheck = findLineNumber(
      code,
      /if\s*\(?\s*(?:low|left)\s*==\s*(?:high|right)/,
      4
    );
    const linePos = findLineNumber(code, /(?:pos|position)\s*=/, 5);
    const lineMatch = findLineNumber(
      code,
      /if\s*\(?.*(?:pos|position).*(?:==|===).*target/,
      6
    );
    const lineMoveRight = findLineNumber(
      code,
      /(?:low|left)\s*=\s*(?:pos|position)\s*\+\s*1/,
      7
    );
    const lineMoveLeft = findLineNumber(
      code,
      /(?:high|right)\s*=\s*(?:pos|position)\s*-\s*1/,
      8
    );
    const lineReturnNotFound = findLineNumber(code, /return\s+-\s*1|-1$/, 9);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function interpolationSearch(nums, target = ${target}).`,
      array: [...nums],
      activeIndices: [low, high],
      status: "idle",
      vars: { low, high, target },
    });

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineInit,
      description: `Initializing search bounds: low = 0, high = ${high}. Array sorted: [${nums.join(
        ", "
      )}].`,
      array: [...nums],
      activeIndices: [low, high],
      status: "idle",
      vars: { low, high, target },
    });

    while (low <= high && target >= nums[low] && target <= nums[high]) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineLoop,
        description: `Evaluating loop condition: low (${low}) <= high (${high}) and target ${target} in range [${nums[low]}, ${nums[high]}].`,
        array: [...nums],
        activeIndices: [low, high],
        status: "comparing",
        vars: { low, high, target },
      });

      if (low === high) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineEqualCheck,
          description: `low == high (${low}). Checking if nums[${low}] (${nums[low]}) == target (${target}).`,
          array: [...nums],
          activeIndices: [low],
          status: nums[low] === target ? "found" : "not_found",
          vars: { low, high, target },
        });

        if (nums[low] === target) {
          steps.push({
            stepNumber: stepCount++,
            lineNumber: lineEqualCheck + 1,
            description: `Target ${target} found at index ${low}! Returning index ${low}.`,
            array: [...nums],
            activeIndices: [low],
            foundIndex: low,
            status: "found",
            vars: { low, high, pos: low, target },
          });
          return steps;
        }
        break;
      }

      const pos =
        low +
        Math.floor(
          ((high - low) / (nums[high] - nums[low])) * (target - nums[low])
        );

      steps.push({
        stepNumber: stepCount++,
        lineNumber: linePos,
        description: `Calculating position estimate: pos = ${low} + Math.floor(((${high} - ${low}) / (${nums[high]} - ${nums[low]})) * (${target} - ${nums[low]})) = ${pos}.`,
        array: [...nums],
        activeIndices: [pos],
        status: "comparing",
        vars: { low, high, pos, "nums[pos]": nums[pos], target },
      });

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMatch,
        description: `Comparing element at estimated pos ${pos}: nums[${pos}] (${nums[pos]}) with target (${target}).`,
        array: [...nums],
        activeIndices: [pos],
        status: nums[pos] === target ? "found" : "comparing",
        vars: { low, high, pos, "nums[pos]": nums[pos], target },
      });

      if (nums[pos] === target) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMatch,
          description: `Match found! nums[${pos}] (${nums[pos]}) == target (${target}). Returning index ${pos}.`,
          array: [...nums],
          activeIndices: [pos],
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
          description: `nums[${pos}] (${nums[pos]}) < target (${target}). Updating low = pos + 1 = ${
            pos + 1
          }.`,
          array: [...nums],
          activeIndices: [pos],
          status: "comparing",
          vars: { low: pos + 1, high, pos, target },
        });
        low = pos + 1;
      } else {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMoveLeft,
          description: `nums[${pos}] (${nums[pos]}) > target (${target}). Updating high = pos - 1 = ${
            pos - 1
          }.`,
          array: [...nums],
          activeIndices: [pos],
          status: "comparing",
          vars: { low, high: pos - 1, pos, target },
        });
        high = pos - 1;
      }
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturnNotFound,
      description: `Target ${target} not found in array. Returning -1.`,
      array: [...nums],
      activeIndices: [],
      status: "not_found",
      vars: { low, high, target },
    });
    return steps;
  }

  // 2. LINEAR SEARCH
  if (algoLower.includes("linear")) {
    const nums = [...inputArray];

    const lineHeader = findLineNumber(
      code,
      /(?:linearSearch|linear_search|LinearSearch)/,
      1
    );
    const lineLoop = findLineNumber(
      code,
      /for\s*\(?.*i\s*=|for\s+[a-zA-Z0-9_]+\s+in/,
      2
    );
    const lineMatch = findLineNumber(
      code,
      /if\s*\(?.*(?:==|===).*target/,
      3
    );
    const lineReturnFound = findLineNumber(
      code,
      /return\s+(?:i|index|low|pos)/,
      4
    );
    const lineReturnNotFound = findLineNumber(code, /return\s+-\s*1|-1$/, 6);

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
        description: `Loop iteration i = ${i}. Checking bounds i < nums.length (${nums.length}).`,
        array: [...nums],
        activeIndices: [i],
        status: "comparing",
        vars: { i, "nums[i]": nums[i], target },
      });

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMatch,
        description: `Comparing nums[${i}] (${nums[i]}) == target (${target})?`,
        array: [...nums],
        activeIndices: [i],
        status: nums[i] === target ? "found" : "comparing",
        vars: { i, "nums[i]": nums[i], target },
      });

      if (nums[i] === target) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineReturnFound,
          description: `Match found! nums[${i}] == ${target}. Returning index ${i}.`,
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
      description: `Loop finished. Target ${target} not found in array. Returning -1.`,
      array: [...nums],
      activeIndices: [],
      status: "not_found",
      vars: { target },
    });
    return steps;
  }

  // 3. BINARY SEARCH
  if (algoLower.includes("binary")) {
    const nums = [...inputArray].sort((a, b) => a - b);
    let left = 0;
    let right = nums.length - 1;

    const lineHeader = findLineNumber(
      code,
      /(?:binarySearch|binary_search|BinarySearch)/,
      1
    );
    const lineInit = findLineNumber(code, /(?:left|low)\s*=\s*0/, 2);
    const lineLoop = findLineNumber(
      code,
      /while\s*\(?\s*(?:left|low)\s*<=/,
      3
    );
    const lineMid = findLineNumber(code, /(?:mid|middle)\s*=/, 4);
    const lineMatch = findLineNumber(
      code,
      /if\s*\(?.*(?:mid|middle).*(?:==|===).*target/,
      5
    );
    const lineMoveRight = findLineNumber(
      code,
      /(?:left|low)\s*=\s*(?:mid|middle)\s*\+\s*1/,
      6
    );
    const lineMoveLeft = findLineNumber(
      code,
      /(?:right|high)\s*=\s*(?:mid|middle)\s*-\s*1/,
      7
    );
    const lineReturnNotFound = findLineNumber(code, /return\s+-\s*1|-1$/, 8);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function binarySearch(nums, target = ${target}).`,
      array: [...nums],
      activeIndices: [left, right],
      status: "idle",
      vars: { left, right, target },
    });

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineInit,
      description: `Initializing search pointers: left = 0, right = ${right}. Array sorted: [${nums.join(
        ", "
      )}].`,
      array: [...nums],
      activeIndices: [left, right],
      status: "idle",
      vars: { left, right, target },
    });

    while (left <= right) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineLoop,
        description: `Checking loop condition: left (${left}) <= right (${right}).`,
        array: [...nums],
        activeIndices: [left, right],
        status: "comparing",
        vars: { left, right, target },
      });

      const mid = Math.floor(left + (right - left) / 2);

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMid,
        description: `Calculating mid index: mid = ${left} + (${right} - ${left}) / 2 = ${mid}. Element nums[${mid}] = ${nums[mid]}.`,
        array: [...nums],
        activeIndices: [mid],
        status: "comparing",
        vars: { left, right, mid, "nums[mid]": nums[mid], target },
      });

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineMatch,
        description: `Comparing element at mid index ${mid}: nums[${mid}] (${nums[mid]}) with target (${target}).`,
        array: [...nums],
        activeIndices: [mid],
        status: nums[mid] === target ? "found" : "comparing",
        vars: { left, right, mid, "nums[mid]": nums[mid], target },
      });

      if (nums[mid] === target) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMatch,
          description: `Target ${target} found at mid index ${mid}! Returning index ${mid}.`,
          array: [...nums],
          activeIndices: [mid],
          foundIndex: mid,
          status: "found",
          vars: { left, right, mid, target },
        });
        return steps;
      }

      if (nums[mid] < target) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMoveRight,
          description: `nums[${mid}] (${nums[mid]}) < target (${target}). Adjusting left = mid + 1 = ${
            mid + 1
          }.`,
          array: [...nums],
          activeIndices: [mid],
          status: "comparing",
          vars: { left: mid + 1, right, mid, target },
        });
        left = mid + 1;
      } else {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineMoveLeft,
          description: `nums[${mid}] (${nums[mid]}) > target (${target}). Adjusting right = mid - 1 = ${
            mid - 1
          }.`,
          array: [...nums],
          activeIndices: [mid],
          status: "comparing",
          vars: { left, right: mid - 1, mid, target },
        });
        right = mid - 1;
      }
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineReturnNotFound,
      description: `left > right. Target ${target} not found in array. Returning -1.`,
      array: [...nums],
      activeIndices: [],
      status: "not_found",
      vars: { left, right, target },
    });
    return steps;
  }

  // 4. GENERAL / SORTING ALGORITHMS (Bubble Sort, etc.)
  const nums = [...inputArray];
  const n = nums.length;

  const lineHeader = findLineNumber(
    code,
    /(?:sort|Sort|Solution|bubbleSort|selectionSort|quickSort)/,
    1
  );
  const lineOuterLoop = findLineNumber(code, /for\s*\(?.*i\s*=/, 2);
  const lineInnerLoop = findLineNumber(code, /for\s*\(?.*j\s*=/, 3);
  const lineCompare = findLineNumber(code, /if\s*\(?.*(?:>|<|swap)/, 4);
  const lineSwap = findLineNumber(code, /(?:swap|\[j\]\s*=|\^=)/, 5);
  const lineReturnSorted = findLineNumber(code, /return/, 6);

  steps.push({
    stepNumber: stepCount++,
    lineNumber: lineHeader,
    description: `Starting ${algoId} algorithm on array [${nums.join(", ")}].`,
    array: [...nums],
    activeIndices: [],
    status: "idle",
    vars: { n },
  });

  steps.push({
    stepNumber: stepCount++,
    lineNumber: lineOuterLoop,
    description: `Outer loop initialized for sorting ${n} elements.`,
    array: [...nums],
    activeIndices: [],
    status: "idle",
    vars: { n },
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineInnerLoop,
        description: `Inner loop iteration: j = ${j}. Comparing adjacent elements at index ${j} and ${
          j + 1
        }.`,
        array: [...nums],
        activeIndices: [j, j + 1],
        status: "comparing",
        vars: { i, j, "nums[j]": nums[j], "nums[j+1]": nums[j + 1] },
      });

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineCompare,
        description: `Comparing nums[${j}] (${nums[j]}) > nums[${j + 1}] (${
          nums[j + 1]
        }).`,
        array: [...nums],
        activeIndices: [j, j + 1],
        status: "comparing",
        vars: { i, j, "nums[j]": nums[j], "nums[j+1]": nums[j + 1] },
      });

      if (nums[j] > nums[j + 1]) {
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
        swapped = true;

        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineSwap,
          description: `Swapped nums[${j}] and nums[${j + 1}]. Array state is now [${nums.join(
            ", "
          )}].`,
          array: [...nums],
          activeIndices: [j, j + 1],
          status: "swapping",
          vars: { i, j, "nums[j]": nums[j], "nums[j+1]": nums[j + 1] },
        });
      }
    }
    if (!swapped) break;
  }

  steps.push({
    stepNumber: stepCount++,
    lineNumber: lineReturnSorted,
    description: `Sorting complete! Final sorted array: [${nums.join(", ")}].`,
    array: [...nums],
    activeIndices: [],
    status: "sorted",
    vars: { n },
  });

  return isLineByLine ? fillSequentialLineSteps(steps, code) : steps;
}
