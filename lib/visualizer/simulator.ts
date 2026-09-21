import { Step, StepStatus, SubArrayRange } from "./simulators/types";
import { findLineNumber } from "./simulators/utils";

// Re-export for backward compatibility (other parts of the app import from here)
export type { Step, StepStatus, SubArrayRange };
export { findLineNumber };

/**
 * Ensures strict line-by-line sequential execution steps with no skipped lines.
 */
export function fillSequentialLineSteps(steps: Step[], code?: string): Step[] {
  if (!code || steps.length <= 1) return steps;
  const result: Step[] = [];
  const lines = code.split("\n");

  for (let i = 0; i < steps.length; i++) {
    const currentStep = steps[i];
    const prevStep = result[result.length - 1];

    if (prevStep && prevStep.lineNumber > 0 && currentStep.lineNumber > 0) {
      // Case 1: Forward jump across intermediate lines (e.g. L5 -> L8)
      if (
        currentStep.lineNumber > prevStep.lineNumber + 1 &&
        currentStep.lineNumber <= lines.length
      ) {
        const start = prevStep.lineNumber + 1;
        const end = currentStep.lineNumber - 1;

        for (let line = start; line <= end; line++) {
          const lineContent = (lines[line - 1] || "").trim();
          if (
            !lineContent ||
            lineContent === "}" ||
            lineContent === "{" ||
            lineContent.startsWith("//") ||
            lineContent.startsWith("#")
          ) {
            continue;
          }

          result.push({
            stepNumber: result.length + 1,
            lineNumber: line,
            description: `Executing line ${line}: ${lineContent}`,
            array: [...prevStep.array],
            activeIndices: [...prevStep.activeIndices],
            status: prevStep.status === "swapping" ? "comparing" : prevStep.status,
            vars: { ...prevStep.vars },
          });
        }
      }
      // Case 2: Backward jump (e.g. L8 -> L5), execute remaining statement lines in current block (e.g. L9, L10) first!
      else if (
        currentStep.lineNumber < prevStep.lineNumber &&
        prevStep.lineNumber < lines.length
      ) {
        let endBlock = prevStep.lineNumber;
        for (let line = prevStep.lineNumber + 1; line <= lines.length; line++) {
          const lineContent = (lines[line - 1] || "").trim();
          if (
            lineContent === "}" ||
            !lineContent ||
            lineContent.startsWith("return") ||
            lineContent.startsWith("break;") ||
            lineContent.startsWith("for") ||
            lineContent.startsWith("while") ||
            lineContent.startsWith("if") ||
            lineContent.startsWith("//") ||
            lineContent.startsWith("#")
          ) {
            break;
          }
          endBlock = line;
        }

        if (endBlock > prevStep.lineNumber) {
          for (let line = prevStep.lineNumber + 1; line <= endBlock; line++) {
            const lineContent = (lines[line - 1] || "").trim();
            if (
              !lineContent ||
              lineContent === "}" ||
              lineContent === "{" ||
              lineContent.startsWith("//") ||
              lineContent.startsWith("#")
            ) {
              continue;
            }

            result.push({
              stepNumber: result.length + 1,
              lineNumber: line,
              description: `Executing line ${line}: ${lineContent}`,
              array: [...prevStep.array],
              activeIndices: [...prevStep.activeIndices],
              status: prevStep.status === "swapping" ? "comparing" : prevStep.status,
              vars: { ...prevStep.vars },
            });
          }
        }
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
  // Lazy import to break circular dependency at module load time
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getSimulator } = require("./simulators") as { getSimulator: (id: string) => import("./simulators/types").AlgorithmSimulator | undefined };

  const simulator = getSimulator(algoId);

  let steps: Step[] = [];
  if (simulator) {
    steps = simulator.generateSteps(inputArray, target, code, startLineNumber, isLineByLine);
  } else {
    steps = [
      {
        stepNumber: 1,
        lineNumber: startLineNumber || 1,
        description: `Starting ${algoId} on array [${inputArray.join(", ")}].`,
        array: [...inputArray],
        activeIndices: [],
        status: "idle",
        vars: { target },
      },
    ];
  }

  return isLineByLine ? fillSequentialLineSteps(steps, code) : steps;
}
