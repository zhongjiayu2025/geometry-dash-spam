export type WaveSound = "crash" | "win" | "click" | "newBest";

export interface WaveAudioEngine {
  resume(): Promise<void>;
  suspend(): Promise<void>;
  startMusic(onBeat: () => void): void;
  stopMusic(): void;
  playSound(type: WaveSound, isMini: boolean): void;
  destroy(): Promise<void>;
}

class BrowserWaveAudioEngine implements WaveAudioEngine {
  private readonly ctx: AudioContext;
  private readonly masterGain: GainNode;
  private readonly hiHatBuffer: AudioBuffer;
  private readonly crashBuffer: AudioBuffer;
  private scheduler: number | null = null;
  private nextNoteTime = 0;
  private noteIndex = 0;
  private beatCallback: (() => void) | null = null;
  private beatTimers = new Set<number>();

  constructor(AudioContextCtor: typeof AudioContext) {
    this.ctx = new AudioContextCtor();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;

    const delay = this.ctx.createDelay(5);
    delay.delayTime.value = 0.3;

    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.4;

    const delayFilter = this.ctx.createBiquadFilter();
    delayFilter.type = "lowpass";
    delayFilter.frequency.value = 2000;

    this.masterGain.connect(this.ctx.destination);
    this.masterGain.connect(delay);
    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    delayFilter.connect(this.ctx.destination);

    this.hiHatBuffer = this.createNoiseBuffer(0.1);
    this.crashBuffer = this.createNoiseBuffer(0.5);
  }

  private createNoiseBuffer(seconds: number) {
    const buffer = this.ctx.createBuffer(
      1,
      Math.floor(this.ctx.sampleRate * seconds),
      this.ctx.sampleRate
    );
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
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

  private triggerBeatAt(time: number) {
    if (!this.beatCallback) return;

    const delayMs = Math.max(0, (time - this.ctx.currentTime) * 1000);
    const timer = window.setTimeout(() => {
      this.beatTimers.delete(timer);
      this.beatCallback?.();
    }, delayMs);

    this.beatTimers.add(timer);
  }

  private playKick(time: number) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    osc.start(time);
    osc.stop(time + 0.5);
    this.triggerBeatAt(time);
  }

  private playBass(time: number, note: number) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sawtooth";
    const freq = 55 * Math.pow(2, note / 12);
    osc.frequency.setValueAtTime(freq, time);
    osc.detune.setValueAtTime(Math.random() * 20 - 10, time);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, time);
    filter.frequency.exponentialRampToValueAtTime(2000, time + 0.1);
    filter.frequency.exponentialRampToValueAtTime(200, time + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    osc.start(time);
    osc.stop(time + 0.4);
  }

  private playHiHat(time: number) {
    const noise = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    noise.buffer = this.hiHatBuffer;
    filter.type = "highpass";
    filter.frequency.value = 8000;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    gain.gain.setValueAtTime(0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    noise.start(time);
  }

  private scheduleMusic = () => {
    if (this.ctx.state !== "running") return;

    const tempo = 140;
    const secondsPerBeat = 60 / tempo;
    const lookahead = 0.1;

    if (this.nextNoteTime < this.ctx.currentTime - 0.25) {
      this.nextNoteTime = this.ctx.currentTime + 0.05;
    }

    while (this.nextNoteTime < this.ctx.currentTime + lookahead) {
      const sixteenth = this.noteIndex % 16;

      if (sixteenth % 4 === 0) this.playKick(this.nextNoteTime);
      if (sixteenth % 2 === 0 && sixteenth % 4 !== 0) {
        this.playHiHat(this.nextNoteTime);
      }

      let note = 0;
      if (this.noteIndex % 64 >= 32) note = 3;
      if (this.noteIndex % 64 >= 48) note = 5;

      if (sixteenth % 4 !== 0) {
        this.playBass(this.nextNoteTime, note);
      }

      this.nextNoteTime += secondsPerBeat / 4;
      this.noteIndex++;
    }
  };

  startMusic(onBeat: () => void) {
    this.beatCallback = onBeat;
    if (this.scheduler !== null || this.ctx.state !== "running") return;

    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.noteIndex = 0;
    this.scheduler = window.setInterval(this.scheduleMusic, 25);
  }

  stopMusic() {
    if (this.scheduler !== null) {
      window.clearInterval(this.scheduler);
      this.scheduler = null;
    }

    for (const timer of this.beatTimers) {
      window.clearTimeout(timer);
    }
    this.beatTimers.clear();
  }

  playSound(type: WaveSound, isMini: boolean) {
    if (this.ctx.state !== "running") return;

    const now = this.ctx.currentTime;

    if (type === "crash") {
      const noise = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();

      noise.buffer = this.crashBuffer;
      noise.connect(gain);
      gain.connect(this.masterGain);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      noise.start(now);
      return;
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    if (type === "click") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(isMini ? 800 : 600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      return;
    }

    if (type === "win") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.5);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 1);
      osc.start(now);
      osc.stop(now + 1);
      return;
    }

    osc.type = "square";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  async destroy() {
    this.stopMusic();

    if (this.ctx.state !== "closed") {
      await this.ctx.close();
    }
  }
}

export function createWaveAudioEngine(): WaveAudioEngine | null {
  if (typeof window === "undefined") return null;

  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextCtor) return null;
  return new BrowserWaveAudioEngine(AudioContextCtor);
}
