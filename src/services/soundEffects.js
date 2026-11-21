// Synthesized Web Audio API sound effects for Paní učitelka
// 100% offline, zero lag, works without external audio files!

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.8;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Teacher desk bell: bright crystalline multi-harmonic brass chime
  playDeskBell() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const freqs = [1046.5, 2093, 3136, 4186]; // C6, C7, G7, C8 harmonics
    const weights = [1.0, 0.45, 0.25, 0.12];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(weights[idx] * 0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (idx === 0 ? 1.6 : 0.8));

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 1.7);
    });
  }

  // School bell: realistic loud electric pulsing buzzer/clapper (TRRRRRRRING!)
  playSchoolBell(duration = 2.4) {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Modulated metallic ringing
    const fundamental = 880; // A5
    const secondTone = 1108; // C#6

    [fundamental, secondTone, 1760].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const mod = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const gain = this.ctx.createGain();

      osc.type = i % 2 === 0 ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(freq, t);

      // Tremolo / clapper vibration (24 Hz)
      mod.type = 'square';
      mod.frequency.setValueAtTime(22 + i * 2, t);
      modGain.gain.setValueAtTime(0.2, t);

      mod.connect(gain.gain);

      gain.gain.setValueAtTime(0.25 / (i + 1), t);
      gain.gain.setValueAtTime(0.25 / (i + 1), t + duration - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      mod.start(t);
      osc.start(t);
      mod.stop(t + duration);
      osc.stop(t + duration);
    });
  }

  // Heavy rubber stamp sound for gradebook: punchy thud & snap
  playStamp() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    // 1. Low punch / thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);

    oscGain.gain.setValueAtTime(0.6, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    // 2. High snap click
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snap.type = 'square';
    snap.frequency.setValueAtTime(800, t);
    snap.frequency.exponentialRampToValueAtTime(120, t + 0.05);

    snapGain.gain.setValueAtTime(0.3, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    snap.connect(snapGain);
    snapGain.connect(this.masterGain);

    osc.start(t);
    snap.start(t);
    osc.stop(t + 0.15);
    snap.stop(t + 0.07);
  }

  // Celebratory fanfare chime for Grade 1 / Gold Star
  playCheer() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.1);

      gain.gain.setValueAtTime(0, t);
      gain.gain.setValueAtTime(0.35, t + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + idx * 0.1);
      osc.stop(t + idx * 0.1 + 0.65);
    });
  }

  // Comical cartoon "womp womp" trombone for bad grade / misbehavior
  playUhOh() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.linearRampToValueAtTime(240, t + 0.2);
    osc.frequency.linearRampToValueAtTime(190, t + 0.45);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    // Filter to give it a muted trumpet/trombone effect
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, t);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.6);
  }

  // Paper airplane swoosh
  playWhoosh() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 3.0;
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(1600, t + 0.2);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.42);
  }

  // Tactile button click / bubble pop
  playPop() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(840, t + 0.06);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Random pupil roulette tick
  playTick() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, t);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Pleasant rising chime when mic is ready: "Ding-Dong (Ready to speak!)"
  playMicStart() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [
      { freq: 523.25, time: 0, dur: 0.10 },     // C5
      { freq: 783.99, time: 0.08, dur: 0.18 }   // G5
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + time);

      gain.gain.setValueAtTime(0.18, t + time);
      gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + time);
      osc.stop(t + time + dur + 0.04);
    });
  }

  // Pleasant confirming chime when speech question is captured: "Ding!"
  playMicSuccess() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [
      { freq: 659.25, time: 0, dur: 0.08 },     // E5
      { freq: 880.00, time: 0.07, dur: 0.20 }   // A5
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + time);

      gain.gain.setValueAtTime(0.20, t + time);
      gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + time);
      osc.stop(t + time + dur + 0.04);
    });
  }

  // Soft crystalline marimba chime before teacher speaks
  playTeacherIntro() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [
      { freq: 880.00, time: 0, dur: 0.12 },     // A5
      { freq: 1318.51, time: 0.09, dur: 0.22 }  // E6
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + time);

      gain.gain.setValueAtTime(0.12, t + time);
      gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + time);
      osc.stop(t + time + dur + 0.03);
    });
  }

  // Magical sparkling cascade for praise / gold stars
  playPraiseSparkle() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51]; // C5, E5, G5, B5, C6, E6

    freqs.forEach((freq, idx) => {
      const startTime = t + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }
}

export const sounds = new SoundEngine();
