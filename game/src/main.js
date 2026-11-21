// main.js — one job: own the game state machine and the HUD, and wire
// config, scenes, render, input, audio and shots together.
import {
  PANEL_W,
  PANEL_H,
  ROUND_TIME_SECONDS,
  DIFFERENCES_PER_ROUND,
  HINTS_PER_ROUND,
  POINTS_PER_FIND,
  POINTS_PER_SECOND_LEFT,
  WRONG_CLICK_TIME_PENALTY,
  CLICK_RADIUS,
  HINT_PULSE_MS,
  ROUND_NAMES,
  SCENE_TITLES,
  GAME_TITLE,
} from "./config.js";
import { SCENES } from "./scenes.js";
import { drawPanels } from "./render.js";
import { attachInput } from "./input.js";
import { SoundBank } from "./audio.js";
import { applyShot } from "./shots.js";

const state = {
  screen: "title", // title | playing | roundDone | win | timeout
  round: 0,
  timeLeft: ROUND_TIME_SECONDS,
  score: 0,
  hintsLeft: HINTS_PER_ROUND,
  found: new Set(),
  hint: null,
  miss: null,
  seed: 1,
  roundsCleared: 0,
  lastFoundLabel: "",
  lastBonus: 0,
  canvasLeft: null,
  canvasRight: null,
};

const sounds = new SoundBank();
const $ = (id) => document.getElementById(id);

function scene() {
  return SCENES[state.round];
}

function remainingCount() {
  return DIFFERENCES_PER_ROUND - state.found.size;
}

