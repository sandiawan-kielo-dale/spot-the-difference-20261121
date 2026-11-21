// input.js — one job: turn mouse clicks and key presses into game actions.
// It knows nothing about scoring or rounds; it calls back into main.js.
export function panelPointFromEvent(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

export function attachInput(hooks) {
  const { canvasLeft, canvasRight } = hooks;
  canvasLeft.addEventListener("click", (event) => {
    hooks.onPanelClick("left", panelPointFromEvent(event, canvasLeft));
  });
  canvasRight.addEventListener("click", (event) => {
    hooks.onPanelClick("right", panelPointFromEvent(event, canvasRight));
  });
  canvasLeft.addEventListener("mousemove", (event) => {
    hooks.onHover(panelPointFromEvent(event, canvasLeft));
  });
  canvasRight.addEventListener("mousemove", (event) => {
    hooks.onHover(panelPointFromEvent(event, canvasRight));
  });
  window.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === "h") hooks.onHintKey();
    else if (key === "r") hooks.onRestartKey();
    else if (key === "m") hooks.onMuteKey();
    else if (key === "enter" || key === " ") hooks.onConfirmKey();
    else if (key === "1" || key === "2" || key === "3") {
      hooks.onRoundKey(Number(key) - 1);
    }
  });
}
