/**
 * Shared utility functions for simulator modules.
 * This file has NO imports from simulator.ts or simulators/index.ts to avoid circular deps.
 */

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
