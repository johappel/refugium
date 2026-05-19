import React from 'react';

export interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

interface ClickRippleOverlayProps {
  ripples: ClickRipple[];
}

const WAVE_DELAYS = [0, 220, 460];

export const ClickRippleOverlay: React.FC<ClickRippleOverlayProps> = ({ ripples }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-[8] overflow-hidden">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
        >
          <div className="interaction-ripple-aura" />

          {WAVE_DELAYS.map((delay, index) => (
            <div
              key={delay}
              className="interaction-ripple-wave"
              style={{ animationDelay: `${delay}ms`, opacity: 0.22 - index * 0.045 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};