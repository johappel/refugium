import { AmbientAudioConfig, SingleSoundConfig } from '../types/refugium';

// ============================================================
// Noise Generators
// ============================================================

/**
 * Brown Noise: deep, warm, smooth quality — 1/f² spectrum.
 * Uses a leaky integrator for natural low-pass characteristics.
 */
function fillBrownNoise(data: Float32Array): void {
  let lastOut = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5;
  }
}

/**
 * Pink Noise: Voss-McCartney algorithm — balanced 1/f spectrum.
 * More natural sounding than simple approximations.
 */
function fillPinkNoise(data: Float32Array): void {
  const rows = 7;
  const maxKey = 1 << (rows - 1);
  const column = new Float64Array(rows);
  let runningSum = 0;
  let key = 0;

  for (let i = 0; i < data.length; i++) {
    if (key === 0) {
      for (let r = 0; r < rows; r++) {
        runningSum -= column[r];
        column[r] = Math.random() * 2 - 1;
        runningSum += column[r];
      }
      key = maxKey;
    }
    data[i] = runningSum * 0.11;
    key &= key + 1;
    key ^= key >>> 1;
  }
}

/**
 * Violet Noise: emphasises high frequencies — raindrops, sparkles.
 */
function fillVioletNoise(data: Float32Array): void {
  let lastOut = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    const diff = white - lastOut;
    lastOut = white;
    data[i] = diff * 0.5;
  }
}

/**
 * Blue Noise: emphasises mid-high frequencies — wind, rustling.
 */
function fillBlueNoise(data: Float32Array): void {
  let lastOut = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (white - lastOut) * 0.5;
    data[i] = lastOut * 2;
  }
}

// ============================================================
// Sound Layer Builder
// ============================================================

type SourceNode = AudioBufferSourceNode | OscillatorNode;

interface SoundLayer {
  source: SourceNode;
  nodes: AudioNode[];
}

interface RoomSoundProfile {
  layers: ((ctx: AudioContext, masterGain: GainNode) => SoundLayer)[];
}

function createLFOChain(
  ctx: AudioContext,
  targetParam: AudioParam,
  depth: number,
  rate: number
): OscillatorNode {
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(rate, ctx.currentTime);
  lfoGain.gain.setValueAtTime(depth, ctx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(targetParam);
  lfo.start();
  return lfo;
}

function createNoiseBuffer(
  ctx: AudioContext,
  fillFn: (data: Float32Array) => void,
  duration = 6
): AudioBuffer {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  fillFn(buffer.getChannelData(0));
  return buffer;
}

function createNoiseSource(
  ctx: AudioContext,
  masterGain: GainNode,
  noiseType: 'brown' | 'pink' | 'violet' | 'blue',
  filterType: BiquadFilterType,
  filterFreq: number,
  filterQ: number,
  volume: number,
  lfo?: { rate: number; depth: number; target: 'frequency' | 'gain' }
): SoundLayer {
  const fillMap: Record<string, (d: Float32Array) => void> = {
    brown: fillBrownNoise,
    pink: fillPinkNoise,
    violet: fillVioletNoise,
    blue: fillBlueNoise,
  };

  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx, fillMap[noiseType]);
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
  filter.Q.setValueAtTime(filterQ, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);

  const nodes: AudioNode[] = [source, filter, gain];

  if (lfo) {
    const lfoOsc = createLFOChain(
      ctx,
      lfo.target === 'frequency' ? filter.frequency : gain.gain,
      lfo.depth,
      lfo.rate
    );
    nodes.push(lfoOsc);
  }

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start();

  return { source, nodes };
}