function updateHud() {
  $("hud-title").textContent = GAME_TITLE;
  $("hud-round").textContent = `${ROUND_NAMES[state.round]} · ${SCENE_TITLES[state.round]}`;
  const seconds = Math.max(0, Math.ceil(state.timeLeft));
  const timerEl = $("hud-timer");
  timerEl.textContent = `⏱ ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  timerEl.classList.toggle("danger", seconds <= 15 && state.screen === "playing");
  $("hud-found").textContent = `Found ${state.found.size} / ${DIFFERENCES_PER_ROUND}`;
  $("hud-remaining").textContent = `${remainingCount()} remaining`;
  $("hud-hints").textContent = `Hints: ${state.hintsLeft}`;
  $("hud-score").textContent = `Score ${state.score}`;
  $("btn-hint").disabled = state.screen !== "playing" || state.hintsLeft <= 0;
  $("btn-restart").disabled = state.screen !== "playing";
  const dots = [0, 1, 2]
    .map(
      (i) =>
        `<span class="dot${i < state.roundsCleared ? " done" : ""}${i === state.round ? " current" : ""}">${i + 1}</span>`,
    )
    .join("");
  $("round-dots").innerHTML = dots;
}

function showOverlay(which) {
  ["overlay-title", "overlay-round", "overlay-win", "overlay-timeout"].forEach(
    (id) => $(id).classList.add("hidden"),
  );
  if (which) $(which).classList.remove("hidden");
}

function showToast(text) {
  const toast = $("toast");
  toast.textContent = text;
  toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.add("hidden"), 1800);
}

function startRound(index) {
  state.round = index;
  state.screen = "playing";
  state.timeLeft = ROUND_TIME_SECONDS;
  state.hintsLeft = HINTS_PER_ROUND;
  state.found = new Set();
  state.hint = null;
  state.miss = null;
  state.lastFoundLabel = "";
  showOverlay(null);
  drawPanels(state);
  updateHud();
}

function startGame() {
  state.score = 0;
  state.roundsCleared = 0;
  startRound(0);
}

function finishRound() {
  const bonus = Math.ceil(state.timeLeft) * POINTS_PER_SECOND_LEFT;
  state.lastBonus = bonus;
  state.score += bonus;
  state.roundsCleared = state.round + 1;
  sounds.playRoundComplete();
  if (state.round >= SCENES.length - 1) {
    state.screen = "win";
    $("overlay-win-score").textContent = `Final score: ${state.score}`;
    $("overlay-win-detail").textContent =
      "All three scenes cleared — harbour, market and lake. Every difference found.";
    sounds.playWin();
    showOverlay("overlay-win");
  } else {
    state.screen = "roundDone";
    $("overlay-round-title").textContent = `${scene().name} cleared!`;
    $("overlay-round-bonus").textContent =
      `7 of 7 found · time bonus +${bonus} · score ${state.score}`;
    showOverlay("overlay-round");
  }
  updateHud();
}

function timeOut() {
  state.screen = "timeout";
  $("overlay-timeout-round").textContent =
    `${scene().name} — ${state.found.size} of ${DIFFERENCES_PER_ROUND} found before the clock ran out.`;
  sounds.playWrong();
  showOverlay("overlay-timeout");
  updateHud();
}

function useHint() {
  if (state.screen !== "playing" || state.hintsLeft <= 0) return;
  const unfound = scene().diffs.filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return;
  const pick = unfound[Math.floor(Math.random() * unfound.length)];
  state.hintsLeft -= 1;
  state.hint = {
    diffId: pick.id,
    startedAt: performance.now(),
    durationMs: HINT_PULSE_MS,
  };
  sounds.playHint();
  showToast("Hint: look where the gold ring pulses…");
  updateHud();
}

function resolveClick(point, panel) {
  if (state.screen !== "playing") return;
  sounds.unlock();
  let best = null;
  let bestDist = CLICK_RADIUS;
  scene().diffs.forEach((diff) => {
    if (state.found.has(diff.id)) return;
    const dist = Math.hypot(point.x - diff.x, point.y - diff.y);
    if (dist < bestDist) {
      best = diff;
      bestDist = dist;
    }
  });
  if (best) {
    state.found.add(best.id);
    state.score += POINTS_PER_FIND;
    state.lastFoundLabel = best.label;
    state.hint = null;
    sounds.playFind();
    showToast(`Found it! ${best.label} · +${POINTS_PER_FIND}`);
    drawPanels(state);
    updateHud();
    if (state.found.size >= DIFFERENCES_PER_ROUND) finishRound();
  } else {
    state.miss = { x: point.x, y: point.y, panel, at: performance.now() };
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_CLICK_TIME_PENALTY);
    sounds.playWrong();
    showToast(`Not there — minus ${WRONG_CLICK_TIME_PENALTY}s!`);
    drawPanels(state);
    updateHud();
  }
}

let lastWholeSecond = ROUND_TIME_SECONDS;
function tick(now) {
  if (state.screen === "playing") {
    state.timeLeft -= tick.lastDt(now);
    const whole = Math.ceil(state.timeLeft);
    if (whole !== lastWholeSecond) {
      lastWholeSecond = whole;
      if (whole <= 10 && whole > 0) sounds.playTick();
      updateHud();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      drawPanels(state);
      timeOut();
    } else if (state.hint) {
      drawPanels(state);
    }
  }
  window.requestAnimationFrame(tick);
}
tick.last = 0;
tick.lastDt = function lastDt(now) {
  const dt = tick.last ? (now - tick.last) / 1000 : 0;
  tick.last = now;
  return dt;
};

function wireButtons() {
  $("btn-start").addEventListener("click", () => {
    sounds.unlock();
    startGame();
  });
  document.querySelectorAll("[data-round]").forEach((button) => {
    button.addEventListener("click", () => {
      sounds.unlock();
      state.score = 0;
      state.roundsCleared = Number(button.dataset.round);
      startRound(Number(button.dataset.round));
    });
  });
  $("btn-hint").addEventListener("click", useHint);
  $("btn-restart").addEventListener("click", () => startRound(state.round));
  $("btn-mute").addEventListener("click", () => {
    const muted = sounds.toggleMute();
    $("btn-mute").textContent = muted ? "🔇 Muted" : "🔊 Sound";
  });
  $("btn-next").addEventListener("click", () => startRound(state.round + 1));
  $("btn-again").addEventListener("click", startGame);
  $("btn-retry").addEventListener("click", () => startRound(state.round));
  $("btn-play-again").addEventListener("click", startGame);
}

function boot() {
  state.canvasLeft = $("canvas-left");
  state.canvasRight = $("canvas-right");
  state.canvasLeft.width = PANEL_W;
  state.canvasLeft.height = PANEL_H;
  state.canvasRight.width = PANEL_W;
  state.canvasRight.height = PANEL_H;
  wireButtons();
  attachInput({
    canvasLeft: state.canvasLeft,
    canvasRight: state.canvasRight,
    onPanelClick: (panel, point) => resolveClick(point, panel),
    onHover: () => {},
    onHintKey: useHint,
    onRestartKey: () => {
      if (state.screen === "playing") startRound(state.round);
    },
    onMuteKey: () => {
      const muted = sounds.toggleMute();
      $("btn-mute").textContent = muted ? "🔇 Muted" : "🔊 Sound";
    },
    onConfirmKey: () => {
      if (state.screen === "title") startGame();
      else if (state.screen === "roundDone") startRound(state.round + 1);
      else if (state.screen === "win" || state.screen === "timeout") startGame();
    },
    onRoundKey: (index) => {
      if (state.screen === "title") {
        state.score = 0;
        state.roundsCleared = index;
        startRound(index);
      }
    },
  });
  applyShot(state);
  if (state.screen === "title") showOverlay("overlay-title");
  else if (state.screen === "win") {
    $("overlay-win-score").textContent = `Final score: ${state.score}`;
    $("overlay-win-detail").textContent =
      "All three scenes cleared — harbour, market and lake. Every difference found.";
    showOverlay("overlay-win");
  } else {
    showOverlay(null);
  }
  drawPanels(state);
  updateHud();
  window.requestAnimationFrame(tick);
  // Exposed for automated play-testing only; the game never reads it.
  window.__spotGame = {
    state,
    clickAt(panel, x, y) {
      resolveClick({ x, y }, panel);
    },
    useHint,
    startRound,
  };
}

document.addEventListener("DOMContentLoaded", boot);
