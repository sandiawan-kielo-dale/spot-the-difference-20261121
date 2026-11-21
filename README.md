# Senja di Pelabuhan — Spot the Difference

[![make.fun bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/sandiawan-kielo-dale/spot-the-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/sandiawan-kielo-dale/spot-the-difference-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

**Senja di Pelabuhan** ("Dusk at the Harbour") is an original spot-the-difference
game. Two near-identical pictures hang side by side — find the seven things
that changed before the clock runs out, across three hand-drawn scenes.

## How to play

- **Click** a difference on either picture to circle it with a green ring and a check.
- A wrong click costs **5 seconds**. Each round gives you **120 seconds**.
- **H** spends one of 3 hints per round: a gold ring pulses over a difference
  you have not found yet. **R** restarts the round. **M** mutes the sounds.
- **1 / 2 / 3** jump straight to a round from the title screen.
- Finishing a round banks a time bonus (+5 points per second left).
  Clear all three rounds to win.

## The three scenes

1. **Harbour at Dusk** — a fishing pier, a lighthouse, a sailboat and a cat
   that was not there a moment ago.
2. **Night Market** — paper lanterns, three stalls and a vendor whose hat
   cannot decide what colour it is.
3. **Mountain Lake at Dawn** — a cabin, a canoe and a fish that only jumps
   on one side of the lake.

Every picture is drawn live on canvas from vector shapes — no image files,
no network requests, no build step. All sounds are WebAudio blips
synthesised in code.

## Run it

```sh
node serve.ts        # serves game/ at http://localhost:8080
```

Open `game/index.html` in desktop Chrome (or the local server above) and play.
Screenshots are deterministic renders of the game itself:

- `?shot=start&seed=1` — title screen
- `?shot=play&seed=1` — mid-game, 3 of 7 found, 4 remaining
- `?shot=end&seed=1` — the win screen

## Layout

| File | Job |
| --- | --- |
| `game/index.html` | Page, HUD and overlays |
| `game/src/config.js` | Every tunable number and label |
| `game/src/scenes.js` | The three scene painters + difference definitions |
| `game/src/render.js` | Draws the panels, found rings, hint pulse, miss marks |
| `game/src/input.js` | Mouse clicks and keyboard, nothing else |
| `game/src/audio.js` | WebAudio blips (find / wrong / hint / win) |
| `game/src/random.js` | Seeded RNG for deterministic decoration |
| `game/src/shots.js` | Deterministic `?shot=` states for screenshots |
| `game/src/main.js` | State machine, timer, scoring, HUD |
| `serve.ts` | Static server for local testing |
| `main.ts` | Entrypoint: copies `game/` + `screenshots/` to `/output` and writes `dossier.json` |

## License

MIT — see [LICENSE](LICENSE).
