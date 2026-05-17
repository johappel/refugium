import React, { useEffect, useRef } from 'react';

type EffectType =
  | 'rain'
  | 'dust'
  | 'stars'
  | 'fog'
  | 'leaves'
  | 'water'
  | 'fire'
  | 'train-lights'
  | 'rays'
  | 'waves'
  | 'underwater';

interface CanvasOverlayProps {
  effect: EffectType;
  intensity?: number;
  className?: string;
}

interface Particle {
  kind: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  phase: number;
  speed: number;
  rotation?: number;
  rotationSpeed?: number;
  index?: number;
  baseY?: number;
  amplitude?: number;
  hue?: number;
  wobbleFreq?: number;
  wobbleAmp?: number;
  glowIntensity?: number;
}

interface RayColumn {
  x: number;
  width: number;
  angle: number;
  phase: number;
  speed: number;
  intensity: number;
}

export const CanvasOverlay: React.FC<CanvasOverlayProps> = ({
  effect,
  intensity = 1,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rayColumnsRef = useRef<RayColumn[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const initParticles = () => {
      const particles: Particle[] = [];

      if (effect === 'rain') {
        for (let i = 0; i < 180 * intensity; i++) {
          particles.push({
            kind: 'raindrop',
            x: Math.random() * (width + 160) - 80,
            y: Math.random() * (height + 220) - 220,
            vx: -1.2 - Math.random() * 1.6,
            vy: 12 + Math.random() * 10,
            size: 8 + Math.random() * 16,
            opacity: 0.1 + Math.random() * 0.22,
            life: 0,
            maxLife: 1,
            phase: Math.random() * Math.PI * 2,
            speed: 0.8 + Math.random() * 0.6
          });
        }
      } else if (effect === 'dust') {
        for (let i = 0; i < 95 * intensity; i++) {
          particles.push({
            kind: 'dust-mote',
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0.06 + Math.random() * 0.12,
            vy: -0.015 - Math.random() * 0.04,
            size: 0.8 + Math.random() * 2.2,
            opacity: 0.08 + Math.random() * 0.2,
            life: Math.random() * 360,
            maxLife: 360 + Math.random() * 260,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.8
          });
        }
      } else if (effect === 'stars') {
        for (let i = 0; i < 42 * intensity; i++) {
          particles.push({
            kind: 'star',
            x: Math.random() * width,
            y: Math.random() * height * 0.62,
            vx: 0,
            vy: 0,
            size: 0.9 + Math.random() * 2.2,
            opacity: 0.16 + Math.random() * 0.34,
            life: Math.random() * 800,
            maxLife: 600 + Math.random() * 1400,
            phase: Math.random() * Math.PI * 2,
            speed: 0.35 + Math.random() * 0.35
          });
        }
      } else if (effect === 'fog') {
        for (let i = 0; i < 5; i++) {
          particles.push({
            kind: 'fog-band',
            x: (i / 5) * width - 220,
            y: height * (0.24 + Math.random() * 0.48),
            vx: 0.08 + Math.random() * 0.12,
            vy: 0,
            size: 280 + Math.random() * 380,
            opacity: 0.035 + Math.random() * 0.05,
            life: 0,
            maxLife: 1,
            phase: Math.random() * Math.PI * 2,
            speed: 0.22 + Math.random() * 0.22
          });
        }
      } else if (effect === 'leaves') {
        for (let i = 0; i < 30 * intensity; i++) {
          particles.push({
            kind: 'leaf',
            x: Math.random() * width,
            y: -Math.random() * height,
            vx: -0.55 + Math.random() * 1.1,
            vy: 0.55 + Math.random() * 1.2,
            size: 4 + Math.random() * 10,
            opacity: 0.2 + Math.random() * 0.5,
            life: Math.random() * 400,
            maxLife: 1,
            phase: Math.random() * Math.PI * 2,
            speed: 0.6 + Math.random() * 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: -0.03 + Math.random() * 0.06
          });
        }
      } else if (effect === 'water') {
        for (let i = 0; i < 12 * intensity; i++) {
          particles.push({
            kind: 'ripple',
            x: Math.random() * width,
            y: height * (0.58 + Math.random() * 0.37),
            vx: 0,
            vy: 0,
            size: 10 + Math.random() * 24,
            opacity: 0.12 + Math.random() * 0.18,
            life: Math.random() * 180,
            maxLife: 180 + Math.random() * 120,
            phase: Math.random() * Math.PI * 2,
            speed: 0.8 + Math.random() * 0.6
          });
        }
      } else if (effect === 'fire') {
        for (let i = 0; i < 45 * intensity; i++) {
          particles.push({
            kind: 'ember',
            x: width * (0.35 + Math.random() * 0.3),
            y: height * (0.72 + Math.random() * 0.2),
            vx: -0.3 + Math.random() * 0.6,
            vy: -0.7 - Math.random() * 1.2,
            size: 1.4 + Math.random() * 3.8,
            opacity: 0.35 + Math.random() * 0.45,
            life: 0,
            maxLife: 140 + Math.random() * 120,
            phase: Math.random() * Math.PI * 2,
            speed: 0.7 + Math.random() * 0.8
          });
        }
      } else if (effect === 'train-lights') {
        for (let i = 0; i < 15 * intensity; i++) {
          particles.push({
            kind: 'train-light',
            x: -Math.random() * width,
            y: height * (0.2 + Math.random() * 0.55),
            vx: 2 + Math.random() * 4,
            vy: 0,
            size: 14 + Math.random() * 42,
            opacity: 0.08 + Math.random() * 0.24,
            life: 0,
            maxLife: 1,
            phase: Math.random() * Math.PI * 2,
            speed: 0.9 + Math.random() * 0.6
          });
        }
      } else if (effect === 'rays') {
        // Definierte, stabile Lichtsäulen für volumetrisches Atmen
        const columnCount = 6;
        rayColumnsRef.current = Array.from({ length: columnCount }).map((_, i) => ({
          x: (i + 0.5) * (width / columnCount) + (Math.random() - 0.5) * 80,
          width: 80 + Math.random() * 100,
          angle: -16 + Math.random() * 8,
          phase: i * 0.7 + Math.random() * 0.6,
          speed: 0.0004 + Math.random() * 0.0004,
          intensity: 0.10 + Math.random() * 0.06
        }));

        // Boden-Caustics: 8 schillernde Lichtbrechungs-Kreise
        for (let i = 0; i < 8; i++) {
          particles.push({
            kind: 'caustic',
            x: (i + 0.5) * (width / 8) + (Math.random() - 0.5) * 60,
            y: height * (0.82 + Math.random() * 0.12),
            vx: 0,
            vy: 0,
            size: 80 + Math.random() * 100,
            opacity: 0.08 + Math.random() * 0.06,
            life: 0,
            maxLife: 1,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.5
          });
        }

        // Tanzende Waldpollen: 35 goldene Pollen
        for (let i = 0; i < 35 * intensity; i++) {
          particles.push({
            kind: 'pollen',
            x: Math.random() * width,
            y: height + Math.random() * height * 0.3,
            vx: (Math.random() - 0.5) * 0.25,
            vy: -0.12 - Math.random() * 0.22,
            size: 1.4 + Math.random() * 2.2,
            opacity: 0.35 + Math.random() * 0.35,
            life: 0,
            maxLife: 1,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.6,
            glowIntensity: 0
          });
        }
      } else if (effect === 'waves') {
        // Mehrschichtige Wellen
        const waveCount = 6;
        for (let i = 0; i < waveCount; i++) {
          particles.push({
            kind: 'wave',
            x: width * 0.5,
            y: height * 0.78 + i * 14,
            vx: 0,
            vy: 0,
            size: width * (1.1 + i * 0.08),
            opacity: 0.05 + Math.random() * 0.05,
            life: Math.random() * 400,
            maxLife: 400,
            phase: i * (Math.PI / 1.8),
            speed: 0.35 + Math.random() * 0.15,
            index: i
          });
        }

        // Markanter weißer Gischt-Spülsaum
        particles.push({
          kind: 'foamcrest',
          x: width * 0.5,
          y: height * 0.84,
          vx: 0,
          vy: 0,
          size: width,
          opacity: 0.7,
          life: 0,
          maxLife: 1,
          phase: 0,
          speed: 0.35
        });

        // 12 horizontal fließende Schaumlinien
        for (let i = 0; i < 12; i++) {
          particles.push({
            kind: 'foamline',
            x: Math.random() * width,
            y: height * (0.84 + Math.random() * 0.13),
            vx: -0.4 - Math.random() * 0.6,
            vy: 0,
            size: 60 + Math.random() * 200,
            opacity: 0.25 + Math.random() * 0.35,
            life: Math.random() * 200,
            maxLife: 220,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5
          });
        }

        // Sandglitzer: 35 kreuzförmige Funkel-Sterne im feuchten Sand
        for (let i = 0; i < 35; i++) {
          particles.push({
            kind: 'sandsparkle',
            x: Math.random() * width,
            y: height * (0.86 + Math.random() * 0.13),
            vx: 0,
            vy: 0,
            size: 0.8 + Math.random() * 1.6,
            opacity: 0,
            life: Math.random() * 200,
            maxLife: 200 + Math.random() * 200,
            phase: Math.random() * Math.PI * 2,
            speed: 0.7 + Math.random() * 0.9
          });
        }
      } else if (effect === 'underwater') {
        const minDim = Math.min(width, height);
        const portholeRadius = (minDim * 0.86) / 2 - 32;

        // Physikalisch wabbelnde Blasen: 35 mit eigener Wobble-Physik
        for (let i = 0; i < 35; i++) {
          const randomAngle = Math.random() * Math.PI;
          const dist = Math.random() * portholeRadius * 0.85;
          const x = width * 0.5 + Math.cos(randomAngle + Math.PI * 0.5) * dist;
          const y = height * 0.5 + portholeRadius * 0.85 + Math.random() * 80;

          particles.push({
            kind: 'bubble',
            x,
            y,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -0.4 - Math.random() * 1.1,
            size: 2.5 + Math.random() * 7,
            opacity: 0.35 + Math.random() * 0.35,
            life: 0,
            maxLife: 1,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.4,
            wobbleFreq: 0.003 + Math.random() * 0.005,
            wobbleAmp: 0.15 + Math.random() * 0.25
          });
        }

        // Schwebende Plankton-Partikel
        for (let i = 0; i < 60; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * portholeRadius * 0.92;
          const x = width * 0.5 + Math.cos(angle) * dist;
          const y = height * 0.5 + Math.sin(angle) * dist;

          particles.push({
            kind: 'plankton',
            x,
            y,
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1 - 0.04,
            size: 0.4 + Math.random() * 1.4,
            opacity: 0.06 + Math.random() * 0.14,
            life: Math.random() * 500,
            maxLife: 500,
            phase: Math.random() * Math.PI * 2,
            speed: 0.15 + Math.random() * 0.25
          });
        }

        // 5 biolumineszente Tiefseefische
        for (let i = 0; i < 5; i++) {
          const fromLeft = Math.random() < 0.5;
          const startX = fromLeft ? -150 : width + 150;
          const dirX = fromLeft ? 1 : -1;
          const baseY = height * (0.3 + Math.random() * 0.45);

          particles.push({
            kind: 'fish',
            x: startX,
            y: baseY,
            vx: dirX * (0.35 + Math.random() * 0.35),
            vy: 0,
            size: 26 + Math.random() * 24,
            opacity: 0.85,
            life: 0,
            maxLife: 1,
            phase: Math.random() * Math.PI * 2,
            speed: 0.003 + Math.random() * 0.002,
            index: i,
            baseY,
            amplitude: 16 + Math.random() * 22,
            hue: 165 + Math.random() * 40
          });
        }

        // Lukenglas-Caustics
        for (let i = 0; i < 6; i++) {
          particles.push({
            kind: 'porthole-caustic',
            x: width * 0.5 + (Math.random() - 0.5) * portholeRadius,
            y: height * 0.5 + (Math.random() - 0.5) * portholeRadius * 0.6,
            vx: 0,
            vy: 0,
            size: 50 + Math.random() * 90,
            opacity: 0.08 + Math.random() * 0.06,
            life: 0,
            maxLife: 1,
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.4
          });
        }
      }

      particlesRef.current = particles;
    };

    initParticles();

    // ============================================================
    //  REGEN
    // ============================================================
    const drawRaindrop = (p: Particle, time: number) => {
      const shimmer = 0.7 + Math.sin(time * 0.01 * p.speed + p.phase) * 0.3;
      const tailLength = p.size * (0.85 + shimmer * 0.45);
      const endX = p.x + p.vx * tailLength * 0.14;
      const endY = p.y + tailLength;

      ctx.strokeStyle = `rgba(210, 230, 255, ${p.opacity * shimmer})`;
      ctx.lineWidth = Math.max(0.6, p.size * 0.045);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      if (p.opacity > 0.22) {
        ctx.fillStyle = `rgba(235, 245, 255, ${p.opacity * 0.35})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawDustMote = (p: Particle, time: number) => {
      const drift = Math.sin(time * 0.0012 * p.speed + p.phase) * 0.25;
      const pulse = 0.65 + Math.sin(time * 0.001 * p.speed + p.phase) * 0.35;
      const r = p.size * (0.8 + pulse * 0.4);
      ctx.beginPath();
      ctx.arc(p.x + drift, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 205, 170, ${p.opacity * pulse})`;
      ctx.fill();
    };

    const drawStar = (p: Particle, time: number) => {
      const cycle = p.life / p.maxLife;
      const pulseWindow = cycle < 0.12 ? Math.sin((cycle / 0.12) * Math.PI) : 0;
      const breathingBase = 0.65 + Math.sin(time * 0.00045 + p.phase) * 0.08;
      const op = p.opacity * (breathingBase + pulseWindow * 1.15);
      const r = p.size;

      ctx.fillStyle = pulseWindow > 0.01
        ? `rgba(245, 248, 255, ${op})`
        : `rgba(214, 226, 238, ${op})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();

      if (r > 1.6 && pulseWindow > 0.45) {
        const arm = r * (3.2 + pulseWindow * 1.8);
        ctx.strokeStyle = `rgba(225, 236, 255, ${op * 0.45})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(p.x - arm, p.y);
        ctx.lineTo(p.x + arm, p.y);
        ctx.moveTo(p.x, p.y - arm);
        ctx.lineTo(p.x, p.y + arm);
        ctx.stroke();
      }
    };

    const drawFogBand = (p: Particle, time: number) => {
      const breath = 0.6 + Math.sin(time * 0.0008 * p.speed + p.phase) * 0.4;
      const dy = Math.sin(time * 0.00035 + p.phase) * 10;
      const w = p.size * (0.88 + breath * 0.22);
      const h = p.size * (0.15 + breath * 0.07);
      ctx.save();
      ctx.filter = 'blur(22px)';
      const grad = ctx.createRadialGradient(p.x, p.y + dy, 0, p.x, p.y + dy, w * 0.62);
      grad.addColorStop(0, `rgba(228, 236, 241, ${p.opacity * breath})`);
      grad.addColorStop(0.55, `rgba(208, 220, 228, ${p.opacity * breath * 0.45})`);
      grad.addColorStop(1, 'rgba(200, 215, 230, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + dy, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawLeaf = (p: Particle, time: number) => {
      const sway = Math.sin(time * 0.003 * p.speed + p.phase) * 0.8;
      const px = p.x + sway * 2;
      const py = p.y;
      const rot = (p.rotation ?? 0) + Math.sin(time * 0.002 + p.phase) * 0.35;
      const leafW = p.size;
      const leafH = p.size * 0.45;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      ctx.fillStyle = `rgba(120, 165, 105, ${p.opacity})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, leafW, leafH, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(90, 125, 80, ${p.opacity * 0.7})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(-leafW * 0.75, 0);
      ctx.lineTo(leafW * 0.75, 0);
      ctx.stroke();
      ctx.restore();
    };

    const drawRipple = (p: Particle) => {
      const t = p.life / p.maxLife;
      const r = p.size + t * 28;
      const op = p.opacity * (1 - t);
      if (op <= 0.01) return;

      ctx.strokeStyle = `rgba(185, 220, 245, ${op})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, r * 1.5, r * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawEmber = (p: Particle, time: number) => {
      const flutter = Math.sin(time * 0.006 * p.speed + p.phase) * 0.8;
      const x = p.x + flutter;
      const y = p.y;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
      glow.addColorStop(0, `rgba(255, 210, 120, ${p.opacity})`);
      glow.addColorStop(0.45, `rgba(255, 140, 60, ${p.opacity * 0.55})`);
      glow.addColorStop(1, 'rgba(255, 90, 40, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, p.size * 2.8, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawTrainLight = (p: Particle, time: number) => {
      const swayY = Math.sin(time * 0.002 * p.speed + p.phase) * 5;
      const length = p.size * (0.9 + Math.sin(time * 0.001 + p.phase) * 0.2);
      ctx.save();
      ctx.filter = 'blur(1.5px)';
      const grad = ctx.createLinearGradient(p.x - length, p.y + swayY, p.x + length, p.y + swayY);
      grad.addColorStop(0, 'rgba(180, 210, 255, 0)');
      grad.addColorStop(0.5, `rgba(220, 235, 255, ${p.opacity})`);
      grad.addColorStop(1, 'rgba(180, 210, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x - length, p.y + swayY - 1.1, length * 2, 2.2);
      ctx.restore();
    };

    // ============================================================
    //  HAIN
    // ============================================================
    const drawRayColumns = (time: number) => {
      rayColumnsRef.current.forEach((col) => {
        const breath = 0.6 + Math.sin(time * col.speed * 2 * Math.PI + col.phase) * 0.4;
        const sway = Math.sin(time * 0.0004 + col.phase) * 14;

        ctx.save();
        ctx.translate(col.x + sway, 0);
        ctx.rotate((col.angle * Math.PI) / 180);

        const grad = ctx.createLinearGradient(0, 0, 0, height * 1.05);
        grad.addColorStop(0, `rgba(255, 240, 180, ${col.intensity * breath * 0.95})`);
        grad.addColorStop(0.25, `rgba(255, 230, 150, ${col.intensity * breath * 0.7})`);
        grad.addColorStop(0.6, `rgba(255, 220, 120, ${col.intensity * breath * 0.32})`);
        grad.addColorStop(1, 'rgba(255, 210, 100, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-col.width * 0.5, 0);
        ctx.lineTo(col.width * 0.5, 0);
        ctx.lineTo(col.width * 1.15, height * 1.1);
        ctx.lineTo(-col.width * 1.15, height * 1.1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    };

    const drawFloorCaustic = (p: Particle, time: number) => {
      const pulse = 0.6 + Math.sin(time * 0.001 * p.speed + p.phase) * 0.4;
      const drift = Math.sin(time * 0.0006 + p.phase) * 50;
      const cx = p.x + drift;
      const cy = p.y + Math.cos(time * 0.0008 + p.phase) * 10;
      const r = p.size * (0.85 + pulse * 0.3);
      const op = p.opacity * (0.5 + pulse * 0.5);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `rgba(255, 235, 170, ${op * 0.95})`);
      grad.addColorStop(0.4, `rgba(220, 200, 130, ${op * 0.4})`);
      grad.addColorStop(1, 'rgba(200, 180, 100, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const rayIntensityAt = (px: number, py: number, time: number): number => {
      let maxI = 0;
      for (const col of rayColumnsRef.current) {
        const sway = Math.sin(time * 0.0004 + col.phase) * 14;
        const cx = col.x + sway;
        const angleRad = (col.angle * Math.PI) / 180;
        // Inverse Rotation
        const dx = px - cx;
        const dy = py;
        const localX = dx * Math.cos(-angleRad) - dy * Math.sin(-angleRad);
        const halfWidth = col.width * (1 + (py / height) * 0.4);
        const dist = Math.abs(localX);
        if (dist < halfWidth) {
          const breath = 0.6 + Math.sin(time * col.speed * 2 * Math.PI + col.phase) * 0.4;
          const t = 1 - dist / halfWidth;
          const I = t * breath;
          if (I > maxI) maxI = I;
        }
      }
      return maxI;
    };

    const drawPollen = (p: Particle, time: number) => {
      // Sanftes seitliches Schweben
      const sway = Math.sin(time * 0.001 * p.speed + p.phase) * 0.3;
      p.x += sway * 0.4;

      // Glow-Intensität abhängig von Lichtsäulen-Nähe
      const inRay = rayIntensityAt(p.x, p.y, time);
      const current = p.glowIntensity ?? 0;
      p.glowIntensity = current + (inRay - current) * 0.08;
      const glow = p.glowIntensity;

      const baseOp = p.opacity * (0.35 + glow * 0.65);
      const r = p.size * (1 + glow * 0.6);

      // Warmer Glow-Halo
      if (glow > 0.05) {
        const haloGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6);
        haloGrad.addColorStop(0, `rgba(255, 230, 150, ${baseOp * 0.5})`);
        haloGrad.addColorStop(0.4, `rgba(255, 210, 120, ${baseOp * 0.18})`);
        haloGrad.addColorStop(1, 'rgba(255, 200, 100, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pollen-Kern
      const coreGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      const coreCol = glow > 0.1
        ? `rgba(255, 240, 180, ${baseOp})`
        : `rgba(220, 200, 150, ${baseOp * 0.6})`;
      coreGrad.addColorStop(0, coreCol);
      coreGrad.addColorStop(1, 'rgba(200, 180, 130, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    // ============================================================
    //  SANDSTRAND
    // ============================================================
    const drawWave = (p: Particle, time: number) => {
      const wave = Math.sin(time * 0.001 * p.speed + p.phase);
      const op = p.opacity * (0.5 + wave * 0.5);
      const cy = p.y + wave * 16;

      // Hintere dunkel-blaue Schicht
      const back = ctx.createLinearGradient(0, cy - 30, 0, cy + 50);
      back.addColorStop(0, 'rgba(20, 50, 65, 0)');
      back.addColorStop(0.4, `rgba(35, 75, 95, ${op * 0.6})`);
      back.addColorStop(1, 'rgba(25, 55, 70, 0)');
      ctx.fillStyle = back;
      ctx.beginPath();
      ctx.ellipse(p.x, cy + 6, p.size * 0.5, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      // Helle transparent-blaue Wasserfront
      const front = ctx.createLinearGradient(0, cy - 18, 0, cy + 28);
      front.addColorStop(0, 'rgba(220, 240, 250, 0)');
      front.addColorStop(0.3, `rgba(220, 240, 250, ${op * 0.85})`);
      front.addColorStop(0.7, `rgba(180, 220, 240, ${op * 0.45})`);
      front.addColorStop(1, 'rgba(160, 200, 230, 0)');
      ctx.fillStyle = front;
      ctx.beginPath();
      ctx.ellipse(p.x, cy, p.size * 0.48, 30 + wave * 7, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawFoamCrest = (p: Particle, time: number) => {
      // Markanter weißer Gischt-Spülsaum, sanft auf-/abwogend
      const wave = Math.sin(time * 0.0009 + p.phase);
      const cy = p.y + wave * 6;
      const op = p.opacity * (0.6 + wave * 0.4);

      // Hauptgischt-Band
      const grad = ctx.createLinearGradient(0, cy - 6, 0, cy + 12);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, `rgba(255,255,255,${op * 0.55})`);
      grad.addColorStop(1, 'rgba(245,250,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, cy - 6, width, 14);

      // Wellige obere Linie aus mehreren kleinen Bögen
      ctx.beginPath();
      const step = 18;
      const points: Array<[number, number]> = [];
      for (let x = -20; x <= width + 20; x += step) {
        const off = Math.sin(x * 0.025 + time * 0.0015) * 4 + Math.sin(x * 0.06 + time * 0.0025) * 2.5;
        points.push([x, cy - 4 + off]);
      }
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.strokeStyle = `rgba(255,255,255,${op * 0.85})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    };

    const drawFoamLine = (p: Particle, time: number) => {
      const lifeRatio = p.life / p.maxLife;
      const fadeIn = Math.min(1, p.life / 30);
      const fadeOut = 1 - lifeRatio;
      const op = p.opacity * fadeIn * fadeOut;
      const yWave = Math.sin(time * 0.002 + p.phase) * 2;

      // Schaum-Linie als horizontaler Streifen mit feinen Wellen
      ctx.strokeStyle = `rgba(255, 255, 255, ${op * 0.7})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      const segments = 16;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = p.x + t * p.size;
        const yOff = Math.sin(t * Math.PI * 3 + p.phase + time * 0.003) * 1.6 + yWave;
        if (i === 0) ctx.moveTo(x, p.y + yOff);
        else ctx.lineTo(x, p.y + yOff);
      }
      ctx.stroke();
    };

    const drawSandSparkle = (p: Particle, time: number) => {
      // Schwellt langsam an und ab — kein gleichmäßiges Funkeln
      const t = p.life / p.maxLife;
      const env = Math.sin(t * Math.PI); // 0..1..0
      const fastTwinkle = 0.5 + Math.sin(time * 0.006 * p.speed + p.phase) * 0.5;
      const op = env * fastTwinkle * 0.9;

      if (op < 0.02) return;

      const r = p.size;

      // Zentraler heller Punkt
      ctx.fillStyle = `rgba(255, 250, 235, ${op})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Kreuzförmige Lichtbeugung (cross sparkle)
      const armLen = r * 6 * (0.7 + env * 0.5);
      ctx.strokeStyle = `rgba(255, 245, 220, ${op * 0.85})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(p.x - armLen, p.y);
      ctx.lineTo(p.x + armLen, p.y);
      ctx.moveTo(p.x, p.y - armLen);
      ctx.lineTo(p.x, p.y + armLen);
      ctx.stroke();

      // Diagonale Beugungslinien (subtiler)
      const diag = armLen * 0.55;
      ctx.strokeStyle = `rgba(255, 240, 210, ${op * 0.4})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(p.x - diag, p.y - diag);
      ctx.lineTo(p.x + diag, p.y + diag);
      ctx.moveTo(p.x - diag, p.y + diag);
      ctx.lineTo(p.x + diag, p.y - diag);
      ctx.stroke();
    };

    // ============================================================
    //  UNTERWASSER
    // ============================================================

    const drawBubble = (p: Particle, time: number) => {
      const minDim = Math.min(width, height);
      const portholeR = (minDim * 0.86) / 2 - 32;

      const sway = Math.sin(time * 0.002 * p.speed + p.phase) * 18 + Math.cos(time * 0.0035 + p.phase) * 6;
      const cx = p.x + sway;
      const cy = p.y;

      // Bullaugen-Clip
      const dx = cx - width * 0.5;
      const dy = cy - height * 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > portholeR - 4) return;

      const edgeFade = Math.min(1, (portholeR - dist) / 40);

      // Wobble: asynchrone Stauchung/Dehnung
      const wobble = Math.sin(time * (p.wobbleFreq ?? 0.004) + p.phase) * (p.wobbleAmp ?? 0.2);
      const rx = p.size * (1 + wobble);
      const ry = p.size * (1 - wobble * 0.85);

      const op = p.opacity * edgeFade;

      ctx.save();
      ctx.translate(cx, cy);

      // Äußere Blasenfüllung
      const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
      bodyGrad.addColorStop(0, `rgba(200, 240, 255, ${op * 0.25})`);
      bodyGrad.addColorStop(0.7, `rgba(180, 230, 250, ${op * 0.18})`);
      bodyGrad.addColorStop(1, 'rgba(160, 220, 245, 0)');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Blasen-Umriss
      ctx.strokeStyle = `rgba(220, 250, 255, ${op * 0.7})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Haupt-Glanzpunkt (groß, oben-links)
      ctx.fillStyle = `rgba(255, 255, 255, ${op * 0.95})`;
      ctx.beginPath();
      ctx.arc(-rx * 0.35, -ry * 0.35, Math.max(0.8, rx * 0.22), 0, Math.PI * 2);
      ctx.fill();

      // Sekundärer Glanzpunkt (klein, unten-rechts)
      ctx.fillStyle = `rgba(255, 255, 255, ${op * 0.55})`;
      ctx.beginPath();
      ctx.arc(rx * 0.4, ry * 0.45, Math.max(0.4, rx * 0.1), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawPlankton = (p: Particle, time: number) => {
      const minDim = Math.min(width, height);
      const portholeR = (minDim * 0.86) / 2 - 32;

      const dx = p.x - width * 0.5;
      const dy = p.y - height * 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > portholeR - 2) return;

      const pulse = 0.5 + Math.sin(time * 0.0015 * p.speed + p.phase) * 0.5;
      const op = p.opacity * pulse * (1 - dist / portholeR * 0.3);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 230, 255, ${op})`;
      ctx.fill();
    };

    const drawFish = (p: Particle, time: number) => {
      const minDim = Math.min(width, height);
      const portholeR = (minDim * 0.86) / 2 - 32;

      // Vertikales Schwingen
      const verticalSway = Math.sin(time * p.speed + p.phase) * (p.amplitude ?? 20);
      p.y = (p.baseY ?? p.y) + verticalSway;

      // Bullaugen-Clip
      const dx = p.x - width * 0.5;
      const dy = p.y - height * 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Sanftes Ein-/Ausblenden am Rand der Luke
      let edgeFade = 1;
      if (dist > portholeR - 60) {
        edgeFade = Math.max(0, (portholeR - dist) / 60);
      }
      if (edgeFade <= 0.01) return;

      // Schwanz-Schwingen (Sinus)
      const tailAngle = Math.sin(time * 0.008 + p.phase * 2) * 0.55;

      const dir = p.vx >= 0 ? 1 : -1;
      const len = p.size;
      const bodyH = len * 0.35;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(dir, 1);

      const hue = p.hue ?? 180;

      // Bioluminescent Aura
      const auraR = len * 1.6;
      const auraGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, auraR);
      auraGrad.addColorStop(0, `hsla(${hue}, 90%, 65%, ${0.25 * edgeFade})`);
      auraGrad.addColorStop(0.5, `hsla(${hue}, 85%, 55%, ${0.10 * edgeFade})`);
      auraGrad.addColorStop(1, `hsla(${hue}, 80%, 50%, 0)`);
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, auraR, 0, Math.PI * 2);
      ctx.fill();

      // Körper (tropfenförmig)
      const bodyGrad = ctx.createLinearGradient(-len * 0.5, 0, len * 0.5, 0);
      bodyGrad.addColorStop(0, `hsla(${hue}, 60%, 18%, ${0.85 * edgeFade})`);
      bodyGrad.addColorStop(0.55, `hsla(${hue}, 70%, 35%, ${0.95 * edgeFade})`);
      bodyGrad.addColorStop(1, `hsla(${hue}, 75%, 45%, ${0.9 * edgeFade})`);
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(len * 0.5, 0);
      ctx.bezierCurveTo(len * 0.3, -bodyH, -len * 0.3, -bodyH * 0.7, -len * 0.45, 0);
      ctx.bezierCurveTo(-len * 0.3, bodyH * 0.7, len * 0.3, bodyH, len * 0.5, 0);
      ctx.closePath();
      ctx.fill();

      // Glühende Bauchlinie
      ctx.strokeStyle = `hsla(${hue + 20}, 100%, 75%, ${0.5 * edgeFade})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-len * 0.3, bodyH * 0.35);
      ctx.quadraticCurveTo(0, bodyH * 0.6, len * 0.35, bodyH * 0.15);
      ctx.stroke();

      // Schwanzflosse (schwingt)
      ctx.save();
      ctx.translate(-len * 0.42, 0);
      ctx.rotate(tailAngle);
      ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${0.75 * edgeFade})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-len * 0.35, -bodyH * 0.9);
      ctx.lineTo(-len * 0.25, 0);
      ctx.lineTo(-len * 0.35, bodyH * 0.9);
      ctx.closePath();
      ctx.fill();

      // Schwanzflossen-Glow
      ctx.shadowColor = `hsla(${hue + 15}, 100%, 70%, ${0.7 * edgeFade})`;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = `hsla(${hue + 25}, 100%, 80%, ${0.5 * edgeFade})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Rückenflosse
      ctx.fillStyle = `hsla(${hue}, 70%, 40%, ${0.7 * edgeFade})`;
      ctx.beginPath();
      ctx.moveTo(-len * 0.1, -bodyH * 0.85);
      ctx.quadraticCurveTo(0, -bodyH * 1.4, len * 0.15, -bodyH * 0.7);
      ctx.lineTo(len * 0.1, -bodyH * 0.5);
      ctx.lineTo(-len * 0.08, -bodyH * 0.5);
      ctx.closePath();
      ctx.fill();

      // Leuchtende Brustflosse
      ctx.fillStyle = `hsla(${hue + 10}, 85%, 60%, ${0.6 * edgeFade})`;
      ctx.beginPath();
      ctx.ellipse(len * 0.05, bodyH * 0.55, len * 0.15, bodyH * 0.18, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Leuchtendes Auge
      const eyeX = len * 0.3;
      const eyeY = -bodyH * 0.15;
      const eyeR = len * 0.06;

      // Auge-Aura
      const eyeGlow = ctx.createRadialGradient(eyeX, eyeY, 0, eyeX, eyeY, eyeR * 3);
      eyeGlow.addColorStop(0, `hsla(${hue + 40}, 100%, 80%, ${0.9 * edgeFade})`);
      eyeGlow.addColorStop(1, `hsla(${hue + 40}, 100%, 70%, 0)`);
      ctx.fillStyle = eyeGlow;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeR * 3, 0, Math.PI * 2);
      ctx.fill();

      // Auge-Kern
      ctx.fillStyle = `hsla(${hue + 60}, 100%, 90%, ${edgeFade})`;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
      ctx.fill();
      // Pupille
      ctx.fillStyle = `rgba(0, 20, 30, ${0.85 * edgeFade})`;
      ctx.beginPath();
      ctx.arc(eyeX + eyeR * 0.2, eyeY, eyeR * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawPortholeCaustic = (p: Particle, time: number) => {
      const minDim = Math.min(width, height);
      const portholeR = (minDim * 0.86) / 2 - 32;

      const drift = Math.sin(time * 0.0005 * p.speed + p.phase) * 80;
      const driftY = Math.cos(time * 0.0007 + p.phase) * 30;
      const cx = width * 0.5 + drift + Math.cos(time * 0.0003 + p.phase) * portholeR * 0.35;
      const cy = height * 0.5 + driftY + Math.sin(time * 0.0004 + p.phase) * portholeR * 0.2;

      // Bullaugen-Clip
      const dx = cx - width * 0.5;
      const dy = cy - height * 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > portholeR - 10) return;

      const pulse = 0.5 + Math.sin(time * 0.0012 + p.phase) * 0.5;
      const op = p.opacity * pulse * Math.min(1, (portholeR - dist) / 60);
      const r = p.size * (0.9 + pulse * 0.2);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `rgba(120, 230, 220, ${op * 0.9})`);
      grad.addColorStop(0.5, `rgba(80, 180, 200, ${op * 0.4})`);
      grad.addColorStop(1, 'rgba(60, 150, 180, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    // ============================================================
    //  ANIMATION LOOP
    // ============================================================
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // Hain: Lichtsäulen zuerst, damit Pollen darüber liegen
      if (effect === 'rays') {
        drawRayColumns(timestamp);
      }

      const particles = particlesRef.current;
      const minDim = Math.min(width, height);
      const portholeR = (minDim * 0.86) / 2 - 32;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Zeichnen
        switch (p.kind) {
          case 'raindrop': drawRaindrop(p, timestamp); break;
          case 'dust-mote': drawDustMote(p, timestamp); break;
          case 'star': drawStar(p, timestamp); break;
          case 'fog-band': drawFogBand(p, timestamp); break;
          case 'leaf': drawLeaf(p, timestamp); break;
          case 'ripple': drawRipple(p); break;
          case 'ember': drawEmber(p, timestamp); break;
          case 'train-light': drawTrainLight(p, timestamp); break;
          case 'caustic': drawFloorCaustic(p, timestamp); break;
          case 'pollen': drawPollen(p, timestamp); break;
          case 'wave': drawWave(p, timestamp); break;
          case 'foamcrest': drawFoamCrest(p, timestamp); break;
          case 'foamline': drawFoamLine(p, timestamp); break;
          case 'sandsparkle': drawSandSparkle(p, timestamp); break;
          case 'bubble': drawBubble(p, timestamp); break;
          case 'plankton': drawPlankton(p, timestamp); break;
          case 'fish': drawFish(p, timestamp); break;
          case 'porthole-caustic': drawPortholeCaustic(p, timestamp); break;
        }

        // Reset-Logik
        switch (p.kind) {
          case 'raindrop': {
            if (p.y > height + 40 || p.x < -120) {
              p.x = Math.random() * (width + 200) - 40;
              p.y = -40 - Math.random() * 240;
              p.vx = -1.2 - Math.random() * 1.6;
              p.vy = 12 + Math.random() * 10;
              p.size = 8 + Math.random() * 16;
              p.opacity = 0.1 + Math.random() * 0.22;
              p.phase = Math.random() * Math.PI * 2;
            }
            break;
          }
          case 'dust-mote': {
            if (p.x > width + 30 || p.y < -30 || p.life > p.maxLife) {
              p.x = -20 - Math.random() * 40;
              p.y = Math.random() * height;
              p.vx = 0.06 + Math.random() * 0.12;
              p.vy = -0.015 - Math.random() * 0.04;
              p.size = 0.8 + Math.random() * 2.2;
              p.opacity = 0.08 + Math.random() * 0.2;
              p.life = 0;
              p.maxLife = 360 + Math.random() * 260;
            }
            break;
          }
          case 'star': {
            if (p.life > p.maxLife) {
              p.life = 0;
              p.maxLife = 600 + Math.random() * 1400;
              p.x = Math.random() * width;
              p.y = Math.random() * height * 0.62;
              p.size = 0.9 + Math.random() * 2.2;
              p.opacity = 0.16 + Math.random() * 0.34;
              p.phase = Math.random() * Math.PI * 2;
            }
            break;
          }
          case 'fog-band': {
            if (p.x - p.size > width + 40) {
              p.x = -p.size - 60;
              p.y = height * (0.24 + Math.random() * 0.48);
              p.size = 280 + Math.random() * 380;
              p.opacity = 0.035 + Math.random() * 0.05;
              p.vx = 0.08 + Math.random() * 0.12;
            }
            break;
          }
          case 'leaf': {
            p.rotation = (p.rotation ?? 0) + (p.rotationSpeed ?? 0);
            if (p.y > height + 40 || p.x < -80 || p.x > width + 80) {
              p.x = Math.random() * width;
              p.y = -20 - Math.random() * 140;
              p.vx = -0.55 + Math.random() * 1.1;
              p.vy = 0.55 + Math.random() * 1.2;
              p.size = 4 + Math.random() * 10;
              p.opacity = 0.2 + Math.random() * 0.5;
              p.rotation = Math.random() * Math.PI * 2;
              p.rotationSpeed = -0.03 + Math.random() * 0.06;
              p.phase = Math.random() * Math.PI * 2;
            }
            break;
          }
          case 'ripple': {
            if (p.life > p.maxLife) {
              p.life = 0;
              p.maxLife = 180 + Math.random() * 120;
              p.x = Math.random() * width;
              p.y = height * (0.58 + Math.random() * 0.37);
              p.size = 10 + Math.random() * 24;
              p.opacity = 0.12 + Math.random() * 0.18;
            }
            break;
          }
          case 'ember': {
            if (p.y < height * 0.2 || p.life > p.maxLife) {
              p.life = 0;
              p.maxLife = 140 + Math.random() * 120;
              p.x = width * (0.35 + Math.random() * 0.3);
              p.y = height * (0.72 + Math.random() * 0.2);
              p.vx = -0.3 + Math.random() * 0.6;
              p.vy = -0.7 - Math.random() * 1.2;
              p.size = 1.4 + Math.random() * 3.8;
              p.opacity = 0.35 + Math.random() * 0.45;
              p.phase = Math.random() * Math.PI * 2;
            }
            break;
          }
          case 'train-light': {
            if (p.x - p.size > width + 80) {
              p.x = -120 - Math.random() * width * 0.6;
              p.y = height * (0.2 + Math.random() * 0.55);
              p.vx = 2 + Math.random() * 4;
              p.size = 14 + Math.random() * 42;
              p.opacity = 0.08 + Math.random() * 0.24;
              p.phase = Math.random() * Math.PI * 2;
            }
            break;
          }
          case 'pollen': {
            if (p.y < -20 || p.x < -30 || p.x > width + 30) {
              p.x = Math.random() * width;
              p.y = height + 10 + Math.random() * height * 0.2;
              p.vx = (Math.random() - 0.5) * 0.25;
              p.vy = -0.12 - Math.random() * 0.22;
              p.phase = Math.random() * Math.PI * 2;
              p.glowIntensity = 0;
            }
            break;
          }
          case 'wave': {
            if (p.life > p.maxLife) p.life = 0;
            break;
          }
          case 'foamline': {
            if (p.x + p.size < -20 || p.life > p.maxLife) {
              p.life = 0;
              p.x = width + Math.random() * 80;
              p.y = height * (0.84 + Math.random() * 0.13);
              p.size = 60 + Math.random() * 200;
              p.opacity = 0.25 + Math.random() * 0.35;
              p.vx = -0.4 - Math.random() * 0.6;
            }
            break;
          }
          case 'sandsparkle': {
            if (p.life > p.maxLife) {
              p.life = 0;
              p.maxLife = 200 + Math.random() * 200;
              p.x = Math.random() * width;
              p.y = height * (0.86 + Math.random() * 0.13);
              p.phase = Math.random() * Math.PI * 2;
              p.size = 0.8 + Math.random() * 1.6;
            }
            break;
          }
          case 'bubble': {
            const ddx = p.x - width * 0.5;
            const ddy = p.y - height * 0.5;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            const tooHigh = p.y < height * 0.5 - portholeR + 15;
            if (dist > portholeR - 4 || tooHigh) {
              const randomAngle = Math.random() * Math.PI;
              const dist2 = Math.random() * portholeR * 0.85;
              p.x = width * 0.5 + Math.cos(randomAngle + Math.PI * 0.5) * dist2;
              p.y = height * 0.5 + portholeR * 0.85 + Math.random() * 30;
              p.vy = -0.4 - Math.random() * 1.1;
              p.size = 2.5 + Math.random() * 7;
              p.opacity = 0.35 + Math.random() * 0.35;
              p.phase = Math.random() * Math.PI * 2;
              p.wobbleFreq = 0.003 + Math.random() * 0.005;
              p.wobbleAmp = 0.15 + Math.random() * 0.25;
            }
            break;
          }
          case 'plankton': {
            const ddx = p.x - width * 0.5;
            const ddy = p.y - height * 0.5;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (p.life > p.maxLife || dist > portholeR - 2) {
              p.life = 0;
              const angle = Math.random() * Math.PI * 2;
              const d = Math.random() * portholeR * 0.92;
              p.x = width * 0.5 + Math.cos(angle) * d;
              p.y = height * 0.5 + Math.sin(angle) * d;
            }
            break;
          }
          case 'fish': {
            const offscreen = p.vx > 0 ? p.x > width + 200 : p.x < -200;
            if (offscreen) {
              const fromLeft = Math.random() < 0.5;
              p.x = fromLeft ? -150 : width + 150;
              p.vx = (fromLeft ? 1 : -1) * (0.35 + Math.random() * 0.35);
              const newBase = height * (0.3 + Math.random() * 0.45);
              p.baseY = newBase;
              p.y = newBase;
              p.amplitude = 16 + Math.random() * 22;
              p.size = 26 + Math.random() * 24;
              p.hue = 165 + Math.random() * 40;
              p.phase = Math.random() * Math.PI * 2;
              p.speed = 0.003 + Math.random() * 0.002;
            }
            break;
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [effect, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
