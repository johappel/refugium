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
    const white = Math.random() * 10 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.52;
    data[i] = lastOut * 33.5;
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

type SourceNode = AudioBufferSourceNode | OscillatorNode | MediaElementAudioSourceNode;

interface SoundLayer {
  source: SourceNode;
  nodes: AudioNode[];
  kind?: 'ambient-sample';
  mediaElement?: HTMLAudioElement;
}

interface RoomSoundProfile {
  layers: ((ctx: AudioContext, masterGain: GainNode) => SoundLayer)[];
}

const AMBIENT_GAIN_COMPENSATION = 2.4;

function normalizeAmbientGain(level: number): number {
  return Math.min(1, Math.max(0, level * AMBIENT_GAIN_COMPENSATION));
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

  archive: {
    layers: [
      // Deep room mass — wood, shelves, stone floor
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'lowpass', 110, 0.16, 0.05, { rate: 0.02, depth: 12, target: 'frequency' }),
      // Glassware and cabinets breathing softly in a large room
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'bandpass', 520, 1.1, 0.03, { rate: 0.045, depth: 40, target: 'frequency' }),
      // Fine high air — dust, labels, old chemistry instruments
      (ctx, m) =>
        createNoiseSource(ctx, m, 'blue', 'lowpass', 2100, 0.35, 0.008, { rate: 0.05, depth: 100, target: 'frequency' }),
      // A warm, low institutional hum to make the room feel larger
      (ctx, m) => createWarmDrone(ctx, m, 92, 0.018, 0.015, 2.5),
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
      // Deep, upholstered rail rumble felt through the compartment
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'lowpass', 90, 0.28, 0.12, { rate: 0.1, depth: 20, target: 'frequency' }),
      // Soft cabin vibration in the window frame and wall paneling
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'lowpass', 290, 0.45, 0.045, { rate: 0.12, depth: 45, target: 'frequency' }),
      // Distant air slip outside the window, deliberately muted
      (ctx, m) =>
        createNoiseSource(ctx, m, 'blue', 'lowpass', 1300, 0.2, 0.012),
      // Rhythmic rail joint, softened by the compartment interior
      (ctx, m) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const modOsc = ctx.createOscillator();
        const modGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(72, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        modOsc.frequency.setValueAtTime(0.82, ctx.currentTime);
        modGain.gain.setValueAtTime(0.016, ctx.currentTime);
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

  observatory: {
    layers: [
      // Soft dome resonance: more architecture than cosmos
      (ctx, m) => createDronePair(ctx, m, 54, 54.18, 0.032, 0.018, 2),
      // Cool outside air slipping through the opening
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'lowpass', 140, 0.18, 0.022, { rate: 0.03, depth: 18, target: 'frequency' }),
      // Very faint high shimmer from distant stars and metal edges
      (ctx, m) =>
        createNoiseSource(ctx, m, 'blue', 'bandpass', 1700, 1.2, 0.006, { rate: 0.025, depth: 80, target: 'frequency' }),
      // Room-sized breath in the masonry
      (ctx, m) => createWarmDrone(ctx, m, 86, 0.012, 0.02, 1.8),
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

  courtyard: {
    layers: [
      // Stone bowl and enclosed air
      (ctx, m) => createWarmDrone(ctx, m, 138, 0.012, 0.018, 1.5),
      // Thin, dark water trickle over stone
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'bandpass', 240, 1.0, 0.045, { rate: 0.05, depth: 35, target: 'frequency' }),
      // Occasional brighter edge in the water surface
      (ctx, m) =>
        createNoiseSource(ctx, m, 'violet', 'bandpass', 1300, 1.8, 0.009, { rate: 0.08, depth: 90, target: 'frequency' }),
      // A tiny veil of open night air above the courtyard
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'lowpass', 380, 0.3, 0.012),
    ],
  },

  shoreline: {
    layers: [
      // Low, slow water mass under the mist
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'lowpass', 130, 0.22, 0.07, { rate: 0.04, depth: 26, target: 'frequency' }),
      // Soft lapping against stone and reeds
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'bandpass', 360, 0.8, 0.028, { rate: 0.05, depth: 55, target: 'frequency' }),
      // Almost-hidden mist texture
      (ctx, m) =>
        createNoiseSource(ctx, m, 'blue', 'lowpass', 1400, 0.45, 0.006),
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

  lagoon: {
    layers: [
      // Main cove body that slowly swells and settles
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'lowpass', 170, 0.32, 0.075, { rate: 0.055, depth: 0.03, target: 'gain' }),
      // Softer outer-lip movement with its own slower swell
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'lowpass', 420, 0.55, 0.028, { rate: 0.082, depth: 0.012, target: 'gain' }),
      // A faint moving edge of light on the water, kept very low to avoid hiss
      (ctx, m) =>
        createNoiseSource(ctx, m, 'blue', 'lowpass', 860, 0.24, 0.0045, { rate: 0.03, depth: 38, target: 'frequency' }),
      // A gentle resonant cave bed underneath the water
      (ctx, m) => createWarmDrone(ctx, m, 124, 0.02, 0.014, 2.4),
    ],
  },

  teahouse: {
    layers: [
      // Warm kettle and enclosed tatami hush
      (ctx, m) => createWarmDrone(ctx, m, 156, 0.018, 0.015, 1.7),
      // Rain and wind softened by paper screens
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'lowpass', 520, 0.4, 0.022, { rate: 0.05, depth: 42, target: 'frequency' }),
      // Bamboo and timber creak at the edges
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'bandpass', 260, 0.9, 0.016, { rate: 0.035, depth: 28, target: 'frequency' }),
      // Delicate steam shimmer
      (ctx, m) =>
        createNoiseSource(ctx, m, 'blue', 'lowpass', 2200, 0.25, 0.004),
    ],
  },

  hearth: {
    layers: [
      // Room warmth sitting low in the wood and stone
      (ctx, m) =>
        createNoiseSource(ctx, m, 'brown', 'lowpass', 150, 0.22, 0.06, { rate: 0.03, depth: 20, target: 'frequency' }),
      // Ember bed and small shifting logs
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'bandpass', 780, 0.9, 0.028, { rate: 0.06, depth: 90, target: 'frequency' }),
      // Tiny high sparks and dry crackle
      (ctx, m) =>
        createNoiseSource(ctx, m, 'violet', 'bandpass', 2400, 2.1, 0.01, { rate: 0.1, depth: 180, target: 'frequency' }),
      // A slow warm body underneath the fire
      (ctx, m) => createWarmDrone(ctx, m, 92, 0.014, 0.018, 1.6),
    ],
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
    layers: [],
  },

  cathedral: {
    layers: [
      // Long stone volume in the nave
      (ctx, m) => createDronePair(ctx, m, 65, 65.18, 0.06, 0.016, 4.5),
      // Warm low resonance held in old walls and benches
      (ctx, m) => createWarmDrone(ctx, m, 98, 0.025, 0.02, 2.6),
      // Slow filtered air to imply height and distance
      (ctx, m) =>
        createNoiseSource(ctx, m, 'pink', 'bandpass', 420, 0.45, 0.024, { rate: 0.025, depth: 55, target: 'frequency' }),
      // Candle and dust shimmer in high space
      (ctx, m) =>
        createNoiseSource(ctx, m, 'blue', 'lowpass', 2400, 0.25, 0.006),
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
  destroyed?: boolean;
  pendingTimers?: number[];
}

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeRoom: ActiveRoom | null = null;
  private transitioningRoom: ActiveRoom | null = null;
  private transitionTimer: number | null = null;
  private isPlaying = false;
  private singleSoundTimers: number[] = [];
  private soundEffectBuffers = new Map<string, AudioBuffer>();
  private soundEffectPromises = new Map<string, Promise<AudioBuffer | null>>();

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

  public playUiSample(conf: SingleSoundConfig): void {
    void this.playTransientSample(conf);
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
    this.startAmbientSampleLayer(newRoom);

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
      config.volume * 0.4,
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
    if (!this.ctx) return;

    // Hard reset at the transition boundary so no old room layers or samples leak through.
    this.stopAll();
    this.playRoomAudio(config, singleConfigs);
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
    roomGain.gain.setValueAtTime(normalizeAmbientGain(startVol), this.ctx.currentTime);
    roomGain.connect(this.masterGain);

    const layers = profile.layers.map((layerFn) => layerFn(this.ctx!, roomGain));
    const room: ActiveRoom = { layers, gainNode: roomGain, config, destroyed: false, pendingTimers: [] };

    if (targetVol !== null && fadeSeconds > 0) {
      roomGain.gain.linearRampToValueAtTime(normalizeAmbientGain(targetVol), this.ctx.currentTime + fadeSeconds);
    }

    return room;
  }

  private startAmbientSampleLayer(room: ActiveRoom): void {
    if (!room.config.sampleLayer) return;
    void this.attachAmbientSampleLayer(room, room.config.sampleLayer);
  }

  private async attachAmbientSampleLayer(
    room: ActiveRoom,
    sample: NonNullable<AmbientAudioConfig['sampleLayer']>
  ): Promise<void> {
    if (!this.ctx || room.destroyed) return;

    if (window.location.protocol === 'file:') {
      this.attachAmbientMediaElementLayer(room, sample);
      return;
    }

    const buffer = await this.loadSoundEffectBuffer(sample.url);
    if (!buffer || !this.ctx || room.destroyed) return;

    const startDelay = sample.startDelay ?? 0;
    const startOffset = Math.max(0, sample.startOffset ?? 0);
    const fadeInSeconds = sample.fadeInSeconds ?? 4;
    const targetGain = Math.max(0.0001, sample.volume);
    const targetRoomGain = normalizeAmbientGain(room.config.volume * (sample.roomGainMultiplier ?? 1));
    const startSample = () => {
      if (!this.ctx || room.destroyed) return;

      const now = this.ctx.currentTime;
      const source = this.ctx.createBufferSource();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      source.buffer = buffer;
      source.loop = sample.loop ?? true;
      if (source.loop && startOffset > 0) {
        source.loopStart = Math.min(startOffset, Math.max(0, buffer.duration - 0.05));
      }

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(sample.lowpass ?? 600, now);
      filter.Q.setValueAtTime(0.3, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(targetGain, now + fadeInSeconds);

      if ((sample.roomGainMultiplier ?? 1) !== 1) {
        room.gainNode.gain.cancelScheduledValues(now);
        room.gainNode.gain.setValueAtTime(Math.max(room.gainNode.gain.value, 0.001), now);
        room.gainNode.gain.linearRampToValueAtTime(targetRoomGain, now + Math.min(1.2, fadeInSeconds));
      }

      source.connect(filter);
      filter.connect(gain);
      gain.connect(room.gainNode);
      source.start(now, Math.min(startOffset, Math.max(0, buffer.duration - 0.05)));

      room.layers.push({ source, nodes: [source, filter, gain], kind: 'ambient-sample' });
    };

    if (startDelay > 0) {
      const timerId = window.setTimeout(() => {
        room.pendingTimers = room.pendingTimers?.filter((id) => id !== timerId) ?? [];
        startSample();
      }, startDelay * 1000);
      room.pendingTimers?.push(timerId);
      return;
    }

    startSample();
  }

  private attachAmbientMediaElementLayer(
    room: ActiveRoom,
    sample: NonNullable<AmbientAudioConfig['sampleLayer']>
  ): void {
    if (!this.ctx || room.destroyed) return;

    const startDelay = sample.startDelay ?? 0;
    const startOffset = Math.max(0, sample.startOffset ?? 0);
    const fadeInSeconds = sample.fadeInSeconds ?? 4;
    const targetGain = Math.max(0.0001, sample.volume);
    const targetRoomGain = normalizeAmbientGain(room.config.volume * (sample.roomGainMultiplier ?? 1));

    const startSample = () => {
      if (!this.ctx || room.destroyed) return;

      const now = this.ctx.currentTime;
      const mediaElement = new Audio(sample.url);
      const source = this.ctx.createMediaElementSource(mediaElement);
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      mediaElement.preload = 'auto';
      mediaElement.loop = sample.loop ?? true;

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(sample.lowpass ?? 600, now);
      filter.Q.setValueAtTime(0.3, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(targetGain, now + fadeInSeconds);

      if ((sample.roomGainMultiplier ?? 1) !== 1) {
        room.gainNode.gain.cancelScheduledValues(now);
        room.gainNode.gain.setValueAtTime(Math.max(room.gainNode.gain.value, 0.001), now);
        room.gainNode.gain.linearRampToValueAtTime(targetRoomGain, now + Math.min(1.2, fadeInSeconds));
      }

      source.connect(filter);
      filter.connect(gain);
      gain.connect(room.gainNode);

      const playMedia = () => {
        if (room.destroyed) return;

        const playPromise = mediaElement.play();
        if (playPromise) {
          void playPromise.catch((error) => {
            console.warn('Fehler beim Abspielen des Ambient-Medienelements', error);
          });
        }
      };

      if (startOffset > 0) {
        const seekToOffset = () => {
          try {
            mediaElement.currentTime = Math.min(
              startOffset,
              Math.max(0, mediaElement.duration - 0.05)
            );
          } catch {
            /* currentTime may not be seekable yet */
          }
          playMedia();
        };

        if (mediaElement.readyState >= 1) {
          seekToOffset();
        } else {
          mediaElement.addEventListener('loadedmetadata', seekToOffset, { once: true });
        }
      } else {
        playMedia();
      }

      room.layers.push({
        source,
        nodes: [source, filter, gain],
        kind: 'ambient-sample',
        mediaElement
      });
    };

    if (startDelay > 0) {
      const timerId = window.setTimeout(() => {
        room.pendingTimers = room.pendingTimers?.filter((id) => id !== timerId) ?? [];
        startSample();
      }, startDelay * 1000);
      room.pendingTimers?.push(timerId);
      return;
    }

    startSample();
  }

  private stopLayer(layer: SoundLayer, when?: number): void {
    if (layer.mediaElement) {
      const stopMedia = () => {
        try {
          layer.mediaElement?.pause();
          if (layer.mediaElement) {
            layer.mediaElement.currentTime = 0;
          }
        } catch {
          /* already stopped */
        }
      };

      if (typeof when === 'number' && this.ctx) {
        const delayMs = Math.max(0, (when - this.ctx.currentTime) * 1000);
        window.setTimeout(stopMedia, delayMs);
      } else {
        stopMedia();
      }
      return;
    }

    try {
      (layer.source as AudioBufferSourceNode | OscillatorNode).stop(when);
    } catch {
      /* already stopped */
    }
  }

  private fadeOutAmbientSamples(room: ActiveRoom, duration = 0.8): void {
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    room.layers.forEach((layer) => {
      if (layer.kind !== 'ambient-sample') return;

      const gainNode = layer.nodes[layer.nodes.length - 1] as GainNode | undefined;
      if (gainNode?.gain) {
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(Math.max(gainNode.gain.value, 0.0001), now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      }

      this.stopLayer(layer, now + duration + 0.05);
    });
  }

  private fadeOutRoom(room: ActiveRoom, duration: number): void {
    if (!this.ctx) return;

    room.pendingTimers?.forEach((timerId) => clearTimeout(timerId));
    room.pendingTimers = [];

    this.fadeOutAmbientSamples(room, Math.min(1.2, duration * 0.2));
    const now = this.ctx.currentTime;
    room.gainNode.gain.cancelScheduledValues(now);
    room.gainNode.gain.setValueAtTime(
      Math.max(room.gainNode.gain.value, 0.0001),
      now
    );
    room.gainNode.gain.linearRampToValueAtTime(0, now + duration);
  }

  private destroyRoom(room: ActiveRoom): void {
    room.destroyed = true;
    room.pendingTimers?.forEach((timerId) => clearTimeout(timerId));
    room.pendingTimers = [];
    room.layers.forEach((layer) => {
      this.stopLayer(layer);
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

  // -- Single sounds (occasional sample-based accents) --

  private scheduleSingleSounds(configs: SingleSoundConfig[]): void {
    this.clearSingleSoundTimers();

    configs.forEach((conf) => {
      const scheduleNext = () => {
        if (!this.isPlaying) return;

        const delay =
          (Math.random() * (conf.intervalMax - conf.intervalMin) + conf.intervalMin) * 1000;
        const timerId = window.setTimeout(() => {
          this.playSingleSound(conf);
          scheduleNext();
        }, delay);
        this.singleSoundTimers.push(timerId);
      };

      const initialDelay = conf.startImmediately
        ? 80
        : (Math.random() * (conf.intervalMax - conf.intervalMin) + conf.intervalMin) * 1000;

      const initialTimerId = window.setTimeout(() => {
        this.playSingleSound(conf);
        scheduleNext();
      }, initialDelay);
      this.singleSoundTimers.push(initialTimerId);
    });
  }

  private playSingleSound(conf: SingleSoundConfig): void {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    void this.playConfiguredSample(conf);
  }

  private async playTransientSample(conf: SingleSoundConfig): Promise<void> {
    await this.init();

    if (!this.ctx || !this.masterGain) return;

    await this.playConfiguredSample(conf, false);
  }

  private clearSingleSoundTimers(): void {
    this.singleSoundTimers.forEach((t) => clearTimeout(t));
    this.singleSoundTimers = [];
  }

  private async loadSoundEffectBuffer(url: string): Promise<AudioBuffer | null> {
    if (!this.ctx) return null;

    const cached = this.soundEffectBuffers.get(url);
    if (cached) return cached;

    const existingPromise = this.soundEffectPromises.get(url);
    if (existingPromise) return existingPromise;

    const loadingPromise = fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Konnte Soundeffekt nicht laden: ${url}`);
        }
        const fileData = await response.arrayBuffer();
        return this.ctx!.decodeAudioData(fileData.slice(0));
      })
      .then((buffer) => {
        this.soundEffectBuffers.set(url, buffer);
        this.soundEffectPromises.delete(url);
        return buffer;
      })
      .catch((error) => {
        console.warn('Fehler beim Laden des Soundeffekts', error);
        this.soundEffectPromises.delete(url);
        return null;
      });

    this.soundEffectPromises.set(url, loadingPromise);
    return loadingPromise;
  }

  private async playConfiguredSample(conf: SingleSoundConfig, requireActivePlayback = true): Promise<void> {
    if (!this.ctx || !this.masterGain) return;
    if (requireActivePlayback && !this.isPlaying) return;

    const { sample } = conf;
    const buffer = await this.loadSoundEffectBuffer(sample.url);
    if (!buffer || !this.ctx || !this.masterGain) return;
    if (requireActivePlayback && !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    const playbackRateMin = sample.playbackRateMin ?? 0.985;
    const playbackRateMax = sample.playbackRateMax ?? 1.015;
    const startOffset = Math.min(sample.startOffset ?? 0, Math.max(0, buffer.duration - 0.12));
    const maxDuration = Math.max(0.12, buffer.duration - startOffset);
    const clipDuration = Math.min(sample.clipDuration ?? maxDuration, maxDuration);

    source.buffer = buffer;
    source.playbackRate.setValueAtTime(
      playbackRateMin + Math.random() * Math.max(0.0001, playbackRateMax - playbackRateMin),
      now
    );

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(sample.lowpass ?? 3200, now);
    filter.Q.setValueAtTime(0.25, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(sample.volume, now + 0.08);
    gain.gain.setValueAtTime(sample.volume, now + Math.max(0.2, clipDuration - 0.35));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + clipDuration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start(now, startOffset, clipDuration);
    source.stop(now + clipDuration + 0.08);
    source.onended = () => {
      try {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch {
        /* already disconnected */
      }
    };
  }

}
export const audioService = new AudioService();
