/**
 * Web Audio API Rock & Metal Synthesizer & Live Background Audio Engine
 * 100% self-contained: zero external audio files, pure browser synthesis.
 * Features:
 * - Live Background Microphone Input Analyzer for VU needle movement
 * - Polyphonic rock power chords with Marshall cabinet simulation
 * - Physical electric guitar string synthesis with pick attack transients & harmonics
 * - Tactile mechanical stompbox clicks
 */

export interface LiveAudioLevel {
  rms: number;      // 0.0 to 1.0 (Root-Mean-Square volume)
  peak: number;     // 0.0 to 1.0 (Peak instantaneous amplitude)
  db: number;       // Approx decibels (-60dB to +3dB)
  isMicActive: boolean;
  hasAudio: boolean;
}

class RockSynthEngine {
  private ctx: AudioContext | null = null;
  private distortionCurve: Float32Array | null = null;
  private analyserNode: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private micState: "inactive" | "active" | "denied" | "error" = "inactive";
  private timeDomainBuffer: Uint8Array<ArrayBuffer> | null = null;

  /**
   * Initializes or returns the existing AudioContext.
   * Lazily resumes context upon user gesture.
   */
  public initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.setupMasterNodes();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private setupMasterNodes(): void {
    if (!this.ctx) return;

    // Master bus gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    // Master analyser for VU meter & visualizers
    this.analyserNode = this.ctx.createAnalyser();
    this.analyserNode.fftSize = 512;
    this.analyserNode.smoothingTimeConstant = 0.45;
    this.timeDomainBuffer = new Uint8Array(new ArrayBuffer(this.analyserNode.fftSize));

    // Route: Synths -> Analyser -> MasterGain -> Destination
    this.analyserNode.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  // Generates warm tube amplifier overdrive distortion transfer curve
  private getDistortionCurve(amount = 55): Float32Array {
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
   * Connects to the user's background microphone stream
   * to drive the VU meter needle based on real room noise, speech, or music.
   */
  public async enableMic(): Promise<{ success: boolean; state: string }> {
    const ctx = this.initContext();
    if (!ctx) return { success: false, state: "no-context" };

    if (this.micStream && this.micSource) {
      this.micState = "active";
      return { success: true, state: "active" };
    }

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        this.micState = "denied";
        return { success: false, state: "unsupported" };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });

      this.micStream = stream;
      this.micSource = ctx.createMediaStreamSource(stream);

      // Connect mic to analyser ONLY (NEVER to destination, to prevent screeching feedback!)
      if (this.analyserNode) {
        this.micSource.connect(this.analyserNode);
      }

      this.micState = "active";
      return { success: true, state: "active" };
    } catch (err: unknown) {
      console.warn("Microphone access could not be acquired:", err);
      this.micState = "denied";
      return { success: false, state: "denied" };
    }
  }

  /**
   * Disconnects the microphone stream.
   */
  public disableMic(): void {
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      try {
        this.micSource.disconnect();
      } catch {}
      this.micSource = null;
    }
    this.micState = "inactive";
  }

  public getMicState(): "inactive" | "active" | "denied" | "error" {
    return this.micState;
  }

  /**
   * Measures current RMS and peak audio volume in real-time.
   * Feeds both background microphone and internal guitar/overdrive synthesis.
   */
  public getLiveAudioLevel(): LiveAudioLevel {
    if (!this.analyserNode || !this.timeDomainBuffer) {
      return {
        rms: 0,
        peak: 0,
        db: -60,
        isMicActive: this.micState === "active",
        hasAudio: false,
      };
    }

    this.analyserNode.getByteTimeDomainData(this.timeDomainBuffer);

    let sumSquares = 0;
    let peak = 0;
    const len = this.timeDomainBuffer.length;

    for (let i = 0; i < len; i++) {
      // Byte values range from 0 to 255 with 128 as the center zero
      const norm = (this.timeDomainBuffer[i] - 128) / 128;
      const abs = Math.abs(norm);
      if (abs > peak) peak = abs;
      sumSquares += norm * norm;
    }

    const rms = Math.sqrt(sumSquares / len);
    const db = rms > 0.0002 ? 20 * Math.log10(rms) : -60;
    const hasAudio = rms > 0.012 || peak > 0.035;

    return {
      rms,
      peak,
      db,
      isMicActive: this.micState === "active",
      hasAudio,
    };
  }

  /**
   * Plays a heavy rock/metal fifth power chord (E-B-E)
   * with tube overdrive, cabinet low-pass, and punchy attack
   */
  public playPowerChord(isOverdrive = true): void {
    const ctx = this.initContext();
    if (!ctx || !this.analyserNode) return;

    const now = ctx.currentTime;

    // Guitar Power Chord frequencies (Low E5 Power Chord: E2, B2, E3, G#3)
    const freqs = [82.41, 123.47, 164.81, 207.65];

    // Sub master for chord
    const chordGain = ctx.createGain();
    chordGain.gain.setValueAtTime(0.01, now);
    chordGain.gain.linearRampToValueAtTime(0.4, now + 0.03);
    chordGain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

    // Distortion shaper
    const distortion = ctx.createWaveShaper();
    distortion.curve = this.getDistortionCurve(isOverdrive ? 70 : 25) as Float32Array<ArrayBuffer>;
    distortion.oversample = "4x";

    // Cabinet simulation filter (Marshall 4x12 roll-off around 3.8kHz)
    const cabFilter = ctx.createBiquadFilter();
    cabFilter.type = "lowpass";
    cabFilter.frequency.setValueAtTime(isOverdrive ? 4200 : 2900, now);
    cabFilter.Q.setValueAtTime(2.5, now);

    distortion.connect(cabFilter);
    cabFilter.connect(chordGain);
    chordGain.connect(this.analyserNode);

    // Oscillators for each string
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.6, now);

      const strGain = ctx.createGain();
      const strStart = now + idx * 0.014;
      strGain.gain.setValueAtTime(0, now);
      strGain.gain.setValueAtTime(0.3, strStart);
      strGain.gain.exponentialRampToValueAtTime(0.001, strStart + 1.7);

      osc.connect(strGain);
      strGain.connect(distortion);

      osc.start(strStart);
      osc.stop(strStart + 1.9);
    });
  }

  /**
   * Plays an individual guitar string note with realistic electric guitar pick transient,
   * dual-oscillator body, and decay resonance.
   * stringIndex: 0 = Low E (82.4Hz) to 5 = High E (329.6Hz)
   */
  public playGuitarString(stringIndex: number, isOverdrive = false): void {
    const ctx = this.initContext();
    if (!ctx || !this.analyserNode) return;

    // Standard Guitar Tuning: E2, A2, D3, G3, B3, E4
    const freqs = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];
    const freq = freqs[Math.max(0, Math.min(stringIndex, freqs.length - 1))];
    const now = ctx.currentTime;

    // Master node for this string pluck
    const stringMasterGain = ctx.createGain();
    stringMasterGain.gain.setValueAtTime(0.4, now);
    stringMasterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    // 1. Pick Attack Transient (High-frequency plectrum strike against steel string)
    const pickNoise = ctx.createOscillator();
    pickNoise.type = "square";
    pickNoise.frequency.setValueAtTime(2400 + stringIndex * 300, now);
    pickNoise.frequency.exponentialRampToValueAtTime(300, now + 0.02);

    const pickGain = ctx.createGain();
    pickGain.gain.setValueAtTime(0.25, now);
    pickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    pickNoise.connect(pickGain);
    pickGain.connect(stringMasterGain);
    pickNoise.start(now);
    pickNoise.stop(now + 0.03);

    // 2. Fundamental Oscillator (Body & punch)
    const osc1 = ctx.createOscillator();
    osc1.type = stringIndex < 3 ? "sawtooth" : "triangle";
    osc1.frequency.setValueAtTime(freq, now);

    // 3. Second Detuned Harmonic Oscillator (Metallic shimmer & chorus)
    const osc2 = ctx.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(freq * (stringIndex < 3 ? 2.0 : 1.0) + 1.2, now);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(stringIndex < 3 ? 0.18 : 0.09, now);

    // Dynamic Tone Filter (Sweeps down as string energy dissipates)
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    const startCutoff = isOverdrive ? 4800 : 3400 + stringIndex * 200;
    filter.frequency.setValueAtTime(startCutoff, now);
    filter.frequency.exponentialRampToValueAtTime(700, now + 1.2);
    filter.Q.setValueAtTime(isOverdrive ? 3.5 : 2.2, now);

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);

    if (isOverdrive) {
      // Route through tube overdrive shaper
      const distortion = ctx.createWaveShaper();
      distortion.curve = this.getDistortionCurve(50) as Float32Array<ArrayBuffer>;
      distortion.oversample = "2x";
      filter.connect(distortion);
      distortion.connect(stringMasterGain);
    } else {
      filter.connect(stringMasterGain);
    }

    // Connect to analyser so needle responds to plucked string!
    stringMasterGain.connect(this.analyserNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.45);
    osc2.stop(now + 1.45);
  }

  /**
   * Mechanical stompbox foot-switch click
   */
  public playStompClick(): void {
    const ctx = this.initContext();
    if (!ctx || !this.analyserNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.05);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.analyserNode);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const rockSynth = new RockSynthEngine();
