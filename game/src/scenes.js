// scenes.js — one job: paint the three original scenes and define the seven
// differences of each. Every picture is drawn with canvas vector shapes;
// there are no image files. paint(ctx, w, h, changed, rng) draws one panel:
// `changed` is a Set of difference ids applied to that panel. The left panel
// is always painted with an empty set, the right panel with all seven ids.
import { makeRng } from "./random.js";

function sky(ctx, w, h, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  stops.forEach(([at, color]) => g.addColorStop(at, color));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function disc(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function box(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function tri(ctx, x1, y1, x2, y2, x3, y3, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function gull(ctx, x, y, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 11, y);
  ctx.quadraticCurveTo(x - 4, y - 8, x, y);
  ctx.quadraticCurveTo(x + 4, y - 8, x + 11, y);
  ctx.stroke();
}

function star4(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + r * 0.22, y - r * 0.22, x + r, y);
  ctx.quadraticCurveTo(x + r * 0.22, y + r * 0.22, x, y + r);
  ctx.quadraticCurveTo(x - r * 0.22, y + r * 0.22, x - r, y);
  ctx.quadraticCurveTo(x - r * 0.22, y - r * 0.22, x, y - r);
  ctx.fill();
}

function cat(ctx, x, y, color) {
  // A small cat sitting upright, facing left. (x, y) is the base centre.
  ctx.fillStyle = color;
  ellipse(ctx, x, y - 14, 11, 15, color); // body
  disc(ctx, x - 2, y - 34, 9, color); // head
  tri(ctx, x - 9, y - 38, x - 11, y - 48, x - 4, y - 41, color); // ear
  tri(ctx, x + 3, y - 41, x + 7, y - 48, x + 8, y - 38, color); // ear
  ellipse(ctx, x + 8, y - 6, 9, 4, color); // tail curl
  ctx.fillStyle = "#ffd76a";
  disc(ctx, x - 5, y - 35, 1.6, "#ffd76a");
  disc(ctx, x + 1, y - 35, 1.6, "#ffd76a");
}

function pine(ctx, x, baseY, s, color) {
  tri(ctx, x - 22 * s, baseY, x, baseY - 52 * s, x + 22 * s, baseY, color);
  tri(ctx, x - 17 * s, baseY - 26 * s, x, baseY - 72 * s, x + 17 * s, baseY - 26 * s, color);
  tri(ctx, x - 12 * s, baseY - 48 * s, x, baseY - 88 * s, x + 12 * s, baseY - 48 * s, color);
  box(ctx, x - 3 * s, baseY, 6 * s, 10 * s, "#5a3a22");
}

// ---------------------------------------------------------------- harbour
function paintHarbour(ctx, w, h, changed, rng) {
  sky(ctx, w, h, [
    [0, "#241640"],
    [0.45, "#7b2d5e"],
    [0.75, "#ff8a5c"],
    [1, "#ffb37a"],
  ]);
  // low sun and its glow
  const glow = ctx.createRadialGradient(470, 150, 8, 470, 150, 110);
  glow.addColorStop(0, "rgba(255,214,120,0.9)");
  glow.addColorStop(1, "rgba(255,214,120,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(340, 20, 260, 260);
  disc(ctx, 470, 150, 36, "#ffe9a8");
  disc(ctx, 470, 150, 28, "#ffd76a");
  // drifting clouds
  ellipse(ctx, 130, 95, 62, 15, "rgba(255,190,170,0.55)");
  ellipse(ctx, 180, 105, 48, 12, "rgba(255,190,170,0.45)");
  ellipse(ctx, 380, 60, 55, 13, "rgba(255,170,160,0.4)");
  // gulls (one goes missing on the right panel)
  gull(ctx, 200, 90, "#2b1b33");
  if (!changed.has("gull")) gull(ctx, 265, 72, "#2b1b33");
  gull(ctx, 335, 100, "#2b1b33");
  // distant headland
  ctx.fillStyle = "#3a2350";
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.lineTo(0, 250);
  ctx.lineTo(90, 228);
  ctx.lineTo(190, 262);
  ctx.lineTo(260, 300);
  ctx.closePath();
  ctx.fill();
  // lighthouse (its beam goes dark on the right panel)
  box(ctx, 62, 190, 34, 112, "#f5efe2");
  box(ctx, 62, 222, 34, 16, "#d94f3d");
  box(ctx, 62, 258, 34, 16, "#d94f3d");
  box(ctx, 58, 176, 42, 16, "#2b2b3a");
  disc(ctx, 79, 184, 7, "#ffe9a8");
  if (!changed.has("beam")) {
    const beam = ctx.createLinearGradient(96, 184, 260, 150);
    beam.addColorStop(0, "rgba(255,233,168,0.55)");
    beam.addColorStop(1, "rgba(255,233,168,0)");
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(96, 176);
    ctx.lineTo(260, 140);
    ctx.lineTo(260, 200);
    ctx.lineTo(96, 192);
    ctx.closePath();
    ctx.fill();
  }
  // harbour house with a lit window
  box(ctx, 130, 252, 74, 50, "#4a2c4d");
  tri(ctx, 126, 252, 167, 224, 208, 252, "#33203a");
  box(ctx, 150, 268, 18, 20, "#ffd76a");
  line(ctx, 159, 268, 159, 288, "#4a2c4d", 2);
  // sea
  const sea = ctx.createLinearGradient(0, 300, 0, h);
  sea.addColorStop(0, "#2e6b7a");
  sea.addColorStop(1, "#0a2233");
  ctx.fillStyle = sea;
  ctx.fillRect(0, 300, w, h - 300);
  // sun path on the water
  ctx.fillStyle = "rgba(255,190,110,0.35)";
  for (let i = 0; i < 5; i += 1) {
    const yy = 312 + i * 30;
    ctx.fillRect(440 - i * 6, yy, 60 + i * 12, 5);
  }
  for (let i = 0; i < 14; i += 1) {
    const x = Math.floor(rng() * w);
    const y = 312 + Math.floor(rng() * 140);
    line(ctx, x, y, x + 18 + rng() * 22, y, "rgba(180,230,240,0.25)", 2);
  }
  // big sailboat, centre
  tri(ctx, 300, 150, 300, 268, 362, 268, "#f5efe2"); // sail
  tri(ctx, 296, 168, 296, 268, 246, 268, "#e8d9b0"); // second sail
  line(ctx, 300, 140, 300, 272, "#3a2a22", 4); // mast
  ctx.fillStyle = "#7a3b2e";
  ctx.beginPath();
  ctx.moveTo(232, 268);
  ctx.lineTo(368, 268);
  ctx.lineTo(348, 292);
  ctx.lineTo(252, 292);
  ctx.closePath();
  ctx.fill();
  // flag on the mast: red on the left, teal on the right
  ctx.fillStyle = changed.has("flag") ? "#2ea8a0" : "#d94f3d";
  ctx.beginPath();
  ctx.moveTo(300, 140);
  ctx.lineTo(332, 147);
  ctx.lineTo(300, 155);
  ctx.closePath();
  ctx.fill();
  // pier deck and posts
  box(ctx, 24, 330, 572, 20, "#6b4a2f");
  box(ctx, 24, 330, 572, 4, "#8a6540");
  for (let x = 40; x < 600; x += 42) line(ctx, x, 330, x, 350, "#54371f", 2);
  [70, 220, 380, 540].forEach((x) => box(ctx, x, 350, 10, 52, "#54371f"));
  // pier lantern: lit on the left, dark on the right
  line(ctx, 430, 300, 430, 330, "#2b2b3a", 4);
  if (!changed.has("lantern")) {
    const lg = ctx.createRadialGradient(430, 296, 2, 430, 296, 34);
    lg.addColorStop(0, "rgba(255,215,106,0.85)");
    lg.addColorStop(1, "rgba(255,215,106,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(394, 260, 72, 72);
    disc(ctx, 430, 296, 9, "#ffd76a");
  } else {
    disc(ctx, 430, 296, 9, "#8a8a96");
  }
  box(ctx, 424, 286, 12, 6, "#2b2b3a");
  // crates, barrels, and the cat that only appears on the right
  box(ctx, 96, 300, 34, 30, "#a9743f");
  box(ctx, 132, 300, 34, 30, "#8a5c30");
  box(ctx, 112, 272, 34, 28, "#c08a4e");
  line(ctx, 96, 315, 130, 315, "#7a4e26", 2);
  line(ctx, 132, 315, 166, 315, "#6b421f", 2);
  if (changed.has("cat")) cat(ctx, 130, 272, "#2e2a33");
  ellipse(ctx, 196, 322, 16, 14, "#7a4a2a");
  ellipse(ctx, 196, 312, 16, 6, "#9c6638");
  // little rowboat: present on the left, gone on the right
  if (!changed.has("rowboat")) {
    ctx.fillStyle = "#4f7d8a";
    ctx.beginPath();
    ctx.moveTo(496, 352);
    ctx.lineTo(556, 352);
    ctx.lineTo(544, 368);
    ctx.lineTo(508, 368);
    ctx.closePath();
    ctx.fill();
    line(ctx, 512, 352, 540, 352, "#2e4a52", 3);
  }
  // pier sign: PIER 7 on the left, PIER 9 on the right
  line(ctx, 566, 296, 566, 330, "#2b2b3a", 4);
  box(ctx, 540, 272, 54, 26, "#f5efe2");
  ctx.fillStyle = "#2b2b3a";
  ctx.font = "bold 15px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(changed.has("sign") ? "PIER 9" : "PIER 7", 567, 286);
}

// ---------------------------------------------------------------- market
function awning(ctx, x, y, w, stripeA, stripeB) {
  const stripes = 6;
  const sw = w / stripes;
  for (let i = 0; i < stripes; i += 1) {
    box(ctx, x + i * sw, y, sw, 26, i % 2 === 0 ? stripeA : stripeB);
  }
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.moveTo(x, y + 26);
  ctx.lineTo(x + w, y + 26);
  ctx.lineTo(x + w - 8, y + 36);
  ctx.lineTo(x + 8, y + 36);
  ctx.closePath();
  ctx.fill();
}

function paperLantern(ctx, x, y, r, color) {
  ellipse(ctx, x, y, r, r * 1.15, color);
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.62, r * 1.15, 0, 0, Math.PI * 2);
  ctx.stroke();
  line(ctx, x, y - r * 1.15, x, y - r * 1.15 - 10, "#3a2a22", 2);
  box(ctx, x - 5, y - r * 1.15 - 4, 10, 5, "#d9a441");
}

function vendor(ctx, x, y, hatColor) {
  disc(ctx, x, y - 34, 13, "#e8b98a"); // head
  ctx.fillStyle = "#3f6d4e";
  ctx.beginPath();
  ctx.moveTo(x - 24, y + 12);
  ctx.lineTo(x + 24, y + 12);
  ctx.lineTo(x + 14, y - 22);
  ctx.lineTo(x - 14, y - 22);
  ctx.closePath();
  ctx.fill();
  ellipse(ctx, x, y - 46, 20, 6, hatColor); // hat brim
  tri(ctx, x - 10, y - 46, x, y - 62, x + 10, y - 46, hatColor); // hat top
}

function paintMarket(ctx, w, h, changed, rng) {
  sky(ctx, w, h, [
    [0, "#0b1030"],
    [0.6, "#1b2a52"],
    [1, "#2c3f6e"],
  ]);
  // stars (one bright star goes missing on the right panel)
  for (let i = 0; i < 40; i += 1) {
    const x = Math.floor(rng() * w);
    const y = Math.floor(rng() * 150);
    const r = 1 + rng() * 1.6;
    ctx.fillStyle = `rgba(255,255,255,${0.35 + rng() * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!changed.has("star")) star4(ctx, 150, 60, 9, "#fff3b0");
  // moon
  disc(ctx, 520, 80, 30, "#f2ead0");
  disc(ctx, 510, 72, 7, "#d9cba6");
  disc(ctx, 530, 88, 5, "#d9cba6");
  // string lights across the top
  ctx.strokeStyle = "#1c1c26";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 34);
  ctx.quadraticCurveTo(310, 86, 620, 34);
  ctx.stroke();
  const bulbColors = ["#ffd76a", "#ff8a7a", "#7ad9c2", "#ffb37a"];
  for (let i = 0; i < 13; i += 1) {
    const t = i / 12;
    const x = t * 620;
    const y = 34 + Math.sin(t * Math.PI) * 44;
    disc(ctx, x, y + 8, 5, bulbColors[i % bulbColors.length]);
  }
  // ground
  box(ctx, 0, 398, w, h - 398, "#241d33");
  for (let i = 0; i < 26; i += 1) {
    const x = Math.floor(rng() * w);
    const y = 404 + Math.floor(rng() * 56);
    ellipse(ctx, x, y, 14, 4, "rgba(255,255,255,0.05)");
  }
  // stall bodies
  box(ctx, 30, 330, 180, 70, "#5a3a26");
  box(ctx, 235, 330, 180, 70, "#3d2f22");
  box(ctx, 440, 330, 150, 70, "#4a2c20");
  // awnings (the middle one changes stripe colour on the right)
  awning(ctx, 24, 190, 192, "#c23b2e", "#f5efe2");
  awning(
    ctx,
    229,
    190,
    192,
    "#2e7d4f",
    changed.has("awning") ? "#ffd76a" : "#f5efe2",
  );
  awning(ctx, 434, 190, 162, "#e07b2e", "#f5efe2");
  // stall poles
  [30, 204, 235, 409, 440, 584].forEach((x) => line(ctx, x, 216, x, 330, "#3a2a1c", 4));
  // goods: fruit baskets on the left stall
  const appleCount = changed.has("fruit") ? 1 : 3;
  ellipse(ctx, 90, 322, 42, 12, "#7a4a22");
  for (let i = 0; i < appleCount; i += 1) {
    disc(ctx, 66 + i * 24, 310, 10, "#d94f3d");
    line(ctx, 66 + i * 24, 300, 66 + i * 24, 296, "#3f6d4e", 2);
  }
  ellipse(ctx, 170, 322, 30, 10, "#7a4a22");
  for (let i = 0; i < 3; i += 1) disc(ctx, 152 + i * 18, 312, 8, "#e8a13a");
  // jars on the middle stall
  [270, 300, 330, 360].forEach((x, i) => {
    box(ctx, x - 11, 300, 22, 28, ["#7ad9c2", "#ffd76a", "#ff8a7a", "#b98ae8"][i]);
    box(ctx, x - 13, 294, 26, 7, "#3a2a1c");
  });
  // chalkboard price: 5 on the left, 8 on the right
  box(ctx, 300, 340, 60, 44, "#22301f");
  ctx.strokeStyle = "#f5efe2";
  ctx.lineWidth = 2;
  ctx.strokeRect(300, 340, 60, 44);
  ctx.fillStyle = "#f5efe2";
  ctx.font = "bold 22px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(changed.has("price") ? "8" : "5", 330, 363);
  ctx.font = "11px Georgia, serif";
  ctx.fillText("coins", 330, 380);
  // teapots on the right stall
  ellipse(ctx, 500, 318, 26, 14, "#2e7d8a");
  tri(ctx, 522, 312, 534, 306, 522, 320, "#2e7d8a");
  disc(ctx, 500, 300, 6, "#2e7d8a");
  ellipse(ctx, 552, 320, 18, 11, "#8a5c30");
  // paper lanterns under the awnings
  paperLantern(ctx, 90, 252, 15, "#ff5a4e");
  paperLantern(ctx, 160, 258, 12, "#ffd76a");
  paperLantern(ctx, 280, 252, 14, "#ffd76a");
  paperLantern(ctx, 380, 258, 12, "#ff5a4e");
  paperLantern(ctx, 480, 252, 14, "#ffd76a");
  paperLantern(ctx, 545, 258, 12, "#ff5a4e");
  // an extra pink lantern only on the right panel
  if (changed.has("lantern")) paperLantern(ctx, 350, 150, 14, "#ff7ab8");
  // vendors (the middle vendor's hat changes colour on the right)
  vendor(ctx, 120, 330, "#d9a441");
  vendor(ctx, 322, 330, changed.has("hat") ? "#c23b2e" : "#d9a441");
  vendor(ctx, 512, 330, "#d9a441");
  // a cat asleep on the right stall's roof, only on the right panel
  if (changed.has("cat")) {
    ellipse(ctx, 512, 186, 16, 8, "#2e2a33");
    disc(ctx, 498, 180, 7, "#2e2a33");
    tri(ctx, 492, 176, 493, 168, 498, 174, "#2e2a33");
  }
}

// ---------------------------------------------------------------- lake
function paintLake(ctx, w, h, changed, rng) {
  sky(ctx, w, h, [
    [0, "#f7c8a0"],
    [0.4, "#f2d8c8"],
    [0.7, "#cfe8f5"],
    [1, "#eaf6ff"],
  ]);
  // rising sun
  const glow = ctx.createRadialGradient(140, 110, 6, 140, 110, 100);
  glow.addColorStop(0, "rgba(255,200,110,0.85)");
  glow.addColorStop(1, "rgba(255,200,110,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(20, 0, 240, 220);
  disc(ctx, 140, 110, 30, "#ffe9a8");
  disc(ctx, 140, 110, 22, "#ffcf5e");
  // birds (one goes missing on the right panel)
  if (!changed.has("bird")) gull(ctx, 280, 90, "#4a3a42");
  gull(ctx, 340, 70, "#4a3a42");
  gull(ctx, 400, 100, "#4a3a42");
  // far mountain with snow cap
  ctx.fillStyle = "#6d7f9e";
  ctx.beginPath();
  ctx.moveTo(60, 300);
  ctx.lineTo(230, 120);
  ctx.lineTo(400, 300);
  ctx.closePath();
  ctx.fill();
  tri(ctx, 198, 152, 230, 120, 262, 152, "#f5f8ff");
  tri(ctx, 214, 136, 230, 120, 246, 136, "#ffffff");
  // near mountain on the right (its snow cap vanishes on the right panel)
  ctx.fillStyle = "#5d7396";
  ctx.beginPath();
  ctx.moveTo(360, 300);
  ctx.lineTo(510, 150);
  ctx.lineTo(620, 300);
  ctx.closePath();
  ctx.fill();
  if (!changed.has("snow")) {
    tri(ctx, 482, 178, 510, 150, 538, 178, "#f5f8ff");
    tri(ctx, 496, 164, 510, 150, 524, 164, "#ffffff");
  }
  // lake
  const lake = ctx.createLinearGradient(0, 300, 0, h);
  lake.addColorStop(0, "#7fb3c8");
  lake.addColorStop(1, "#3d6f8e");
  ctx.fillStyle = lake;
  ctx.fillRect(0, 300, w, h - 300);
  // mountain reflections
  ctx.fillStyle = "rgba(109,127,158,0.4)";
  ctx.beginPath();
  ctx.moveTo(180, 300);
  ctx.lineTo(230, 380);
  ctx.lineTo(280, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(93,115,150,0.4)";
  ctx.beginPath();
  ctx.moveTo(470, 300);
  ctx.lineTo(510, 360);
  ctx.lineTo(550, 300);
  ctx.closePath();
  ctx.fill();
  // sun path on the water
  ctx.fillStyle = "rgba(255,210,120,0.35)";
  for (let i = 0; i < 4; i += 1) {
    ctx.fillRect(112 - i * 4, 312 + i * 34, 56 + i * 10, 5);
  }
  for (let i = 0; i < 12; i += 1) {
    const x = Math.floor(rng() * w);
    const y = 310 + Math.floor(rng() * 140);
    line(ctx, x, y, x + 16 + rng() * 20, y, "rgba(220,240,250,0.28)", 2);
  }
  // cabin on the left shore
  box(ctx, 80, 252, 92, 52, "#6b4a2f");
  tri(ctx, 72, 252, 126, 218, 180, 252, "#4a2c20");
  box(ctx, 148, 224, 12, 26, "#4a2c20");
  ellipse(ctx, 154, 216, 10, 5, "rgba(255,255,255,0.6)");
  ellipse(ctx, 158, 204, 12, 6, "rgba(255,255,255,0.5)");
  // cabin window: warm and lit on the left, dark on the right
  box(
    ctx,
    104,
    268,
    20,
    20,
    changed.has("window") ? "#2b2b3a" : "#ffd76a",
  );
  line(ctx, 114, 268, 114, 288, "#6b4a2f", 2);
  box(ctx, 140, 272, 16, 22, "#3a2a1c"); // door
  // pines along the shore (the big one on the right goes missing)
  pine(ctx, 210, 302, 0.8, "#2e5d3f");
  pine(ctx, 250, 300, 0.6, "#376b49");
  pine(ctx, 580, 302, 0.9, "#2e5d3f");
  if (!changed.has("pine")) pine(ctx, 505, 300, 1.0, "#2e5d3f");
  // canoe with its reflection
  ctx.fillStyle = "#8a4a2a";
  ctx.beginPath();
  ctx.moveTo(320, 372);
  ctx.lineTo(392, 372);
  ctx.lineTo(380, 386);
  ctx.lineTo(332, 386);
  ctx.closePath();
  ctx.fill();
  line(ctx, 330, 372, 382, 372, "#5a2c16", 2);
  ctx.fillStyle = "rgba(138,74,42,0.35)";
  ctx.beginPath();
  ctx.moveTo(330, 392);
  ctx.lineTo(382, 392);
  ctx.lineTo(374, 402);
  ctx.lineTo(338, 402);
  ctx.closePath();
  ctx.fill();
  // a fish jumping out of the lake, only on the right panel
  if (changed.has("fish")) {
    ctx.fillStyle = "#c8d8e8";
    ctx.beginPath();
    ctx.ellipse(440, 352, 16, 7, -0.6, 0, Math.PI * 2);
    ctx.fill();
    tri(ctx, 452, 344, 462, 338, 458, 350, "#c8d8e8");
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.ellipse(440, 368, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // an extra rock in the lake, only on the right panel
  if (changed.has("rock")) {
    ellipse(ctx, 255, 404, 18, 10, "#5a6b78");
    ellipse(ctx, 250, 398, 10, 6, "#7a8b98");
  }
  // foreground flowers (red on the left, yellow on the right)
  const petal = changed.has("flower") ? "#ffd76a" : "#d94f6a";
  [190, 214, 238].forEach((x) => {
    line(ctx, x, 430, x, 452, "#2e5d3f", 2);
    for (let k = 0; k < 5; k += 1) {
      const a = (k / 5) * Math.PI * 2;
      disc(ctx, x + Math.cos(a) * 6, 426 + Math.sin(a) * 6, 4, petal);
    }
    disc(ctx, x, 426, 4, "#fff3b0");
  });
  // grass tufts
  for (let i = 0; i < 10; i += 1) {
    const x = 20 + i * 62 + Math.floor(rng() * 20);
    line(ctx, x, 462, x - 4, 448, "#2e5d3f", 2);
    line(ctx, x + 4, 462, x + 8, 448, "#376b49", 2);
  }
}

// ---------------------------------------------------------------- export
export const SCENES = [
  {
    id: "harbour",
    name: "Harbour at Dusk",
    subtitle: "Senja di Pelabuhan",
    paint: paintHarbour,
    diffs: [
      { id: "rowboat", x: 526, y: 360, r: 34, label: "Rowboat gone" },
      { id: "flag", x: 312, y: 148, r: 26, label: "Flag changed colour" },
      { id: "cat", x: 130, y: 258, r: 30, label: "A cat appeared" },
      { id: "lantern", x: 430, y: 296, r: 28, label: "Lantern went dark" },
      { id: "gull", x: 265, y: 72, r: 26, label: "A gull flew away" },
      { id: "beam", x: 170, y: 168, r: 30, label: "Lighthouse beam off" },
      { id: "sign", x: 567, y: 285, r: 26, label: "Pier number changed" },
    ],
  },
  {
    id: "market",
    name: "Night Market",
    subtitle: "Pasar Malam",
    paint: paintMarket,
    diffs: [
      { id: "lantern", x: 350, y: 150, r: 26, label: "Extra lantern" },
      { id: "awning", x: 322, y: 203, r: 30, label: "Awning stripes changed" },
      { id: "cat", x: 512, y: 182, r: 26, label: "A cat on the roof" },
      { id: "fruit", x: 90, y: 310, r: 30, label: "Apples missing" },
      { id: "price", x: 330, y: 362, r: 28, label: "Price changed" },
      { id: "star", x: 150, y: 60, r: 24, label: "A star went out" },
      { id: "hat", x: 322, y: 284, r: 28, label: "Hat changed colour" },
    ],
  },
  {
    id: "lake",
    name: "Mountain Lake at Dawn",
    subtitle: "Danau di Pagi Hari",
    paint: paintLake,
    diffs: [
      { id: "pine", x: 505, y: 262, r: 32, label: "A pine vanished" },
      { id: "fish", x: 444, y: 352, r: 28, label: "A fish jumped" },
      { id: "window", x: 114, y: 278, r: 26, label: "Window went dark" },
      { id: "snow", x: 510, y: 164, r: 28, label: "Snow cap melted" },
      { id: "flower", x: 214, y: 430, r: 30, label: "Flowers changed colour" },
      { id: "bird", x: 280, y: 90, r: 24, label: "A bird flew away" },
      { id: "rock", x: 255, y: 402, r: 26, label: "A new rock" },
    ],
  },
];

export function makeSceneRng(seed) {
  return makeRng(seed * 7919 + 13);
}
