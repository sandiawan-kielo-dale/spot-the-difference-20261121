// render.js — one job: draw the two panels and every marker on them.
// It owns the canvases; it never owns game state.
import { PANEL_W, PANEL_H } from "./config.js";
import { SCENES, makeSceneRng } from "./scenes.js";

export function paintPanel(canvas, sceneIndex, changedIds, seed) {
  const ctx = canvas.getContext("2d");
  const scene = SCENES[sceneIndex];
  const changed = new Set(changedIds);
  scene.paint(ctx, PANEL_W, PANEL_H, changed, makeSceneRng(seed));
  return ctx;
}

export function drawFoundRing(ctx, x, y, r, pulse) {
  const radius = r + (pulse ? Math.sin(performance.now() / 160) * 3 : 0);
  ctx.save();
  ctx.strokeStyle = "#37d67a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
  ctx.stroke();
  // check mark
  ctx.strokeStyle = "#37d67a";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - 11, y);
  ctx.lineTo(x - 3, y + 9);
  ctx.lineTo(x + 12, y - 9);
  ctx.stroke();
  ctx.restore();
}

export function drawHintRing(ctx, x, y, r, startedAt, durationMs) {
  const age = performance.now() - startedAt;
  if (age < 0 || age > durationMs) return false;
  const phase = age / durationMs;
  const radius = r + 10 + Math.sin(phase * Math.PI * 4) * 6;
  const alpha = 0.35 + 0.65 * (1 - phase);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "#ffd76a";
  ctx.lineWidth = 5;
  ctx.setLineDash([10, 7]);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  return true;
}

export function drawMissMark(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = "#ff5a4e";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 10);
  ctx.lineTo(x + 10, y + 10);
  ctx.moveTo(x + 10, y - 10);
  ctx.lineTo(x - 10, y + 10);
  ctx.stroke();
  ctx.restore();
}

export function drawPanels(state) {
  const sceneIndex = state.round;
  const allIds = SCENES[sceneIndex].diffs.map((d) => d.id);
  const leftCtx = paintPanel(state.canvasLeft, sceneIndex, [], state.seed);
  const rightCtx = paintPanel(state.canvasRight, sceneIndex, allIds, state.seed);
  state.found.forEach((diffId) => {
    const diff = SCENES[sceneIndex].diffs.find((d) => d.id === diffId);
    if (!diff) return;
    drawFoundRing(leftCtx, diff.x, diff.y, diff.r, false);
    drawFoundRing(rightCtx, diff.x, diff.y, diff.r, false);
  });
  if (state.hint && state.hint.startedAt) {
    const diff = SCENES[sceneIndex].diffs.find((d) => d.id === state.hint.diffId);
    if (diff) {
      const aliveL = drawHintRing(
        leftCtx,
        diff.x,
        diff.y,
        diff.r,
        state.hint.startedAt,
        state.hint.durationMs,
      );
      const aliveR = drawHintRing(
        rightCtx,
        diff.x,
        diff.y,
        diff.r,
        state.hint.startedAt,
        state.hint.durationMs,
      );
      if (!aliveL && !aliveR) state.hint = null;
    }
  }
  if (state.miss && performance.now() - state.miss.at < 450) {
    const target = state.miss.panel === "left" ? leftCtx : rightCtx;
    drawMissMark(target, state.miss.x, state.miss.y);
  }
}
