export type ClickTone = "jitter" | "butterfly" | "rightClick" | "spacebar" | "cps";

export interface ClickSoundEngine {
  resume(): Promise<void>;
  suspend(): Promise<void>;
  play(tone: ClickTone): void;
  destroy(): Promise<void>;
}

const TONE_FREQUENCIES: Record<ClickTone, number> = {
  jitter: 900,
  butterfly: 850,
  rightClick: 700,
  spacebar: 400,
  cps: 800,
};

class BrowserClickSoundEngine implements ClickSoundEngine {
  private readonly ctx: AudioContext;

  constructor(AudioContextCtor: typeof AudioContext) {
    this.ctx = new AudioContextCtor();
  }

  async resume() {
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  async suspend() {
    if (this.ctx.state === "running") {
      await this.ctx.suspend();
    }
  }

  play(tone: ClickTone) {
    if (this.ctx.state !== "running") return;

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const now = this.ctx.currentTime;

    oscillator.type = tone === "spacebar" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(TONE_FREQUENCIES[tone], now);
    oscillator.frequency.exponentialRampToValueAtTime(tone === "spacebar" ? 100 : 300, now + 0.05);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }

  async destroy() {
    if (this.ctx.state !== "closed") {
      await this.ctx.close();
    }
  }
}

export function createClickSoundEngine(): ClickSoundEngine | null {
  if (typeof window === "undefined") return null;

  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextCtor) return null;
  return new BrowserClickSoundEngine(AudioContextCtor);
}
