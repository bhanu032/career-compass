// Standalone Acoustic Formant & Indian Classical Sargam Synthesizer
// Synthesizes human vocal formant tracts (F1, F2, F3), glottal harmonics, and Indian Classical notes (Sa, Re, Ga, Ma, Pa, Dha, Ni)

export interface SargamNote {
  name: string;
  hindi: string;
  frequency: number; // Hz for octave 3
  ratio: number;
  durationMs: number;
  description: string;
}

export const SARGAM_SCALE: SargamNote[] = [
  { name: 'Sa', hindi: 'सा (षड्ज)', frequency: 130.81, ratio: 1.0, durationMs: 650, description: 'Tonic Root (Shadja)' },
  { name: 'Re (Komal)', hindi: 'रे॒ (कोमल ऋषभ)', frequency: 138.59, ratio: 16 / 15, durationMs: 500, description: 'Flat Second' },
  { name: 'Re (Shuddha)', hindi: 'रे (शुद्ध ऋषभ)', frequency: 146.83, ratio: 9 / 8, durationMs: 550, description: 'Major Second' },
  { name: 'Ga (Komal)', hindi: 'ग॒ (कोमल गंधार)', frequency: 155.56, ratio: 6 / 5, durationMs: 500, description: 'Minor Third' },
  { name: 'Ga (Shuddha)', hindi: 'ग (शुद्ध गंधार)', frequency: 164.81, ratio: 5 / 4, durationMs: 600, description: 'Major Third' },
  { name: 'Ma (Shuddha)', hindi: 'म (शुद्ध मध्यम)', frequency: 174.61, ratio: 4 / 3, durationMs: 550, description: 'Perfect Fourth' },
  { name: 'Ma (Teevra)', hindi: 'म॑ (तीव्र मध्यम)', frequency: 185.00, ratio: 45 / 32, durationMs: 500, description: 'Augmented Fourth' },
  { name: 'Pa', hindi: 'प (पंचम)', frequency: 196.00, ratio: 3 / 2, durationMs: 650, description: 'Dominant Fifth (Pancham)' },
  { name: 'Dha (Komal)', hindi: 'ध॒ (कोमल धैवत)', frequency: 207.65, ratio: 8 / 5, durationMs: 500, description: 'Minor Sixth' },
  { name: 'Dha (Shuddha)', hindi: 'ध (शुद्ध धैवत)', frequency: 220.00, ratio: 5 / 3, durationMs: 550, description: 'Major Sixth' },
  { name: 'Ni (Komal)', hindi: 'नि॒ (कोमल निषाद)', frequency: 233.08, ratio: 9 / 5, durationMs: 500, description: 'Minor Seventh' },
  { name: 'Ni (Shuddha)', hindi: 'नि (शुद्ध निषाद)', frequency: 246.94, ratio: 15 / 8, durationMs: 600, description: 'Major Seventh' },
  { name: 'Taar Sa', hindi: 'सां (तार षड्ज)', frequency: 261.63, ratio: 2.0, durationMs: 800, description: 'High Octave Tonic' }
];

export const ROOT_TONICS = [
  { name: 'C3 (130.8 Hz)', baseFreq: 130.81 },
  { name: 'C#3 (138.6 Hz)', baseFreq: 138.59 },
  { name: 'D3 (146.8 Hz)', baseFreq: 146.83 },
  { name: 'D#3 (155.6 Hz)', baseFreq: 155.56 },
  { name: 'E3 (164.8 Hz)', baseFreq: 164.81 },
  { name: 'F3 (174.6 Hz)', baseFreq: 174.61 },
  { name: 'F#3 (185.0 Hz)', baseFreq: 185.00 },
  { name: 'G3 (196.0 Hz)', baseFreq: 196.00 },
  { name: 'A3 (220.0 Hz)', baseFreq: 220.00 }
];

class CustomAcousticSynth {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;

  private initAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Synthesize a single Indian Classical Sargam note with rich vocal formants & vibrato
   */
  public playSargamNote({
    note,
    baseFrequency = 130.81,
    durationMs = 600,
    vibratoDepth = 25,
    vibratoSpeed = 5.5,
    gain = 0.4
  }: {
    note: SargamNote;
    baseFrequency?: number;
    durationMs?: number;
    vibratoDepth?: number;
    vibratoSpeed?: number;
    gain?: number;
  }) {
    const ctx = this.initAudio();
    if (!ctx) return;

    const actualFreq = baseFrequency * note.ratio;
    const now = ctx.currentTime;
    const durSec = durationMs / 1000;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(gain, now + 0.06);
    masterGain.gain.exponentialRampToValueAtTime(gain * 0.8, now + durSec * 0.7);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durSec);

    // Formant filter (vocal tract resonance for vocal "Aa/O" alaap timbre)
    const filterF1 = ctx.createBiquadFilter();
    filterF1.type = 'bandpass';
    filterF1.frequency.setValueAtTime(750, now);
    filterF1.Q.setValueAtTime(4.0, now);

    const filterF2 = ctx.createBiquadFilter();
    filterF2.type = 'bandpass';
    filterF2.frequency.setValueAtTime(1250, now);
    filterF2.Q.setValueAtTime(5.0, now);

    // Primary Glottal Oscillator (Sawtooth harmonic richness)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(actualFreq, now);

    // Sub-oscillator for warmth
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(actualFreq / 2, now);

    // Vibrato LFO
    if (vibratoDepth > 0) {
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(vibratoSpeed, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(vibratoDepth * 0.15, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + durSec + 0.1);
    }

    // Connect audio graph
    osc.connect(filterF1);
    osc.connect(filterF2);
    subOsc.connect(masterGain);
    filterF1.connect(masterGain);
    filterF2.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + durSec);
    subOsc.stop(now + durSec);
  }

  /**
   * Play an entire Sargam melody sequence (e.g. Sa Re Ga Ma Pa Dha Ni Sa)
   */
  public async playSequence({
    notes,
    baseFreq = 130.81,
    tempoBpm = 80,
    vibratoDepth = 30,
    onNoteChange
  }: {
    notes: SargamNote[];
    baseFreq?: number;
    tempoBpm?: number;
    vibratoDepth?: number;
    onNoteChange?: (index: number) => void;
  }) {
    this.isPlaying = true;
    const noteDuration = (60 / tempoBpm) * 1000;

    for (let i = 0; i < notes.length; i++) {
      if (!this.isPlaying) break;
      if (onNoteChange) onNoteChange(i);
      this.playSargamNote({
        note: notes[i],
        baseFrequency: baseFreq,
        durationMs: noteDuration * 0.92,
        vibratoDepth
      });
      await new Promise((r) => setTimeout(r, noteDuration));
    }

    if (onNoteChange) onNoteChange(-1);
    this.isPlaying = false;
  }

  public stop() {
    this.isPlaying = false;
  }
}

export const customAcousticSynth = new CustomAcousticSynth();
