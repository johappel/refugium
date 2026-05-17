import React, { useState } from 'react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [isFading, setIsFading] = useState(false);

  const handleStart = () => {
    setIsFading(true);
    setTimeout(() => {
      onEnter();
    }, 1500);
  };

  return (
    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F17] text-gray-200 px-6 transition-opacity duration-1500 select-none ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Sanfter, atmender Hintergrundschimmer */}
      <div className="absolute w-[150vw] h-[150vh] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0F17] to-[#05070A] blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 max-w-xl mx-auto text-center flex flex-col items-center">
        <span className="text-xs tracking-[0.6em] text-gray-500 uppercase font-light mb-6 font-sans">
          Digitale Zuflucht
        </span>
        <h1 className="text-4xl md:text-6xl font-light tracking-widest text-gray-100 font-cinzel mb-8 drop-shadow-lg">
          REFUGIUM
        </h1>

        <div className="space-y-6 text-base md:text-lg text-gray-400 font-spectral italic font-light leading-relaxed max-w-md mb-12">
          <p>
            Hier musst du nichts leisten. Es gibt keine Aufgaben, keine Punktzahlen, keine Eile.
          </p>
          <p>
            Bewege dich langsam zwischen den Orten, indem du verborgene Pfade erkundest. Verweile, lausche der Stille und lass flüchtige Gedanken weiterziehen.
          </p>
        </div>

        <button
          onClick={handleStart}
          className="group relative px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-full text-xs tracking-[0.3em] uppercase text-gray-300 hover:text-white transition-all duration-700 backdrop-blur-sm overflow-hidden"
        >
          <span className="relative z-10 font-sans">Eintreten</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </button>

        <div className="mt-16 flex items-center space-x-2 text-[11px] tracking-wider text-gray-600 font-light font-sans">
          <span>Kopfhörer empfohlen</span>
          <span>•</span>
          <span>Vollständig offlinefähig</span>
        </div>
      </div>
    </div>
  );
};