function createDronePair(
  ctx: AudioContext,
  masterGain: GainNode,
  freq1: number,
  freq2: number,
  volume: number,
  lfoRate = 0.03,
  lfoDepth = 2
): SoundLayer {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq1, ctx.currentTime);
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq2, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq1 * 4, ctx.currentTime);
  filter.Q.setValueAtTime(0.3, ctx.currentTime);

  const nodes: AudioNode[] = [osc1, osc2, gain, filter];

  // Slow LFO on gain for breathing effect
  nodes.push(createLFOChain(ctx, gain.gain, volume * 0.4, lfoRate));
  // Slow LFO on filter for timbral shift
  nodes.push(createLFOChain(ctx, filter.frequency, lfoDepth * freq1, lfoRate * 0.7));

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  osc1.start();
  osc2.start();

  return { source: osc1, nodes };
}

function createWarmDrone(
  ctx: AudioContext,
  masterGain: GainNode,
  freq: number,
  volume: number,
  lfoRate = 0.04,
  lfoDepth = 1
): SoundLayer {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 3, ctx.currentTime);
  filter.Q.setValueAtTime(0.5, ctx.currentTime);

  const nodes: AudioNode[] = [osc, gain, filter];
  nodes.push(createLFOChain(ctx, gain.gain, volume * 0.5, lfoRate));
  nodes.push(createLFOChain(ctx, filter.frequency, lfoDepth * freq, lfoRate * 0.8));

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  osc.start();

  return { source: osc, nodes };
}

// ============================================================
// Room Sound Profiles
// Each room is built from multiple layered sources for richness.
// ============================================================

