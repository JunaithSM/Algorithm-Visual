"use client";

import React, { useRef, useEffect } from "react";
import { Step } from "@/lib/visualizer/simulator";

interface SearchingCanvasSimulatorProps {
  steps: Step[];
  currentStepIndex: number;
  isDarkMode: boolean;
  algorithmId: string;
  speed?: number;
  animSpeed?: number;
}

const COLOR_MAP: Record<string, { fill: string; stroke: string; text: string }> = {
  i: { fill: "#0284c7", stroke: "#38bdf8", text: "#ffffff" },
  low: { fill: "#0284c7", stroke: "#38bdf8", text: "#ffffff" },
  left: { fill: "#0284c7", stroke: "#38bdf8", text: "#ffffff" },
  j: { fill: "#d97706", stroke: "#fbbf24", text: "#ffffff" },
  high: { fill: "#d97706", stroke: "#fbbf24", text: "#ffffff" },
  right: { fill: "#d97706", stroke: "#fbbf24", text: "#ffffff" },
  k: { fill: "#9333ea", stroke: "#c084fc", text: "#ffffff" },
  mid: { fill: "#9333ea", stroke: "#c084fc", text: "#ffffff" },
  pos: { fill: "#9333ea", stroke: "#c084fc", text: "#ffffff" },
  target: { fill: "#059669", stroke: "#34d399", text: "#ffffff" },
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
 * Draws straight orthogonal lines with rounded corners connecting Target Box (x1, y1) to Array Card (x2, y2).
 * Solid colors without neon blur shadow.
 */
function drawTargetComparisonBridge(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dashOffset: number,
  colorScheme: { stroke: string; startDot: string; endDot: string },
  radius = 12,
  operatorSymbol?: string,
  isDarkMode = true
) {
  ctx.save();
  ctx.shadowBlur = 0;

  if (Math.abs(x1 - x2) < 4) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = colorScheme.stroke;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.lineDashOffset = dashOffset;
    ctx.stroke();
    ctx.setLineDash([]);

    [
      { x: x1, y: y1, col: colorScheme.startDot },
      { x: x2, y: y2, col: colorScheme.endDot },
    ].forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = pt.col;
      ctx.fill();
    });

    if (operatorSymbol) {
      drawOperatorBadge(ctx, (x1 + x2) / 2, (y1 + y2) / 2, operatorSymbol, colorScheme, isDarkMode);
    }

    ctx.restore();
    return;
  }

  const midY = (y1 + y2) / 2;
  const dirX = x2 > x1 ? 1 : -1;
  const dirY = y2 > y1 ? 1 : -1;
  const r = Math.min(radius, Math.abs(x2 - x1) / 2, Math.abs(y2 - y1) / 2);

  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, colorScheme.startDot);
  grad.addColorStop(1, colorScheme.endDot);

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1, midY - dirY * r);
  ctx.quadraticCurveTo(x1, midY, x1 + dirX * r, midY);
  ctx.lineTo(x2 - dirX * r, midY);
  ctx.quadraticCurveTo(x2, midY, x2, midY + dirY * r);
  ctx.lineTo(x2, y2);

  ctx.strokeStyle = grad;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = dashOffset;
  ctx.stroke();
  ctx.setLineDash([]);

  [
    { x: x1, y: y1, col: colorScheme.startDot },
    { x: x2, y: y2, col: colorScheme.endDot },
  ].forEach((pt) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = pt.col;
    ctx.fill();
  });

  if (operatorSymbol) {
    drawOperatorBadge(ctx, (x1 + x2) / 2, midY, operatorSymbol, colorScheme, isDarkMode);
  }

  ctx.restore();
}

function isCleanPointerName(key: string): boolean {
  const k = key.trim().toLowerCase();
  if (k.includes("[") || k.includes("]") || k.includes("(")) return false;
  if (k.startsWith("arr") || k.startsWith("num") || k.startsWith("element") || k.startsWith("val")) return false;
  return true;
}

