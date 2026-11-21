// shots.js — one job: deterministic screenshot states, driven by the URL.
//   ?shot=start  title screen over round 1, nothing found yet
//   ?shot=play   mid-game: 3 differences already found, markers on, counter
//                showing 4 remaining, timer running at 87 seconds
//   ?shot=end    the win screen after all three rounds
// A plain load with no ?shot= just opens the title screen.
import { ROUND_TIME_SECONDS } from "./config.js";
import { SCENES } from "./scenes.js";

export function readShotParams() {
  const params = new URLSearchParams(window.location.search);
  const seed = Number(params.get("seed") || "1") || 1;
  return { shot: params.get("shot") || "", seed };
}

export function applyShot(state) {
  const { shot, seed } = readShotParams();
  state.seed = seed;
  if (shot === "play") {
    state.screen = "playing";
    state.round = 0;
    state.timeLeft = 87;
    state.score = 300;
    state.hintsLeft = 2;
    state.found = new Set(
      SCENES[0].diffs.slice(0, 3).map((d) => d.id),
    );
    state.lastFoundLabel = SCENES[0].diffs[2].label;
  } else if (shot === "end") {
    state.screen = "win";
    state.round = 2;
    state.timeLeft = 0;
    state.score = 2450;
    state.hintsLeft = 3;
    state.found = new Set(SCENES[2].diffs.map((d) => d.id));
    state.roundsCleared = 3;
  } else {
    state.screen = "title";
    state.round = 0;
    state.timeLeft = ROUND_TIME_SECONDS;
    state.score = 0;
    state.hintsLeft = 3;
    state.found = new Set();
  }
  return shot;
}
