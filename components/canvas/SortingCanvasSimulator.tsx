"use client";

import React, { useRef, useEffect } from "react";
import { Step } from "@/lib/visualizer/simulator";

interface SortingCanvasSimulatorProps {
  steps: Step[];
  currentStepIndex: number;
  isDarkMode: boolean;
  algorithmId: string;
  speed?: number;
  animSpeed?: number;
}

const COLOR_MAP: Record<string, { fill: string; stroke: string; text: string }> = {
  i: { fill: "#0284c7", stroke: "#38bdf8", text: "#ffffff" },
  j: { fill: "#d97706", stroke: "#fbbf24", text: "#ffffff" },
  k: { fill: "#9333ea", stroke: "#c084fc", text: "#ffffff" },
  pivot: { fill: "#e11d48", stroke: "#f43f5e", text: "#ffffff" },
  minidx: { fill: "#4f46e5", stroke: "#818cf8", text: "#ffffff" },
};

function getPointerColor(varName: string) {
  const key = varName.toLowerCase().trim();
  return COLOR_MAP[key] || { fill: "#db2777", stroke: "#f472b6", text: "#ffffff" };
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.closePath();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawOperatorBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  op: string,
  colorScheme: { stroke: string; startDot: string; endDot: string },
  isDarkMode = true
) {
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.font = "bold 11px monospace";
  const textWidth = ctx.measureText(op).width;
  const badgeWidth = Math.max(22, textWidth + 10);
  const badgeHeight = 18;
  const rx = cx - badgeWidth / 2;
  const ry = cy - badgeHeight / 2;

  // Background pill
  drawRoundRect(ctx, rx, ry, badgeWidth, badgeHeight, 6);
  ctx.fillStyle = isDarkMode ? "#171717" : "#ffffff";
  ctx.fill();

  // Border stroke matching comparison line color
  ctx.strokeStyle = colorScheme.stroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Text
  ctx.fillStyle = isDarkMode ? "#ffffff" : "#0f172a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(op, cx, cy + 0.5);

  ctx.restore();
}

/**
 * Draws straight orthogonal lines with rounded corners for dynamic comparison bridging.
 * Solid colors without neon blur shadow.
 */
function drawOrthogonalDashedBridge(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  topY: number,
  dashOffset: number,
  colorScheme: { stroke: string; startDot: string; endDot: string },
  radius = 12,
  operatorSymbol?: string,
  isDarkMode = true
) {
  ctx.save();
  ctx.shadowBlur = 0;

  const isLeftFirst = x1 <= x2;
  const leftX = isLeftFirst ? x1 : x2;
  const leftY = isLeftFirst ? y1 : y2;
  const rightX = isLeftFirst ? x2 : x1;
  const rightY = isLeftFirst ? y2 : y1;

  if (Math.abs(rightX - leftX) < 2) {
    // Vertical straight line to target
    ctx.beginPath();
    ctx.moveTo(leftX, leftY);
    ctx.lineTo(leftX, topY);

    ctx.strokeStyle = colorScheme.stroke;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.lineDashOffset = dashOffset;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(leftX, leftY, 5, 0, Math.PI * 2);
    ctx.fillStyle = colorScheme.startDot;
    ctx.fill();

    if (operatorSymbol) {
      drawOperatorBadge(ctx, leftX, (leftY + topY) / 2, operatorSymbol, colorScheme, isDarkMode);
    }

    ctx.restore();
    return;
  }

  const r = Math.min(radius, Math.abs(rightX - leftX) / 2, Math.abs(Math.min(leftY, rightY) - topY) / 2);

  const grad = ctx.createLinearGradient(leftX, topY, rightX, topY);
  grad.addColorStop(0, colorScheme.startDot);
  grad.addColorStop(1, colorScheme.endDot);

  ctx.beginPath();
  ctx.moveTo(leftX, leftY);
  ctx.lineTo(leftX, topY + r);
  ctx.quadraticCurveTo(leftX, topY, leftX + r, topY);
  ctx.lineTo(rightX - r, topY);
  ctx.quadraticCurveTo(rightX, topY, rightX, topY + r);
  ctx.lineTo(rightX, rightY);

  ctx.strokeStyle = grad;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = dashOffset;
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.arc(x1, y1, 5, 0, Math.PI * 2);
  ctx.fillStyle = colorScheme.startDot;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x2, y2, 5, 0, Math.PI * 2);
  ctx.fillStyle = colorScheme.endDot;
  ctx.fill();

  if (operatorSymbol) {
    const midX = (leftX + rightX) / 2;
    drawOperatorBadge(ctx, midX, topY, operatorSymbol, colorScheme, isDarkMode);
  }

  ctx.restore();
}