const ROOM_PROFILES: Record<string, RoomSoundProfile> = {
  rain: {
    layers: [
      // Deep, distant weather bed — the storm stays outside
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'lowpass', 220, 0.18, 0.12, { rate: 0.05, depth: 35, target: 'frequency' }),
      // Soft rain body — muted by glass and distance
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'lowpass', 650, 0.35, 0.07, { rate: 0.08, depth: 90, target: 'frequency' }),
      // A faint window texture so the rain does not feel fully indoors
      (ctx, m) =>
        createNoiseSource(ctx, m, 'violet', 'bandpass', 2200, 1.1, 0.012, { rate: 0.1, depth: 180, target: 'frequency' }),
    ],
  },

  library: {
    layers: [
      // Very deep room tone — old wood, thick walls
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'lowpass', 120, 0.15, 0.1, { rate: 0.03, depth: 30, target: 'frequency' }),
      // Warm crackle — paper, settling wood, quiet warmth
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'bandpass', 700, 0.8, 0.06),
      // Subtle high shimmer — candle flicker, dust motes
      (ctx, m) =>
        createNoiseSource(ctx, m, 'blue', 'lowpass', 3500, 0.3, 0.015),
    ],
  },

  wind: {
    layers: [
      // Deep wind — through trees, across fields
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'lowpass', 200, 0.2, 0.2, { rate: 0.05, depth: 80, target: 'frequency' }),
      // Mid wind — through leaves, against glass
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'lowpass', 700, 0.6, 0.12, { rate: 0.08, depth: 250, target: 'frequency' }),
      // High whistling — gaps, branches, edges
      (ctx, m) =>
        createNoiseSource(ctx, m, 'blue', 'bandpass', 2200, 2.5, 0.03, { rate: 0.15, depth: 600, target: 'frequency' }),
    ],
  },

  train: {
    layers: [
      // Deep rail rumble
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'lowpass', 100, 0.3, 0.2, { rate: 0.12, depth: 25, target: 'frequency' }),
      // Mid rattle — wagon vibration
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'lowpass', 350, 0.5, 0.08, { rate: 0.18, depth: 80, target: 'frequency' }),
      // High steel-on-steel, wind on train body
      (ctx, m) =>
        createNoiseSource(ctx, m, 'blue', 'lowpass', 1800, 0.25, 0.03),
      // Rhythmic clack — amplitude-modulated low sine
      (ctx, m) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const modOsc = ctx.createOscillator();
        const modGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(75, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        modOsc.frequency.setValueAtTime(1.1, ctx.currentTime);
        modGain.gain.setValueAtTime(0.03, ctx.currentTime);
        modOsc.connect(modGain);
        modGain.connect(gain.gain);
        osc.connect(gain);
        gain.connect(m);
        osc.start();
        modOsc.start();
        return { source: osc, nodes: [osc, gain, modOsc, modGain] };
      },
    ],
  },

  space: {
    layers: [
      // Deep cosmic drone — two slightly detuned sines create a slow beat
      (ctx, m) => createDronePair(ctx, m, 48, 48.35, 0.08, 0.025, 3),
      // Warm sub-harmonic
      (ctx, m) => createWarmDrone(ctx, m, 72, 0.04, 0.035, 1.5),
      // Ethereal high shimmer — very subtle
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'lowpass', 120, 0.08, 0.04, { rate: 0.02, depth: 30, target: 'frequency' }),
    ],
  },

  water: {
    layers: [
      // Gentle flowing water
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'bandpass', 350, 0.8, 0.15, { rate: 0.08, depth: 120, target: 'frequency' }),
      // Bright water drops, small splashes
      (ctx, m) =>
        createNoiseSource(ctx, m, 'violet', 'bandpass', 1800, 2.0, 0.04, { rate: 0.15, depth: 500, target: 'frequency' }),
      // Subtle mist hum
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'lowpass', 500, 0.4, 0.06),
    ],
  },

  forest: {
    layers: [
      // Deep wind and earth hum
      (ctx, m) => createNoiseSource(ctx, m, 'brown', 'lowpass', 180, 0.25, 0.18, { rate: 0.04, depth: 50, target: 'frequency' }),
      // Rustling leaves and soft branches
      (ctx, m) => createNoiseSource(ctx, m, 'pink', 'bandpass', 900, 0.8, 0.1, { rate: 0.09, depth: 350, target: 'frequency' }),
      // High forest air and light wind gusts
      (ctx, m) => createNoiseSource(ctx, m, 'blue', 'lowpass', 2500, 0.4, 0.03, { rate: 0.12, depth: 400, target: 'frequency' }),
      // Synthesized distant warm birds / crickets (sine impulses)
      (ctx, m) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const modOsc = ctx.createOscillator();
        const modGain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        
        modOsc.frequency.setValueAtTime(0.05, ctx.currentTime); // extremely slow impulse
        modGain.gain.setValueAtTime(0.015, ctx.currentTime);
        
        modOsc.connect(modGain);
        modGain.connect(gain.gain);
        osc.connect(gain);
        gain.connect(m);
        
        osc.start();
        modOsc.start();
        return { source: osc, nodes: [osc, gain, modOsc, modGain] };
      }
    ]
  },

  ocean: {
    layers: [
      // Deep rolling ocean waves
      (ctx, m) => createNoiseSource(ctx, m, 'brown', 'lowpass', 150, 0.3, 0.24, { rate: 0.06, depth: 60, target: 'frequency' }),
      // Wave foam and sand wash
      (ctx, m) => createNoiseSource(ctx, m, 'pink', 'lowpass', 600, 0.4, 0.16, { rate: 0.06, depth: 200, target: 'frequency' }),
      // High crests and splashing water droplets
      (ctx, m) => createNoiseSource(ctx, m, 'violet', 'bandpass', 1800, 1.2, 0.06, { rate: 0.06, depth: 400, target: 'frequency' })
    ]
  },

  submarine: {
    layers: [
      // Deep hull resonance drone (detuned sines)
      (ctx, m) => createDronePair(ctx, m, 60, 60.4, 0.14, 0.02, 2),
      // Hydrophone hum
      (ctx, m) => createWarmDrone(ctx, m, 180, 0.06, 0.03, 1.2),
      // Sonar ping in distance (highly filtered low sine impulse)
      (ctx, m) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const modOsc = ctx.createOscillator();
        const modGain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // sonar frequency
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        
        modOsc.frequency.setValueAtTime(0.08, ctx.currentTime); // every 12 seconds
        modGain.gain.setValueAtTime(0.01, ctx.currentTime);
        
        modOsc.connect(modGain);
        modGain.connect(gain.gain);
        osc.connect(gain);
        gain.connect(m);
        
        osc.start();
        modOsc.start();
        return { source: osc, nodes: [osc, gain, modOsc, modGain] };
      },
      // Submerged water bubbles passing the hull
      (ctx, m) => createNoiseSource(ctx, m, 'brown', 'bandpass', 300, 2.0, 0.05, { rate: 0.15, depth: 80, target: 'frequency' })
    ]
  },

  silence: {
    layers: [
      // Barely-there room tone — just enough to break absolute silence
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'lowpass', 80, 0.08, 0.02),
    ],
  },
};

