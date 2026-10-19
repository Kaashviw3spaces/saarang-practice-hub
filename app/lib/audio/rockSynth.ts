/**
 * Web Audio API Rock & Metal Synthesizer
 * 100% self-contained: zero external audio files, pure browser synthesis.
 * Uses polyphonic saw oscillators, distortion waveshaping, resonant cabinet filtering,
 * and high-voltage guitar string harmonics.
 */

class RockSynthEngine {
  private ctx: AudioContext | null = null;
  private distortionCurve: Float32Array | null = null;

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Generates warm tube amplifier overdrive distortion transfer curve
  private getDistortionCurve(amount = 50): Float32Array {
    if (this.distortionCurve) return this.distortionCurve;
    const k = amount;
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    this.distortionCurve = curve;
    return curve;
  }

  /**
   * Plays a heavy rock/metal fifth power chord (E-B-E)
   * with tube overdrive, cabinet low-pass, and punchy attack
   */
  public playPowerChord(isOverdrive = true): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Guitar Power Chord frequencies (Low E5 Power Chord: E2, B2, E3, G#3)
    const freqs = [82.41, 123.47, 164.81, 207.65];

    // Master bus
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.35, now + 0.04);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    // Distortion shaper
    const distortion = ctx.createWaveShaper();
    distortion.curve = this.getDistortionCurve(isOverdrive ? 65 : 20) as Float32Array<ArrayBuffer>;
    distortion.oversample = "4x";

    // Cabinet simulation filter (Marshall 4x12 roll-off around 3.8kHz)
    const cabFilter = ctx.createBiquadFilter();
    cabFilter.type = "lowpass";
    cabFilter.frequency.setValueAtTime(isOverdrive ? 4200 : 2800, now);
    cabFilter.Q.setValueAtTime(2.5, now);

    distortion.connect(cabFilter);
    cabFilter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Oscillators for each string
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      // Slight detune for analog chorus/richness
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.5, now);

      const strGain = ctx.createGain();
      // Slight pick strum delay per string (15ms stagger)
      const strStart = now + idx * 0.014;
      strGain.gain.setValueAtTime(0, now);
      strGain.gain.setValueAtTime(0.28, strStart);
      strGain.gain.exponentialRampToValueAtTime(0.001, strStart + 1.6);

      osc.connect(strGain);
      strGain.connect(distortion);

      osc.start(strStart);
      osc.stop(strStart + 1.8);
    });
  }

  /**
   * Plays an individual guitar string note with acoustic ring
   * stringIndex: 0 = Low E (82Hz) to 5 = High E (330Hz)
   */
  public playGuitarString(stringIndex: number): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const freqs = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];
    const freq = freqs[Math.max(0, Math.min(stringIndex, freqs.length - 1))];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = stringIndex < 3 ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(freq, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, now);
    filter.Q.setValueAtTime(3, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  /**
   * Mechanical stompbox foot-switch click
   */
  public playStompClick(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.05);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const rockSynth = new RockSynthEngine();

