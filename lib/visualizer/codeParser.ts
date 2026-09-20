/**
 * Code Parser utility to extract function calls and array inputs directly from editor code.
 */

export interface ParsedInstance {
  id: string;
  name: string;
  rawCall: string;
  array: number[];
  target?: number;
  lineNumber?: number;
}

/**
 * Parses code string to find algorithm function call instances and array inputs.
 */
export function parseCodeInstances(
  code: string,
  algorithmId: string,
  category: string
): ParsedInstance[] {
  const instances: ParsedInstance[] = [];
  const lines = code.split("\n");

  // Map of variable name -> number[]
  const declaredArrays: Record<string, number[]> = {};

  // 1. Scan lines for array variable declarations across all 18 programming languages
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Matches:
    // C/C++: int arr[] = {9, 2, 10}; | vector<int> arr = {9, 2, 10};
    // Java/C#: int[] arr = {9, 2, 10};
    // Python/JS/TS/Swift/Ruby: arr = [9, 2, 10] | const arr = [9, 2, 10]
    // PHP: $arr = [9, 2, 10];
    // Go: arr := []int{9, 2, 10}
    // Rust: let arr = vec![9, 2, 10];
    // Kotlin: val arr = intArrayOf(9, 2, 10)
    // R: arr <- c(9, 2, 10)
    const declRegex =
      /(?:\$|var\s+|val\s+|let\s+(?:mut\s+)?|const\s+|int\s*\[\]\s*|int\s+|vector<int>\s+)?([a-zA-Z0-9_\$]+)\s*(?:\[\]|\[\d+\])?\s*(?:=|\s*:=|\s*<-)\s*(?:new\s+int\[\]|vec!|intArrayOf|c|Array)?\s*[{\[]([\d\s,.\-+]+)[}\]]/g;

    let match: RegExpExecArray | null;
    while ((match = declRegex.exec(trimmed)) !== null) {
      const rawVarName = match[1];
      const cleanVarName = rawVarName.replace(/^\$/, ""); // strip leading $ for PHP
      const numbersStr = match[2];
      const nums = numbersStr
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));

      if (nums.length > 0 && cleanVarName !== "return") {
        declaredArrays[cleanVarName] = nums;
        declaredArrays[rawVarName] = nums;
      }
    }
  });

  // 2. Scan lines for algorithm function calls
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Remove comment prefix for parsing if line contains call
    const cleanLine = trimmed.replace(/^\/\/\s*/, "").replace(/^#\s*/, "");

    // Skip declaration headers like `int linearSearch(...) {` or `def linear_search(...)`
    const isHeaderLine =
      /^(?:public\s+|private\s+|protected\s+|static\s+|pub\s+)*(?:def\s+|func\s+|fn\s+|function\s+|sub\s+|int\s+|void\s+|double\s+|float\s+|class\s+|var\s+[a-zA-Z0-9_]+\s*=\s*function|let\s+[a-zA-Z0-9_]+\s*=\s*function)/i.test(
        cleanLine
      ) || cleanLine.includes("{") || cleanLine.endsWith(":");

    if (isHeaderLine) return;

    // Matches identifier (or Method.identifier) followed by ( ... )
    const callRegex = /(?:[a-zA-Z0-9_]+::|[a-zA-Z0-9_]+\.)?([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g;
    let callMatch: RegExpExecArray | null;

    while ((callMatch = callRegex.exec(cleanLine)) !== null) {
      const fnName = callMatch[1];
      const argsStr = callMatch[2];
      const fnLower = fnName.toLowerCase().replace(/_/g, "");
      const algoLower = algorithmId.toLowerCase().replace(/_/g, "");

      // Ignore language keywords
      if (
        [
          "if",
          "for",
          "while",
          "switch",
          "catch",
          "return",
          "sizeof",
          "printf",
          "console",
          "println",
          "print",
          "len",
          "vec",
          "array",
          "int",
          "double",
          "float",
        ].includes(fnLower)
      ) {
        continue;
      }

      const isAlgoCall =
        fnLower.includes("search") ||
        fnLower.includes("sort") ||
        fnLower.includes(algoLower) ||
        algoLower.includes(fnLower);

      if (!isAlgoCall) continue;

      let array: number[] = [];
      let target: number | undefined = undefined;

      // Extract inline array literal [9, 2, 10] or {9, 2, 10}
      const inlineArrayMatch = /[{\[]([\d\s,.\-+]+)[}\]]/.exec(argsStr);
      if (inlineArrayMatch) {
        array = inlineArrayMatch[1]
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
      } else {
        // Look up variable reference e.g. (nums1, 9)
        const argsParts = argsStr.split(",").map((s) => s.trim().replace(/^\$/, ""));
        for (const part of argsParts) {
          if (declaredArrays[part]) {
            array = declaredArrays[part];
            break;
          }
        }
      }

      // Extract numeric args for size/target
      const numericArgs = argsStr
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));

      if (category === "Searching") {
        if (numericArgs.length > 0) {
          target = numericArgs[numericArgs.length - 1];
        }
      }

      if (array.length > 0) {
        const targetStr = category === "Searching" && target !== undefined ? `, ${target}` : "";
        const rawCall = `${fnName}([${array.join(", ")}]${targetStr})`;
        instances.push({
          id: `inst-${instances.length + 1}`,
          name: `Call #${instances.length + 1}: ${rawCall}`,
          rawCall,
          array,
          target: target ?? 9,
          lineNumber: idx + 1,
        });
      }
    }
  });

  // Fallback: If no explicit calls were found in user code, create default calls
  if (instances.length === 0) {
    if (category === "Searching") {
      instances.push({
        id: "inst-default-1",
        name: `Call #1: ${algorithmId}([9, 2, 10], 9)`,
        rawCall: `${algorithmId}([9, 2, 10], 9)`,
        array: [9, 2, 10],
        target: 9,
      });
      instances.push({
        id: "inst-default-2",
        name: `Call #2: ${algorithmId}([1, 4, 7, 9, 12], 7)`,
        rawCall: `${algorithmId}([1, 4, 7, 9, 12], 7)`,
        array: [1, 4, 7, 9, 12],
        target: 7,
      });
    } else {
      instances.push({
        id: "inst-default-1",
        name: `Call #1: ${algorithmId}([9, 2, 10])`,
        rawCall: `${algorithmId}([9, 2, 10])`,
        array: [9, 2, 10],
      });
      instances.push({
        id: "inst-default-2",
        name: `Call #2: ${algorithmId}([5, 1, 4, 2, 8])`,
        rawCall: `${algorithmId}([5, 1, 4, 2, 8])`,
        array: [5, 1, 4, 2, 8],
      });
    }
  }

  return instances;
}
