/**
 * Web Audio API Sound Synthesizer for Tesla Roadster 2028 App
 * Provides high-fidelity, permission-safe illustrative synthetic audio.
 * Clearly labeled as synthetic / illustrative — never claimed as authentic Tesla recordings.
 */

class RoadsterAudioEngine {
  constructor() {
    this.ctx = null;
    this.currentTrack = null;
    this.activeNodes = [];
    this.volume = 0.8;
    this.isMuted = false;
    this.gainNode = null;
    this.onStateChange = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.onStateChange) this.onStateChange();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.onStateChange) this.onStateChange();
    return this.isMuted;
  }

  stopAll() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // node already stopped
      }
    });
    this.activeNodes = [];
    this.currentTrack = null;
    if (this.onStateChange) this.onStateChange();
  }

  playMotorSound() {
    this.init();
    this.stopAll();
    this.currentTrack = 'motor';
    if (this.onStateChange) this.onStateChange();

    const t = this.ctx.currentTime;
    
    // Dual electric motors with harmonic resonance
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    
    const trackGain = this.ctx.createGain();
    trackGain.gain.setValueAtTime(0.001, t);
    trackGain.gain.linearRampToValueAtTime(0.25, t + 0.4);

    // Motor frequency oscillation (hum)
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(140, t);
    osc1.frequency.linearRampToValueAtTime(260, t + 3);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(280, t);
    osc2.frequency.linearRampToValueAtTime(520, t + 3);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(70, t);

    osc1.connect(filter);
    osc2.connect(filter);
    subOsc.connect(filter);
    filter.connect(trackGain);
    trackGain.connect(this.gainNode);

    osc1.start(t);
    osc2.start(t);
    subOsc.start(t);

    this.activeNodes.push(osc1, osc2, subOsc, filter, trackGain);

    // Subtle continuous pitch modulation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(4, t);
    lfoGain.gain.setValueAtTime(8, t);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfo.start(t);
    this.activeNodes.push(lfo, lfoGain);
  }

  playAccelerationSound() {
    this.init();
    this.stopAll();
    this.currentTrack = 'acceleration';
    if (this.onStateChange) this.onStateChange();

    const t = this.ctx.currentTime;
    const duration = 4.5;

    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const trackGain = this.ctx.createGain();

    osc.type = 'sawtooth';
    oscHarmonic.type = 'sine';
    filter.type = 'lowpass';

    // Acceleration curve: rapid pitch rise mimicking 0-60 mph launch
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(1100, t + duration * 0.7);
    osc.frequency.linearRampToValueAtTime(1300, t + duration);

    oscHarmonic.frequency.setValueAtTime(240, t);
    oscHarmonic.frequency.exponentialRampToValueAtTime(2200, t + duration * 0.7);

    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(3500, t + duration * 0.7);

    trackGain.gain.setValueAtTime(0.01, t);
    trackGain.gain.linearRampToValueAtTime(0.35, t + 0.3);
    trackGain.gain.setValueAtTime(0.35, t + duration - 0.5);
    trackGain.gain.linearRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(trackGain);
    trackGain.connect(this.gainNode);

    osc.start(t);
    oscHarmonic.start(t);
    osc.stop(t + duration);
    oscHarmonic.stop(t + duration);

    this.activeNodes.push(osc, oscHarmonic, filter, trackGain);

    setTimeout(() => {
      if (this.currentTrack === 'acceleration') {
        this.stopAll();
      }
    }, duration * 1000);
  }

  playThrusterSound(onComplete) {
    this.init();
    this.stopAll();
    this.currentTrack = 'thruster';
    if (this.onStateChange) this.onStateChange();

    const t = this.ctx.currentTime;
    const duration = 4.0;

    // Buffer of white noise filtered to sound like high-pressure cold gas release
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter for rocket hissing roar
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1200, t);
    bandpass.frequency.exponentialRampToValueAtTime(2200, t + 1.2);
    bandpass.frequency.exponentialRampToValueAtTime(700, t + duration);
    bandpass.Q.setValueAtTime(2.5, t);

    // Sub bass pulse
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(80, t);
    subOsc.frequency.linearRampToValueAtTime(45, t + duration);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, t);
    noiseGain.gain.linearRampToValueAtTime(0.4, t + 0.4);
    noiseGain.gain.setValueAtTime(0.35, t + duration - 0.8);
    noiseGain.gain.linearRampToValueAtTime(0.001, t + duration);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.01, t);
    subGain.gain.linearRampToValueAtTime(0.3, t + 0.3);
    subGain.gain.linearRampToValueAtTime(0.001, t + duration);

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(this.gainNode);

    subOsc.connect(subGain);
    subGain.connect(this.gainNode);

    noise.start(t);
    subOsc.start(t);
    noise.stop(t + duration);
    subOsc.stop(t + duration);

    this.activeNodes.push(noise, subOsc, bandpass, noiseGain, subGain);

    setTimeout(() => {
      if (this.currentTrack === 'thruster') {
        this.stopAll();
      }
      if (onComplete) onComplete();
    }, duration * 1000);
  }
}

export const audioService = new RoadsterAudioEngine();
