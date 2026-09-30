// Web Audio API Spatial Sound Effect Engine for Battle Royale
// Provides 2D localized spatial audio (stereo panning, distance attenuation, and frequency absorption)

export type WeaponSoundType = 'ak47' | 'mp40' | 'awm' | 'shotgun';
export type SurfaceType = 'grass' | 'gravel' | 'metal';
export type ImpactType = 'flesh' | 'shield' | 'ground' | 'headshot';

class BattleAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  public isMuted: boolean = false;

  // Footstep timing tracking
  private lastPlayerStepTime = 0;
  private footstepToggle = false;
  private lastEnemyStepTimes = new Map<string, number>();

  // Continuous sound nodes
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private zoneOsc: OscillatorNode | null = null;
  private zoneGain: GainNode | null = null;

  constructor() {
    // Respect initial mute state from localStorage
    if (typeof window !== 'undefined') {
      this.isMuted = localStorage.getItem('ff_muted') === 'true';
    }
  }

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.generateNoiseBuffer();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Pre-generate 1 second of white/pink noise for realistic gunshot cracks & footsteps
  private generateNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 1.0;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pinkish noise filter
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    this.noiseBuffer = buffer;
  }

  /**
   * Helper to build a localized spatial audio routing chain:
   * Source Node -> Distance Lowpass Filter -> Volume Gain (with distance falloff) -> Stereo Panner -> Destination
   */
  private createSpatialChain(
    sourceX: number,
    sourceY: number,
    listenerX: number,
    listenerY: number,
    maxDistance = 750,
    baseGain = 0.5
  ): { panner: StereoPannerNode | null; gain: GainNode; filter: BiquadFilterNode; volume: number } | null {
    if (this.isMuted) return null;
    this.init();
    if (!this.ctx) return null;

    const dx = sourceX - listenerX;
    const dy = sourceY - listenerY;
    const distance = Math.hypot(dx, dy);

    // Cull sounds out of range
    if (distance > maxDistance) return null;

    // Distance attenuation with non-linear falloff
    const distanceRatio = Math.min(1, distance / maxDistance);
    const volume = Math.max(0, (1 - distanceRatio ** 1.25) * baseGain);

    if (volume <= 0.001) return null;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

    // Distance air absorption (distant sounds lose high frequencies)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoffFreq = Math.max(1400, 14000 - distanceRatio * 11500);
    filter.frequency.setValueAtTime(cutoffFreq, this.ctx.currentTime);

    // Stereo panning based on relative horizontal angle & distance
    let panner: StereoPannerNode | null = null;
    if (typeof this.ctx.createStereoPanner === 'function') {
      panner = this.ctx.createStereoPanner();
      // Clamp pan between -1.0 (full left) and 1.0 (full right)
      const panValue = Math.max(-1, Math.min(1, dx / 280));
      panner.pan.setValueAtTime(panValue, this.ctx.currentTime);
      filter.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(this.ctx.destination);
    } else {
      filter.connect(gainNode);
      gainNode.connect(this.ctx.destination);
    }

    return { panner, gain: gainNode, filter, volume };
  }

  // -------------------------------------------------------------
  // 1. LOCALIZED GUNFIRE (AK47, MP40, AWM, Shotgun)
  // -------------------------------------------------------------
  public playLocalizedGunfire(
    sourceX: number,
    sourceY: number,
    listenerX: number,
    listenerY: number,
    weapon: WeaponSoundType = 'ak47',
    isPlayer = false
  ) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const spatial = isPlayer
      ? null
      : this.createSpatialChain(sourceX, sourceY, listenerX, listenerY, 850, 0.45);

    // If out of earshot for bot gunfire, do nothing
    if (!isPlayer && !spatial) return;

    const t = this.ctx.currentTime;
    const dest = isPlayer ? this.ctx.destination : spatial!.filter;
    const masterVol = isPlayer ? 0.4 : spatial!.volume;

    // Body Oscillator (Tonal boom)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    // Noise Node (Gunpowder crack & transient punch)
    let noiseSource: AudioBufferSourceNode | null = null;
    let noiseFilter: BiquadFilterNode | null = null;
    let noiseGain: GainNode | null = null;

    if (this.noiseBuffer) {
      noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;
      noiseFilter = this.ctx.createBiquadFilter();
      noiseGain = this.ctx.createGain();
    }

    if (weapon === 'awm') {
      // Sniper: Heavy blast, supersonic crack & deep sub rumble
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.45);

      oscGain.gain.setValueAtTime(masterVol * 1.2, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

      if (noiseSource && noiseFilter && noiseGain) {
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(2200, t);
        noiseFilter.Q.setValueAtTime(1.8, t);
        noiseGain.gain.setValueAtTime(masterVol * 0.9, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      }
    } else if (weapon === 'shotgun') {
      // Shotgun: Wide explosive burst & heavy low punch
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(25, t + 0.3);

      oscGain.gain.setValueAtTime(masterVol * 1.1, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

      if (noiseSource && noiseFilter && noiseGain) {
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(3500, t);
        noiseGain.gain.setValueAtTime(masterVol * 1.2, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      }
    } else if (weapon === 'mp40') {
      // SMG: Rapid, sharp, high-frequency snap
      osc.type = 'square';
      osc.frequency.setValueAtTime(360, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);

      oscGain.gain.setValueAtTime(masterVol * 0.75, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      if (noiseSource && noiseFilter && noiseGain) {
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(4200, t);
        noiseGain.gain.setValueAtTime(masterVol * 0.65, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      }
    } else {
      // AK47: Metallic snap, aggressive midrange punch
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(290, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.22);

      oscGain.gain.setValueAtTime(masterVol * 0.85, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

      if (noiseSource && noiseFilter && noiseGain) {
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(2800, t);
        noiseGain.gain.setValueAtTime(masterVol * 0.8, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      }
    }

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.5);

    if (noiseSource && noiseFilter && noiseGain) {
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(dest);
      noiseSource.start(t);
      noiseSource.stop(t + 0.4);
    }
  }

  // -------------------------------------------------------------
  // 2. LOCALIZED FOOTSTEPS (Player & Approaching Enemies)
  // -------------------------------------------------------------
  public updatePlayerFootsteps(
    isMoving: boolean,
    isRunning: boolean,
    x: number,
    y: number
  ) {
    if (!isMoving || this.isMuted) return;
    const now = Date.now();
    const interval = isRunning ? 280 : 380; // running = faster cadence

    if (now - this.lastPlayerStepTime > interval) {
      this.lastPlayerStepTime = now;
      this.footstepToggle = !this.footstepToggle;
      this.playSingleFootstep(x, y, x, y, this.footstepToggle, isRunning, true);
    }
  }

  public updateEnemyFootstep(
    enemyId: string,
    enemyX: number,
    enemyY: number,
    playerX: number,
    playerY: number,
    isMoving: boolean
  ) {
    if (!isMoving || this.isMuted) return;
    const dist = Math.hypot(enemyX - playerX, enemyY - playerY);
    // Only play enemy footsteps if close enough (tactical radar listening)
    if (dist > 250) return;

    const now = Date.now();
    const lastTime = this.lastEnemyStepTimes.get(enemyId) || 0;
    if (now - lastTime > 400) {
      this.lastEnemyStepTimes.set(enemyId, now);
      this.playSingleFootstep(enemyX, enemyY, playerX, playerY, false, false, false);
    }
  }

  private playSingleFootstep(
    sourceX: number,
    sourceY: number,
    listenerX: number,
    listenerY: number,
    isLeftFoot: boolean,
    isRunning: boolean,
    isPlayer: boolean
  ) {
    this.init();
    if (!this.ctx) return;

    const baseVol = isPlayer ? (isRunning ? 0.16 : 0.12) : 0.22;
    const spatial = isPlayer
      ? null
      : this.createSpatialChain(sourceX, sourceY, listenerX, listenerY, 260, baseVol);

    if (!isPlayer && !spatial) return;

    const t = this.ctx.currentTime;
    const dest = isPlayer ? this.ctx.destination : spatial!.filter;
    const vol = isPlayer ? baseVol : spatial!.volume;

    // Pitch variation between left and right foot
    const stepPitch = isLeftFoot ? 75 : 85;

    // Low thump (sole impact)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(stepPitch, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.08);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.1);

    // Subtle gravel scuff using noise
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(isLeftFoot ? 1200 : 1400, t);
      noiseFilter.Q.setValueAtTime(2.0, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(vol * 0.45, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(dest);

      noise.start(t);
      noise.stop(t + 0.07);
    }
  }

  // -------------------------------------------------------------
  // 3. BULLET IMPACTS & HIT MARKERS
  // -------------------------------------------------------------
  public playLocalizedImpact(
    impactX: number,
    impactY: number,
    listenerX: number,
    listenerY: number,
    type: ImpactType = 'flesh'
  ) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const spatial = this.createSpatialChain(impactX, impactY, listenerX, listenerY, 650, 0.4);
    if (!spatial) return;

    const t = this.ctx.currentTime;
    const dest = spatial.filter;
    const vol = spatial.volume;

    if (type === 'headshot') {
      // Signature Free Fire Headshot Ding! High crisp metallic chime
      const chime1 = this.ctx.createOscillator();
      const chime2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      chime1.type = 'sine';
      chime2.type = 'triangle';
      chime1.frequency.setValueAtTime(1760, t); // A6
      chime2.frequency.setValueAtTime(3520, t); // A7

      gain.gain.setValueAtTime(vol * 1.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

      chime1.connect(gain);
      chime2.connect(gain);
      gain.connect(dest);

      chime1.start(t);
      chime2.start(t);
      chime1.stop(t + 0.35);
      chime2.stop(t + 0.35);
    } else if (type === 'shield') {
      // Gloo Wall Shield block: crystalline ice crunch
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.12);

      gain.gain.setValueAtTime(vol * 0.8, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.16);
    } else {
      // Flesh body impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.1);

      gain.gain.setValueAtTime(vol * 0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.14);
    }
  }

  // -------------------------------------------------------------
  // 4. PLAYER DAMAGE & SHIELD WARNING
  // -------------------------------------------------------------
  public playPlayerDamage() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // -------------------------------------------------------------
  // 5. SAFE ZONE SIZZLE & ELECTRIC SHOCK
  // -------------------------------------------------------------
  public playStormShock() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.linearRampToValueAtTime(180, t + 0.08);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  // -------------------------------------------------------------
  // 6. ZONE SHRINK WARNING SIREN
  // -------------------------------------------------------------
  public playSafeZoneWarning() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.linearRampToValueAtTime(320, t + 0.35);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.42);
  }

  // -------------------------------------------------------------
  // 7. KILL NOTIFICATION FANFARE STINGER
  // -------------------------------------------------------------
  public playEliminationStinger(isHeadshot = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = isHeadshot ? [523.25, 783.99, 1046.5] : [440, 659.25];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.07);

      gain.gain.setValueAtTime(0.25, t + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.07);
      osc.stop(t + idx * 0.07 + 0.25);
    });
  }

  // Mute toggle synchronization
  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ctx && this.ctx.state === 'running') {
      // Stop continuous oscillators if any
      if (this.engineGain) this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
      if (this.zoneGain) this.zoneGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }
}

export const battleAudioEngine = new BattleAudioEngine();
