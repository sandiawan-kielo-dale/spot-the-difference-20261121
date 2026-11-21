// audio.js — one job: every sound in the game, synthesized live with
// WebAudio oscillators. No audio files, nothing fetched.
export class SoundBank {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  ensureContext() {
    if (this.context) return;
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    this.context = new AudioContextClass();
  }

  unlock() {
    this.ensureContext();
    if (this.context && this.context.state === "suspended") {
      this.context.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, startAt, duration, type, volume) {
    if (this.muted || !this.context) return;
    const now = this.context.currentTime + startAt;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  playFind() {
    this.unlock();
    this.tone(660, 0, 0.12, "sine", 0.22);
    this.tone(990, 0.09, 0.18, "sine", 0.22);
  }

  playWrong() {
    this.unlock();
    this.tone(160, 0, 0.16, "sawtooth", 0.1);
    this.tone(110, 0.05, 0.2, "sawtooth", 0.08);
  }

  playHint() {
    this.unlock();
    this.tone(520, 0, 0.1, "triangle", 0.16);
    this.tone(780, 0.08, 0.14, "triangle", 0.16);
  }

  playRoundComplete() {
    this.unlock();
    [523, 659, 784, 1047].forEach((freq, i) => {
      this.tone(freq, i * 0.11, 0.22, "triangle", 0.2);
    });
  }

  playWin() {
    this.unlock();
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((freq, i) => {
      this.tone(freq, i * 0.13, 0.26, "triangle", 0.18);
    });
  }

  playTick() {
    this.unlock();
    this.tone(880, 0, 0.05, "square", 0.05);
  }
}
