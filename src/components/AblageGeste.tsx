import React, { useState } from 'react';

interface AblageGesteProps {
  effectType?: 'rain' | 'dust' | 'stars' | 'fog' | 'leaves' | 'water';
}

interface Particle {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  scale: number;
}

export const AblageGeste: React.FC<AblageGesteProps> = ({ effectType = 'fog' }) => {
  const [thought, setThought] = useState('');
  const [isDissolving, setIsDissolving] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim() || isDissolving) return;

    setIsDissolving(true);

    // Zerlege den Text in Wörter oder Zeichen für den Partikel-Effekt
    const words = thought.split(' ');
    const newParticles: Particle[] = words.map((word, index) => {
      const angle = (Math.random() * Math.PI) - Math.PI / 2; // nach oben/seitlich
      const speed = Math.random() * 2 + 1;
      return {
        id: index,
        text: word,
        x: (index * 20) % 200 - 100, // Streuung
        y: 0,
        vx: Math.sin(angle) * speed,
        vy: -Math.cos(angle) * speed - 1,
        opacity: 1,
        scale: 1
      };
    });

    setParticles(newParticles);

    // Animiere Partikel
    const startTime = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 4) {
        clearInterval(interval);
        setParticles([]);
        setThought('');
        setIsDissolving(false);
      } else {
        setParticles((prev) =>
          prev.map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: Math.max(0, 1 - elapsed / 3.5),
            scale: p.scale * 0.98
          }))
        );
      }
    }, 50);
  };

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-30 pointer-events-auto">
      {!isDissolving ? (
        <form onSubmit={handleRelease} className="flex flex-col items-center opacity-40 hover:opacity-90 transition-opacity duration-700">
          <label className="text-xs tracking-widest text-gray-400 font-light mb-3 text-center uppercase font-spectral italic">
            Was du hier ablegst, muss nicht bleiben.
          </label>
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Einen Gedanken der Stille übergeben..."
              className="w-full bg-black/30 border border-gray-700/50 rounded-full px-6 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-500/80 backdrop-blur-md transition-all font-light text-center"
            />
            {thought.trim() && (
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 bg-gray-800/60 hover:bg-gray-700/80 text-gray-300 rounded-full text-xs tracking-wider uppercase transition-all duration-300 border border-gray-600/40"
              >
                Ablegen
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="relative h-24 flex items-center justify-center pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute text-sm font-light text-gray-300 tracking-wider transition-transform duration-75 font-spectral italic"
              style={{
                transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale})`,
                opacity: p.opacity,
                textShadow: effectType === 'stars' ? '0 0 8px rgba(255,255,255,0.8)' : 'none',
                filter: effectType === 'fog' ? `blur(${(1 - p.opacity) * 4}px)` : 'none'
              }}
            >
              {p.text}
            </div>
          ))}
          <div className="absolute text-xs text-gray-500 tracking-widest uppercase font-light animate-pulse">
            Der Gedanke löst sich auf...
          </div>
        </div>
      )}
    </div>
  );
};