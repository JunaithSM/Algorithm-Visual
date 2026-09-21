/**
 * Web Audio API Synthesizer for Algorithm Visualizer Sound Effects.
 * Real-time audio tone generation pitched according to array values.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;
  public volume: number = 0.5; // Default master volume (0.0 to 1.0)

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * Plays a pitch tone for element comparison (frequency mapped to array element value).
   */
  public playCompare(val: number = 5, maxVal: number = 20) {
    if (this.muted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const freq = 240 + (Math.max(1, val) / Math.max(1, maxVal)) * 560; // 240Hz to 800Hz
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const targetGain = 0.08 * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // Ignore Web Audio errors
    }
  }

  /**
   * Plays a chirp/slide tone when elements are swapped.
   */
  public playSwap(val1: number = 5, val2: number = 10, maxVal: number = 20) {
    if (this.muted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const f1 = 280 + (val1 / Math.max(1, maxVal)) * 400;
      const f2 = 280 + (val2 / Math.max(1, maxVal)) * 400;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(f1, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f2, this.ctx.currentTime + 0.12);

      const targetGain = 0.12 * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Ignore Web Audio errors
    }
  }

  /**
   * Plays a success chime chord when target is found or sorting completes.
   */
  public playSuccess() {
    if (this.muted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major chord
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.06);

        const targetGain = 0.1 * this.volume;
        gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(targetGain, this.ctx!.currentTime + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.06);
        osc.stop(this.ctx!.currentTime + idx * 0.06 + 0.35);
      });
    } catch {
      // Ignore Web Audio errors
    }
  }

  /**
   * Plays a descending tone when search finishes without match.
   */
  public playFailure() {
    if (this.muted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.25);

      const targetGain = 0.08 * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore Web Audio errors
    }
  }

  /**
   * Plays a crisp pop/tone for pivot selection.
   */
  public playPivot(val: number = 5, maxVal: number = 20) {
    if (this.muted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const freq = 440 + (val / Math.max(1, maxVal)) * 300;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const targetGain = 0.07 * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Ignore Web Audio errors
    }
  }

  /**
   * Plays a smooth rising harmonic tone for merging sub-arrays.
   */
  public playMerge(val: number = 5, maxVal: number = 20) {
    if (this.muted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const freq = 320 + (val / Math.max(1, maxVal)) * 400;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq * 1.2, this.ctx.currentTime + 0.1);

      const targetGain = 0.09 * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // Ignore Web Audio errors
    }
  }

  /**
   * Plays a quick slide tone when an element is shifted.
   */
  public playShift(val: number = 5, maxVal: number = 20) {
    if (this.muted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const freq = 300 + (val / Math.max(1, maxVal)) * 350;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, this.ctx.currentTime + 0.09);

      const targetGain = 0.08 * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Ignore Web Audio errors
    }
  }

  /**
   * Plays a tick sound for counting / bucketing operations.
   */
  public playCount() {
    if (this.muted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);

      const targetGain = 0.05 * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignore Web Audio errors
    }
  }

  /**
   * Plays a random cute retro beep sound when mascot character is talking (Animal Crossing / Celeste style speech chatter).
   */
  public playMascotTalkBeep() {
    if (this.muted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Pick a random pitch in a cute, cheerful pentatonic frequency range (523Hz - 987Hz)
      const cutePitches = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77];
      const freq = cutePitches[Math.floor(Math.random() * cutePitches.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const targetGain = 0.05 * this.volume;
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // Ignore Web Audio errors
    }
  }

  /**
   * Plays a cute cartoon giggling/laughing sound effect.
   */
  public playMascotLaugh() {
    if (this.muted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // 6 rapid bright staccato giggles (C6, E6, G6, E6, G6, C7)
      const laughPitches = [1046.5, 1318.5, 1567.98, 1318.5, 1567.98, 2093.0];
      laughPitches.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.075);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.1, this.ctx!.currentTime + idx * 0.075 + 0.05);

        const targetGain = 0.14 * this.volume;
        gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.075);
        gain.gain.linearRampToValueAtTime(targetGain, this.ctx!.currentTime + idx * 0.075 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.075 + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.075);
        osc.stop(this.ctx!.currentTime + idx * 0.075 + 0.07);
      });
    } catch {
      // Ignore Web Audio errors
    }
  }
}

export const soundFx = new SoundSynthesizer();
