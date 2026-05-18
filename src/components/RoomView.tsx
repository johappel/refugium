import React, { useState, useEffect } from 'react';
import { Room, ClickArea } from '../types/refugium';
import { AblageGeste } from './AblageGeste';
import { SceneBackdrop } from './SceneBackdrop';

interface RoomViewProps {
  room: Room;
  onNavigate: (targetRoomId: string, area: ClickArea) => void;
}

export const RoomView: React.FC<RoomViewProps> = ({ room, onNavigate }) => {
  const [canNavigate, setCanNavigate] = useState(false);
  const [microEvent, setMicroEvent] = useState<string | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  useEffect(() => {
    setCanNavigate(false);
    setHoveredArea(null);
    setMicroEvent(null);

    const timer = window.setTimeout(() => {
      setCanNavigate(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [room.id]);

  useEffect(() => {
    const intervals: number[] = [];

    const scheduleMicroEvent = (delay: number, text: string) => {
      const id = window.setTimeout(() => {
        setMicroEvent(text);
        const hideId = window.setTimeout(() => setMicroEvent(null), 7000);
        intervals.push(hideId);
      }, delay);
      intervals.push(id);
    };

    if (room.id === 'fensterplatz-regen') {
      scheduleMicroEvent(18000, 'Ein einzelner, schwerer Tropfen rinnt langsam das Fenster hinab.');
      scheduleMicroEvent(42000, 'In der Ferne spiegelt sich das Scheinwerferlicht eines einsamen Wagens.');
    } else if (room.id === 'bibliothek-nacht') {
      scheduleMicroEvent(22000, 'Ein Glasgefäß fängt das warme Licht und gibt es stumpf an die Regale zurück.');
      scheduleMicroEvent(50000, 'Ein Hauch von Kräutern, Staub und altem Papier bleibt in der Luft stehen.');
    } else if (room.id === 'wintergarten') {
      scheduleMicroEvent(16000, 'Ein großes Farnblatt neigt sich unter dem eigenen Gewicht minimal nach unten.');
      scheduleMicroEvent(38000, 'Ein kühler Luftzug streift die beschlagene Scheibe.');
    } else if (room.id === 'nachtzug') {
      scheduleMicroEvent(20000, 'Hinter dem dunklen Fenster zieht eine Baumreihe als weicher Schatten vorbei.');
      scheduleMicroEvent(45000, 'Ein fernes Signallicht gleitet kurz wie ein warmer Strich über die Scheibe.');
    } else if (room.id === 'sternwarte') {
      scheduleMicroEvent(15000, 'Ein einzelner Stern wird für einen Atemzug heller und sinkt dann wieder in die Ruhe zurück.');
      scheduleMicroEvent(35000, 'Die kühle Nachtluft trägt den Duft von taufrischem Gras herauf.');
    } else if (room.id === 'ufer-nebel') {
      scheduleMicroEvent(25000, 'Zwischen Wasser und Schilf zeichnet sich kurz der Bogen eines alten Stegs ab.');
      scheduleMicroEvent(55000, 'Der Nebel hebt sich für einen Herzschlag und lässt das gegenüberliegende Ufer ahnen.');
    } else if (room.id === 'stiller-innenhof') {
      scheduleMicroEvent(20000, 'Im Brunnen sammelt sich ein ruhiger Kreis aus Licht und Wasser.');
      scheduleMicroEvent(48000, 'Ein Tropfen löst sich vom Steinrand und verliert sich im dunklen Becken.');
    } else if (room.id === 'leere-kirche') {
      scheduleMicroEvent(24000, 'Eine Kerzenflamme richtet sich auf und macht die Stille noch größer.');
      scheduleMicroEvent(52000, 'Vom Gewölbe sinkt langsam ein Staubkorn durch den goldenen Lichtkegel.');
    } else if (room.id === 'blaue-lagune') {
      scheduleMicroEvent(18000, 'Das Wasser unter dem Felsbogen leuchtet auf, als würde es von innen atmen.');
      scheduleMicroEvent(47000, 'Ein einzelner Tropfen fällt von der Höhle herab und zieht einen weiten Ring.');
    }

    return () => {
      intervals.forEach((id) => clearTimeout(id));
    };
  }, [room.id]);

  const handleAreaClick = (area: ClickArea) => {
    if (!canNavigate) return;
    onNavigate(area.targetRoomId, area);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none flex flex-col justify-between">
      {/* Hintergrundbild + Canvas-Animationen */}
      <SceneBackdrop room={room} />

      {/* Unsichtbare Click-Areas */}
      {room.clickAreas.map((area) => (
        <div
          key={area.id}
          onClick={() => handleAreaClick(area)}
          onMouseEnter={() => setHoveredArea(area.id)}
          onMouseLeave={() => setHoveredArea(null)}
          className={`absolute z-20 cursor-pointer transition-all duration-700 ${
            canNavigate ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          style={{
            left: `${area.x}%`,
            top: `${area.y}%`,
            width: `${area.width}%`,
            height: `${area.height}%`
          }}
        >
          {hoveredArea === area.id && area.label && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-black/40 text-gray-300/80 text-xs px-3 py-1.5 rounded-full font-light tracking-wider backdrop-blur-sm border border-white/10 animate-fade-in font-sans">
                {area.label}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Oberer Bereich: Name & Emotionales Wort */}
      <div className="relative z-10 pt-16 px-8 md:px-16 flex flex-col items-center pointer-events-none text-center">
        <div
          className="px-6 py-4 md:px-10 md:py-6 rounded-[2rem] backdrop-blur-[2px] border border-white/8"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(7, 11, 16, 0.42) 0%, rgba(7, 11, 16, 0.28) 48%, rgba(7, 11, 16, 0.1) 72%, rgba(7, 11, 16, 0) 100%)',
            boxShadow: '0 16px 42px rgba(0, 0, 0, 0.18)'
          }}
        >
          <span className="text-xs tracking-[0.4em] text-gray-300/78 uppercase font-light mb-3 font-sans block">
            {room.emotionalWord}
          </span>
          <h1
            className="text-3xl md:text-5xl font-light tracking-wider text-gray-50 font-cinzel"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.88), 0 10px 28px rgba(0, 0, 0, 0.42)' }}
          >
            {room.name}
          </h1>
        </div>
      </div>

      {/* Mittlerer Bereich: Gedanke & Mikro-Ereignisse */}
      <div className="relative z-10 px-8 md:px-24 max-w-3xl mx-auto flex flex-col items-center justify-center pointer-events-none text-center my-auto">
        <div
          className="mb-8 max-w-2xl rounded-[2rem] px-6 py-5 md:px-8 md:py-6 backdrop-blur-[2px] border border-white/8"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(6, 10, 14, 0.5) 0%, rgba(6, 10, 14, 0.34) 52%, rgba(6, 10, 14, 0.1) 76%, rgba(6, 10, 14, 0) 100%)',
            boxShadow: '0 18px 46px rgba(0, 0, 0, 0.2)'
          }}
        >
          <p
            className="text-lg md:text-2xl text-gray-100/92 font-spectral italic font-light leading-relaxed tracking-wide"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.34)' }}
          >
            „{room.thought}“
          </p>
        </div>

        {microEvent && (
          <div className="bg-black/30 border border-white/10 rounded-2xl px-6 py-3 backdrop-blur-md animate-fade-in-out max-w-lg">
            <p className="text-xs md:text-sm text-gray-300 font-light tracking-wider font-sans">
              {microEvent}
            </p>
          </div>
        )}
      </div>

      {/* Unterer Bereich: Optionale Ablage-Geste */}
      {room.hasAblageGeste && (
        <AblageGeste effectType={room.visual.overlayEffect as 'rain' | 'dust' | 'stars' | 'fog' | 'leaves' | 'water' | undefined} />
      )}

      {/* Ruhephase-Hinweis */}
      {!canNavigate && (
        <div className="absolute bottom-6 right-6 z-10 pointer-events-none opacity-40">
          <span className="text-[10px] tracking-widest text-gray-400 uppercase font-light font-sans">
            Ruhephase...
          </span>
        </div>
      )}
    </div>
  );
};