// ============================================================
// Audio Service — manages room transitions & single sounds
// ============================================================

interface ActiveRoom {
  layers: SoundLayer[];
  gainNode: GainNode;
  config: AmbientAudioConfig;
}

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeRoom: ActiveRoom | null = null;
  private transitioningRoom: ActiveRoom | null = null;
  private transitionTimer: number | null = null;
  private isPlaying = false;
  private singleSoundTimers: number[] = [];

  // -- Lifecycle --

  public init(): Promise<void> {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      return this.ctx.resume();
    }
    return Promise.resolve();
  }

  public stopAll(): void {
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
      this.transitionTimer = null;
    }
    if (this.activeRoom) {
      this.destroyRoom(this.activeRoom);
      this.activeRoom = null;
    }
    if (this.transitioningRoom) {
      this.destroyRoom(this.transitioningRoom);
      this.transitioningRoom = null;
    }
    this.clearSingleSoundTimers();
    this.isPlaying = false;
  }

  // -- Volume --

  public setMuted(muted: boolean): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 1.0, now + 0.6);
  }

  // -- Room Playback --

  public playRoomAudio(config: AmbientAudioConfig, singleConfigs?: SingleSoundConfig[]): void {
    if (!this.ctx || !this.masterGain) return;

    // Fade out and destroy any existing room
    if (this.activeRoom) {
      this.fadeOutRoom(this.activeRoom, 2);
      this.activeRoom = null;
    }
    if (this.transitioningRoom) {
      this.destroyRoom(this.transitioningRoom);
      this.transitioningRoom = null;
    }

    this.clearSingleSoundTimers();

    const newRoom = this.createRoom(config, 0.001, config.volume, 4.5);
    this.activeRoom = newRoom;
    this.isPlaying = true;

    if (singleConfigs && singleConfigs.length > 0) {
      this.scheduleSingleSounds(singleConfigs);
    }
  }

  // -- Crossfade Transition --

  /** Start a slow crossfade: new room fades in, old room fades out. */
  public beginTransitionTo(config: AmbientAudioConfig, durationSeconds = 10): void {
    if (!this.ctx || !this.masterGain) return;

    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
      this.transitionTimer = null;
    }
    this.clearSingleSoundTimers();

    // Create the target room at near-silence, begin slow fade-in
    const targetRoom = this.createRoom(
      config,
      0.001,
      Math.max(0.02, config.volume * 0.4),
      durationSeconds * 0.55
    );
    this.transitioningRoom = targetRoom;

    // Fade out the old room
    if (this.activeRoom) {
      this.fadeOutRoom(this.activeRoom, durationSeconds * 0.72);
    }
  }

  /** Complete the transition: destroy old room, ramp new room to full. */
  public finalizeTransition(config: AmbientAudioConfig, singleConfigs?: SingleSoundConfig[]): void {
    if (!this.ctx || !this.transitioningRoom) return;

    const now = this.ctx.currentTime;
    const targetRoom = this.transitioningRoom;
    this.transitioningRoom = null;

    // Destroy the old room
    if (this.activeRoom) {
      this.destroyRoom(this.activeRoom);
      this.activeRoom = null;
    }

    // Ramp the new room up to its full target volume
    targetRoom.gainNode.gain.cancelScheduledValues(now);
    targetRoom.gainNode.gain.setValueAtTime(
      Math.max(targetRoom.gainNode.gain.value, 0.001),
      now
    );
    targetRoom.gainNode.gain.linearRampToValueAtTime(config.volume, now + 3.5);

    this.activeRoom = targetRoom;
    this.isPlaying = true;

    if (singleConfigs && singleConfigs.length > 0) {
      this.scheduleSingleSounds(singleConfigs);
    }
  }

  // -- Helpers --

  private createRoom(
    config: AmbientAudioConfig,
    startVol: number,
    targetVol: number | null,
    fadeSeconds: number
  ): ActiveRoom {
    if (!this.ctx || !this.masterGain) {
      throw new Error('AudioContext must be initialised before creating a room.');
    }

    const profile = ROOM_PROFILES[config.type];
    if (!profile) {
      throw new Error(`Unknown sound profile type: ${config.type}`);
    }

    const roomGain = this.ctx.createGain();
    roomGain.gain.setValueAtTime(startVol, this.ctx.currentTime);
    roomGain.connect(this.masterGain);

    const layers = profile.layers.map((layerFn) => layerFn(this.ctx!, roomGain));

    if (targetVol !== null && fadeSeconds > 0) {
      roomGain.gain.linearRampToValueAtTime(targetVol, this.ctx.currentTime + fadeSeconds);
    }

    return { layers, gainNode: roomGain, config };
  }

  private fadeOutRoom(room: ActiveRoom, duration: number): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    room.gainNode.gain.cancelScheduledValues(now);
    room.gainNode.gain.setValueAtTime(
      Math.max(room.gainNode.gain.value, 0.001),
      now
    );
    room.gainNode.gain.linearRampToValueAtTime(0.001, now + duration);
  }

  private destroyRoom(room: ActiveRoom): void {
    room.layers.forEach((layer) => {
      try {
        layer.source.stop();
      } catch {
        /* already stopped */
      }
      layer.nodes.forEach((node) => {
        try {
          node.disconnect();
        } catch {
          /* already disconnected */
        }
      });
    });
    try {
      room.gainNode.disconnect();
    } catch {
      /* already disconnected */
    }
  }

  // -- Single Sounds (bells, chimes, thunder) --

  private scheduleSingleSounds(configs: SingleSoundConfig[]): void {
    this.clearSingleSoundTimers();

    configs.forEach((conf) => {
      const scheduleNext = () => {
        if (!this.isPlaying) return;

        const delay =
          (Math.random() * (conf.intervalMax - conf.intervalMin) + conf.intervalMin) * 1000;
        const timerId = window.setTimeout(() => {
          this.playSingleTone(conf);
          scheduleNext();
        }, delay);
        this.singleSoundTimers.push(timerId);
      };
      scheduleNext();
    });
  }

  private playSingleTone(conf: SingleSoundConfig): void {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type =
      conf.type === 'sine' || conf.type === 'bell' || conf.type === 'chime'
        ? 'sine'
        : 'triangle';
    osc.frequency.setValueAtTime(conf.frequency, now);

    // Second oscillator for a richer, slightly-detuned harmonic
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(conf.frequency * 2.01, now);
    gain2.gain.setValueAtTime(0.001, now);

    if (conf.type === 'thunder') {
      osc.frequency.linearRampToValueAtTime(conf.frequency * 0.6, now + 3);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 2);
      gain.gain.linearRampToValueAtTime(0.001, now + 5);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 5.1);
    } else if (conf.type === 'bell' || conf.type === 'chime') {
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 4.0);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.05, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(this.masterGain!);
      gain2.connect(this.masterGain!);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 4.1);
      osc2.stop(now + 2.6);
    } else {
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.001, now + 2.0);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 2.1);
    }
  }

  private clearSingleSoundTimers(): void {
    this.singleSoundTimers.forEach((t) => clearTimeout(t));
    this.singleSoundTimers = [];
  }
}

export const audioService = new AudioService();