export const SearchingCanvasSimulator: React.FC<SearchingCanvasSimulatorProps> = ({
  steps = [],
  currentStepIndex = 0,
  isDarkMode = true,
  algorithmId = "SearchAlgorithm",
  speed = 1000,
  animSpeed = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dashOffsetRef = useRef<number>(0);
  const animatedPointerXRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
        ctx.fillText("No searching steps generated.", width / 2, height / 2);
        return;
      }

      const step = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];
      const targetVal = step.vars.target ?? "N/A";
      const isComparing = step.status === "comparing";
      const isFound = step.status === "found";
      const isNotFound = step.status === "not_found";

      // Dynamic animation rates scaling with transition speed and animSpeed multiplier
      const speedMs = speed || 1000;
      const rateMult = animSpeed || 1.0;
      const lerpFactor = Math.min(0.5, Math.max(0.02, (120 / speedMs) * rateMult));
      const dashFactor = Math.min(3.0, Math.max(0.1, (500 / speedMs) * rateMult));



      // 2. Array Cards & Target Box Canvas Render
      const cardCount = step.array.length;
      const cardWidth = 56;
      const cardHeight = 56;
      const gap = 18;
      const totalWidth = cardCount * cardWidth + (cardCount - 1) * gap;
      const startX = (width - totalWidth) / 2;
      const cardsY = height / 2 + 10;

      // Target Card Box (Centered above Array Cards)
      const targetBoxW = 110;
      const targetBoxH = 46;
      const targetBoxX = width / 2 - targetBoxW / 2;
      const targetBoxY = cardsY - 85;

      ctx.shadowBlur = 0;
      drawRoundRect(ctx, targetBoxX, targetBoxY, targetBoxW, targetBoxH, 10);
      ctx.fillStyle = isDarkMode ? "#064e3b" : "#ecfdf5";
      ctx.fill();
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = isComparing || isFound ? 2.5 : 1.5;
      ctx.stroke();

      // Target Label
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("TARGET", width / 2, targetBoxY + 16);

      // Target Value
      ctx.fillStyle = isDarkMode ? "#ffffff" : "#000000";
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "center";
      ctx.fillText(String(targetVal), width / 2, targetBoxY + 36);

      // Calculate smooth lerped X positions for active clean pointers
      const pointerVars = Object.entries(step.vars).filter(
        ([key, val]) => isCleanPointerName(key) && typeof val === "number" && val >= 0 && val < step.array.length
      );

      pointerVars.forEach(([key, val]) => {
        const targetX = startX + (val as number) * (cardWidth + gap) + cardWidth / 2;
        if (animatedPointerXRef.current[key] === undefined) {
          animatedPointerXRef.current[key] = targetX;
        } else {
          animatedPointerXRef.current[key] += (targetX - animatedPointerXRef.current[key]) * lerpFactor;
        }
      });

      const cardCenters: { x: number; y: number }[] = [];

      step.array.forEach((val, idx) => {
        const cx = startX + idx * (cardWidth + gap);
        const cy = cardsY;
        const centerX = cx + cardWidth / 2;
        const centerY = cy + cardHeight / 2;
        cardCenters.push({ x: centerX, y: centerY });

        const isFoundCard = step.foundIndex === idx;
        const activePointersAtIdx = pointerVars.filter(([, v]) => v === idx);

        let bg = isDarkMode ? "#171717" : "#f5f5f5";
        let stroke = isDarkMode ? "#374151" : "#d1d5db";
        let textCol = isDarkMode ? "#e5e5e5" : "#111827";

        if (isFoundCard) {
          bg = isDarkMode ? "#064e3b" : "#d1fae5";
          stroke = "#10b981";
          textCol = isDarkMode ? "#34d399" : "#047857";
        } else if (activePointersAtIdx.length > 0) {
          const ptrName = activePointersAtIdx[0][0];
          const col = getPointerColor(ptrName);
          bg = col.fill;
          stroke = col.stroke;
          textCol = col.text;
        }

        // Card Container Box (No Neon Shadow)
        ctx.shadowBlur = 0;
        drawRoundRect(ctx, cx, cy, cardWidth, cardHeight, 10);
        ctx.fillStyle = bg;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = activePointersAtIdx.length > 0 || isFoundCard ? 2.5 : 1.5;
        ctx.stroke();

        // Element Value
        ctx.fillStyle = textCol;
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.fillText(String(val), centerX, centerY + 5);

        // Index Label
        ctx.fillStyle = "#9ca3af";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`[${idx}]`, centerX, cy + cardHeight + 16);
      });

      // Render Smooth Floating Pointer Badges BELOW Array Cards (Vertically stacked if multiple pointers target same index)
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
        const col = getPointerColor(key);
        ctx.font = "bold 10px monospace";
        const labelText = key.toUpperCase();
        const bw = ctx.measureText(labelText).width + 12;
        const badgeY = cardsY + cardHeight + 28 + stackIndex * 20;

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

      // 3. Orthogonal Straight Dashed Line from Target Box to Array Card for Comparisons
      if ((isComparing || isFound || isNotFound || step.status === "idle") && step.activeIndices.length > 0) {
        dashOffsetRef.current -= 0.8;

        const activeIdx = step.activeIndices[0];
        const cardCenter = cardCenters[activeIdx];
        const cardVal = step.array[activeIdx];

        if (cardCenter) {
          const x1 = width / 2; // Target Box bottom center
          const y1 = targetBoxY + targetBoxH;
          const x2 = cardCenter.x; // Array Card top center
          const y2 = cardsY - 2; // top of array card box

          let colorScheme = {
            stroke: "#f59e0b", // Solid Amber
            startDot: "#10b981",
            endDot: "#f59e0b",
          };

          // Determine comparison operator symbol
          let operatorSymbol = "==";
          const opMatch = step.description.match(/(===|==|!=|<=|>=|<|>)/);
          if (opMatch) {
            operatorSymbol = opMatch[0];
          } else if (cardVal !== undefined && targetVal !== undefined) {
            const numCard = Number(cardVal);
            const numTarget = Number(targetVal);
            if (isFound || numCard === numTarget) {
              operatorSymbol = "==";
            } else if (numCard < numTarget) {
              operatorSymbol = "<";
            } else if (numCard > numTarget) {
              operatorSymbol = ">";
            }
          }

          if (isFound || (cardVal !== undefined && targetVal !== undefined && Number(cardVal) === Number(targetVal))) {
            // Match (Equal) -> Solid Emerald Green
            colorScheme = {
              stroke: "#10b981",
              startDot: "#10b981",
              endDot: "#10b981",
            };
          } else if (cardVal !== undefined && targetVal !== undefined) {
            const numCard = Number(cardVal);
            const numTarget = Number(targetVal);
            if (numCard < numTarget) {
              // Card < Target -> Solid Blue
              colorScheme = {
                stroke: "#0284c7",
                startDot: "#10b981",
                endDot: "#0284c7",
              };
            } else if (numCard > numTarget) {
              // Card > Target -> Solid Red
              colorScheme = {
                stroke: "#ef4444",
                startDot: "#10b981",
                endDot: "#ef4444",
              };
            }
          }

          drawTargetComparisonBridge(
            ctx,
            x1,
            y1,
            x2,
            y2,
            dashOffsetRef.current,
            colorScheme,
            12,
            operatorSymbol,
            isDarkMode
          );
        }
      }

      // 4. Status Badge (Text Only)
      const statusY = cardsY + cardHeight + 54;
      if (isFound) {
        ctx.fillStyle = "#34d399";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Target Found", width / 2, statusY + 17);
      } else if (isNotFound) {
        ctx.fillStyle = "#f43f5e";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Target Not Found", width / 2, statusY + 17);
      }

      // 5. Live Variables Inspector (Filtered clean pointer variables)
      const varsY = height - 90;
      ctx.fillStyle = "#a3a3a3";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("SEARCHING VARIABLES:", 24, varsY);

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
