import React, { useEffect, useMemo, useState } from 'react';
import { Room, TransitionType } from '../types/refugium';
import { SceneBackdrop } from './SceneBackdrop';

interface TransitionOverlayProps {
  type: TransitionType;
  nextRoom: Room;
  originX: number;
  originY: number;
  durationMs: number;
  onComplete: () => void;
}

const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
  type,
  nextRoom,
  originX,
  originY,
  durationMs,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const rawProgress = Math.min((now - start) / durationMs, 1);
      setProgress(rawProgress);

      if (rawProgress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        onComplete();
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [durationMs, onComplete]);

  const eased = easeInOut(progress);
  const portalScale = 1.18 - eased * 0.18;
  const portalBlur = Math.max(0, 12 - eased * 12);
  const portalOpacity = 0.18 + eased * 0.82;
  const veilOpacity = 0.08 + (1 - eased) * 0.24;
  const labelOpacity = progress > 0.18 && progress < 0.88 ? Math.min(1, (progress - 0.18) / 0.18, (0.88 - progress) / 0.2 + 0.2) : 0;

  const clipPath = useMemo(() => {
    const centerX = `${originX}%`;
    const centerY = `${originY}%`;

    if (type === 'tuer') {
      const width = 1 + eased * 180;
      const left = Math.max(-20, originX - width / 2);
      const right = Math.min(120, originX + width / 2);
      return `polygon(${left}% 0%, ${right}% 0%, ${right}% 100%, ${left}% 100%)`;
    }

    if (type === 'wasserreflexion') {
      const rx = 2 + eased * 100;
      const ry = 1 + eased * 70;
      return `ellipse(${rx}% ${ry}% at ${centerX} ${centerY})`;
    }

    if (type === 'vorhang') {
      const rx = 2 + eased * 120;
      const ry = 6 + eased * 82;
      return `ellipse(${rx}% ${ry}% at ${centerX} ${centerY})`;
    }

    if (type === 'dunkelheit') {
      const radius = 0.8 + eased * 120;
      return `circle(${radius}% at ${centerX} ${centerY})`;
    }

    if (type === 'detailzoom') {
      const radius = 1 + eased * 135;
      return `circle(${radius}% at ${centerX} ${centerY})`;
    }

    const radius = 1 + eased * 125;
    return `circle(${radius}% at ${centerX} ${centerY})`;
  }, [eased, originX, originY, type]);

  const ringStyle = useMemo(() => {
    const size = 8 + eased * 170;
    const opacity = 0.5 - eased * 0.35;

    return {
      left: `calc(${originX}% - ${size / 2}vmax)`,
      top: `calc(${originY}% - ${size / 2}vmax)`,
      width: `${size}vmax`,
      height: `${size}vmax`,
      opacity
    };
  }, [eased, originX, originY]);

  const renderAtmosphere = () => {
    switch (type) {
      case 'nebel':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/20 to-slate-950/30" />
            <div
              className="absolute w-[160vw] h-[160vw] rounded-full blur-3xl bg-gray-200/12"
              style={{
                left: `calc(${originX}% - 80vw + ${eased * 6}vw)`,
                top: `calc(${originY}% - 80vw + ${eased * 4}vw)`,
                opacity: 0.5 - eased * 0.2
              }}
            />
          </>
        );
      case 'tuer':
        return (
          <div
            className="absolute inset-y-0 bg-amber-100/18 blur-2xl"
            style={{
              left: `calc(${originX}% - ${Math.max(1, eased * 18)}vw)`,
              width: `${Math.max(2, eased * 36)}vw`,
              opacity: 0.45 - eased * 0.15
            }}
          />
        );
      case 'vorhang':
        return (
          <>
            <div className="absolute inset-y-0 left-0 w-[55vw] bg-[#10171d]/25 backdrop-blur-[1px]" style={{ transform: `translateX(${(1 - eased) * -18}%)` }} />
            <div className="absolute inset-y-0 right-0 w-[55vw] bg-[#151d23]/22 backdrop-blur-[1px]" style={{ transform: `translateX(${(1 - eased) * 18}%)` }} />
          </>
        );
      case 'wasserreflexion':
        return (
          <div
            className="absolute rounded-full blur-3xl bg-cyan-300/12"
            style={{
              left: `calc(${originX}% - ${18 + eased * 45}vw)`,
              top: `calc(${originY}% - ${8 + eased * 18}vh)`,
              width: `${36 + eased * 90}vw`,
              height: `${16 + eased * 36}vh`,
              opacity: 0.35
            }}
          />
        );
      case 'detailzoom':
        return (
          <div
            className="absolute rounded-full bg-white/8 blur-2xl"
            style={{
              left: `calc(${originX}% - ${3 + eased * 20}vmax)`,
              top: `calc(${originY}% - ${3 + eased * 20}vmax)`,
              width: `${6 + eased * 40}vmax`,
              height: `${6 + eased * 40}vmax`,
              opacity: 0.28
            }}
          />
        );
      case 'dunkelheit':
        return (
          <div
            className="absolute rounded-full bg-amber-100/14 blur-3xl"
            style={{
              left: `calc(${originX}% - ${2 + eased * 18}vmax)`,
              top: `calc(${originY}% - ${2 + eased * 18}vmax)`,
              width: `${4 + eased * 36}vmax`,
              height: `${4 + eased * 36}vmax`,
              opacity: 0.42 - eased * 0.15
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 z-50 overflow-hidden pointer-events-auto select-none">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,6,23,0.05),rgba(2,6,23,0.28))] transition-opacity"
        style={{ opacity: veilOpacity }}
      />

      <div
        className="absolute inset-0 will-change-transform will-change-[clip-path]"
        style={{
          clipPath,
          WebkitClipPath: clipPath,
          transform: `scale(${portalScale})`,
          filter: `blur(${portalBlur}px) saturate(${0.82 + eased * 0.32}) brightness(${0.78 + eased * 0.28})`,
          opacity: portalOpacity,
          transformOrigin: `${originX}% ${originY}%`
        }}
      >
        <SceneBackdrop room={nextRoom} />
      </div>

      <div
        className="absolute rounded-full border border-white/18 shadow-[0_0_80px_rgba(255,255,255,0.08)] mix-blend-screen"
        style={ringStyle}
      />

      {renderAtmosphere()}

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(2,6,23,0.08)_100%)]" />

      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center px-6 transition-opacity duration-700"
        style={{ opacity: labelOpacity * 0.9 }}
      >
        <p className="text-[10px] md:text-xs uppercase tracking-[0.45em] text-gray-400/80 font-light mb-3">
          Ein anderer Ort wird hörbar
        </p>
        <h2 className="text-2xl md:text-4xl font-cinzel font-light tracking-wide text-gray-100/90 mb-2">
          {nextRoom.name}
        </h2>
        <p className="text-sm md:text-lg text-gray-400/90 font-spectral italic">
          {nextRoom.emotionalWord}
        </p>
      </div>
    </div>
  );
};