function isCleanPointerName(key: string): boolean {
  const k = key.trim().toLowerCase();
  if (k.includes("[") || k.includes("]") || k.includes("(")) return false;
  if (k.startsWith("arr") || k.startsWith("num") || k.startsWith("element") || k.startsWith("val")) return false;
  return true;
}

export const SortingCanvasSimulator: React.FC<SortingCanvasSimulatorProps> = ({
  steps = [],
  currentStepIndex = 0,
  isDarkMode = true,
  algorithmId = "SortAlgorithm",
  speed = 1000,
  animSpeed = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dashOffsetRef = useRef<number>(0);
  const swapProgressRef = useRef<number>(0);
  const animatedPointerXRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    swapProgressRef.current = 0; // reset swap progress on step change

    const render = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Background fill
      ctx.fillStyle = isDarkMode ? "#000000" : "#ffffff";
      ctx.fillRect(0, 0, width, height);

      if (!steps || steps.length === 0) {
        ctx.fillStyle = "#a3a3a3";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("No sorting steps generated.", width / 2, height / 2);
        return;
      }

      const step = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];
      const isComparing = step.status === "comparing";
      const isSwapping = step.status === "swapping";
      const isSorted = step.status === "sorted";

      // Dynamic animation rates scaling with transition speed and animSpeed multiplier
      const speedMs = speed || 1000;
      const rateMult = animSpeed || 1.0;
      const lerpFactor = Math.min(0.5, Math.max(0.02, (120 / speedMs) * rateMult));
      const dashFactor = Math.min(3.0, Math.max(0.1, (500 / speedMs) * rateMult));
      const swapProgressFactor = Math.min(0.2, Math.max(0.005, (25 / speedMs) * rateMult));

      dashOffsetRef.current -= dashFactor;



      // 2. Sorting Height Bars Canvas Render
      const cardCount = step.array.length;
      const barWidth = 54;
      const gap = 18;
      const totalWidth = cardCount * barWidth + (cardCount - 1) * gap;
      const startX = (width - totalWidth) / 2;
      const baselineY = height / 2 + 50;

      const maxVal = Math.max(...step.array, 1);

      // Advance swap animation progress smooth 0 -> 1
      if (swapProgressRef.current < 1) {
        swapProgressRef.current = Math.min(1, swapProgressRef.current + swapProgressFactor);
      }
      const progress = swapProgressRef.current;

      // Calculate smooth lerped X positions for active clean pointers
      const pointerVars = Object.entries(step.vars).filter(
        ([key, val]) => isCleanPointerName(key) && typeof val === "number" && val >= 0 && val < step.array.length
      );

      pointerVars.forEach(([key, val]) => {
        const targetX = startX + (val as number) * (barWidth + gap) + barWidth / 2;
        if (animatedPointerXRef.current[key] === undefined) {
          animatedPointerXRef.current[key] = targetX;
        } else {
          animatedPointerXRef.current[key] += (targetX - animatedPointerXRef.current[key]) * lerpFactor;
        }
      });

      const cardCenters: { x: number; y: number }[] = [];
      const barTops: number[] = [];

      step.array.forEach((val, idx) => {
        let displayVal = val;
        let animateCx = startX + idx * (barWidth + gap);
        let animateCy = baselineY;

        const activePointersAtIdx = pointerVars.filter(([, v]) => v === idx);

        // Physical 3D X/Y Arc Swap Animation during swap
        if (isSwapping && step.activeIndices.length >= 2) {
          const i1 = step.activeIndices[0];
          const i2 = step.activeIndices[1];
          const cardDistance = barWidth + gap;

          if (idx === i1) {
            // At idx i1, display the pre-swap value (step.array[i2]) as it arcs from i1 to i2
            displayVal = step.array[i2];
            animateCx += (i2 - i1) * cardDistance * progress;
            animateCy -= 28 * Math.sin(progress * Math.PI); // Arcs UP
          } else if (idx === i2) {
            // At idx i2, display the pre-swap value (step.array[i1]) as it arcs from i2 to i1
            displayVal = step.array[i1];
            animateCx += (i1 - i2) * cardDistance * progress;
            animateCy += 28 * Math.sin(progress * Math.PI); // Arcs DOWN
          }
        }

        const barHeight = Math.max(48, Math.min(130, Math.floor((displayVal / maxVal) * 110)));
        const topY = animateCy - barHeight;

        const centerX = animateCx + barWidth / 2;
        const centerY = topY + barHeight / 2;
        cardCenters.push({ x: centerX, y: centerY });
        barTops.push(topY);

        let bg = isDarkMode ? "#171717" : "#f5f5f5";
        let stroke = isDarkMode ? "#374151" : "#d1d5db";
        let textCol = isDarkMode ? "#e5e5e5" : "#111827";

        if (isSorted) {
          bg = isDarkMode ? "#064e3b" : "#d1fae5";
          stroke = "#10b981";
          textCol = isDarkMode ? "#34d399" : "#047857";
        } else if (isSwapping && activePointersAtIdx.length > 0) {
          bg = isDarkMode ? "#7f1d1d" : "#fee2e2";
          stroke = "#ef4444";
          textCol = isDarkMode ? "#fca5a5" : "#b91c1c";
        } else if (activePointersAtIdx.length > 0) {
          const ptrName = activePointersAtIdx[0][0];
          const col = getPointerColor(ptrName);
          bg = col.fill;
          stroke = col.stroke;
          textCol = col.text;
        }

        // Sorting Height Bar Box (No Neon Shadow)
        ctx.shadowBlur = 0;
        drawRoundRect(ctx, animateCx, topY, barWidth, barHeight, 8);
        ctx.fillStyle = bg;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = activePointersAtIdx.length > 0 || isSorted || isSwapping ? 2.5 : 1.5;
        ctx.stroke();

        // Element Value
        ctx.fillStyle = textCol;
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.fillText(String(displayVal), centerX, centerY + 5);

        // Index Label
        ctx.fillStyle = "#9ca3af";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`[${idx}]`, centerX, baselineY + 16);
      });

      // Render Smooth Floating Pointer Badges BELOW Sorting Bars (Vertically stacked if multiple pointers target same index)
      const pointerStackMap: Record<string, number> = {};
      const targetIdxCounts: Record<number, number> = {};

      pointerVars.forEach(([key, val]) => {
        const targetIdx = val as number;
        const count = targetIdxCounts[targetIdx] || 0;
        pointerStackMap[key] = count;
        targetIdxCounts[targetIdx] = count + 1;
      });

      pointerVars.forEach(([key]) => {
        const posX = animatedPointerXRef.current[key];
        if (posX === undefined) return;

        const stackIndex = pointerStackMap[key] || 0;
        const badgeY = baselineY + 28 + stackIndex * 20;

        const col = getPointerColor(key);
        ctx.font = "bold 10px monospace";
        const labelText = key.toUpperCase();
        const bw = ctx.measureText(labelText).width + 12;

        ctx.shadowBlur = 0;
        drawRoundRect(ctx, posX - bw / 2, badgeY, bw, 16, 8);
        ctx.fillStyle = col.fill;
        ctx.fill();
        ctx.strokeStyle = col.stroke;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = col.text;
        ctx.textAlign = "center";
        ctx.fillText(labelText, posX, badgeY + 12);
      });

      // 3. Orthogonal Straight Dashed Bridge with Rounded Corners for Comparisons & Swaps
      if ((isComparing || isSwapping || step.status === "idle") && step.activeIndices.length > 0) {
        let i1: number | undefined = step.activeIndices[0];
        let i2: number | undefined = step.activeIndices[1];

        // If i2 is missing, resolve from step.vars (min_idx, pivot, j, key_idx, etc.)
        if (i2 === undefined && step.vars && i1 !== undefined) {
          const possibleKeys = [
            "min_idx",
            "minIdx",
            "min",
            "pivot_idx",
            "pivotIdx",
            "pivot",
            "j",
            "key_idx",
            "keyIdx",
            "right",
            "high",
          ];
          for (const k of possibleKeys) {
            if (step.vars[k] !== undefined) {
              const parsed = Number(step.vars[k]);
              if (!isNaN(parsed) && parsed >= 0 && parsed < step.array.length && parsed !== i1) {
                i2 = parsed;
                break;
              }
            }
          }
        }

        if (i1 !== undefined && i2 !== undefined && i1 !== i2) {
          const p1 = cardCenters[i1];
          const p2 = cardCenters[i2];
          const val1 = step.array[i1];
          const val2 = step.array[i2];
          const y1 = (barTops[i1] ?? baselineY - 60) - 2;
          const y2 = (barTops[i2] ?? baselineY - 60) - 2;

          if (p1 && p2) {
            dashOffsetRef.current -= 0.8;
            const topYBridge = Math.min(y1, y2) - 35;

            let colorScheme = {
              stroke: "#0284c7", // Solid Blue default
              startDot: "#0284c7",
              endDot: "#f59e0b",
            };

            // Determine comparison operator symbol
            let operatorSymbol = "==";
            const opMatch = step.description.match(/(===|==|!=|<=|>=|<|>)/);
            if (opMatch) {
              operatorSymbol = opMatch[0];
            } else if (val1 !== undefined && val2 !== undefined) {
              const num1 = Number(val1);
              const num2 = Number(val2);
              if (isSwapping || num1 > num2) {
                operatorSymbol = ">";
              } else if (num1 < num2) {
                operatorSymbol = "<";
              } else {
                operatorSymbol = "==";
              }
            }

            if (isSwapping || (val1 !== undefined && val2 !== undefined && val1 > val2)) {
              // Out of order (Swap Needed) -> Solid Rose Red
              colorScheme = {
                stroke: "#ef4444",
                startDot: "#ef4444",
                endDot: "#ef4444",
              };
            } else if (val1 !== undefined && val2 !== undefined && val1 <= val2) {
              // In order -> Solid Emerald Green
              colorScheme = {
                stroke: "#10b981",
                startDot: "#10b981",
                endDot: "#10b981",
              };
            }

            drawOrthogonalDashedBridge(
              ctx,
              p1.x,
              y1,
              p2.x,
              y2,
              topYBridge,
              dashOffsetRef.current,
              colorScheme,
              12,
              operatorSymbol,
              isDarkMode
            );
          }
        }
      }

      // 4. Status Badge (Text Only)
      const statusY = height - 125;
      if (isSorted) {
        ctx.fillStyle = "#34d399";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Array Fully Sorted", width / 2, statusY + 17);
      } else if (isSwapping) {
        ctx.fillStyle = "#f43f5e";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Swapping Elements in Mid-Air", width / 2, statusY + 17);
      }

      // 5. Live Variables Inspector (Filtered clean pointer variables)
      const varsY = height - 90;
      ctx.fillStyle = "#a3a3a3";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("SORTING STATE & VARIABLES:", 24, varsY);

      let vx = 24;
      Object.entries(step.vars)
        .filter(([key]) => isCleanPointerName(key))
        .forEach(([key, val]) => {
          const col = getPointerColor(key);
          const vText = `${key}: ${val}`;
          ctx.font = "bold 12px monospace";
          const vw = ctx.measureText(vText).width + 20;

          drawRoundRect(ctx, vx, varsY + 8, vw, 24, 6);
          ctx.fillStyle = col.fill;
          ctx.fill();
          ctx.strokeStyle = col.stroke;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = col.text;
          ctx.textAlign = "left";
          ctx.fillText(vText, vx + 10, varsY + 24);

          vx += vw + 10;
        });



      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [steps, currentStepIndex, isDarkMode, algorithmId, speed, animSpeed]);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
