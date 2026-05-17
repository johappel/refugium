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
      scheduleMicroEvent(22000, 'Ein leises Knarren im Gebälk. Das alte Holz dehnt sich in der Nacht.');
      scheduleMicroEvent(50000, 'Der schwache Geruch von Bienenwachs und getrockneten Lavendelblüten zieht vorbei.');
    } else if (room.id === 'wintergarten') {
      scheduleMicroEvent(16000, 'Ein großes Farnblatt neigt sich unter dem eigenen Gewicht minimal nach unten.');
      scheduleMicroEvent(38000, 'Ein kühler Luftzug streift die beschlagene Scheibe.');
    } else if (room.id === 'nachtzug') {
      scheduleMicroEvent(20000, 'Ein verlassener Bahnübergang huscht als verschwommener Lichtblitz vorüber.');
      scheduleMicroEvent(45000, 'Das rhythmische Klicken der Schienenstäbe wechselt kurz den Takt.');
    } else if (room.id === 'sternwarte') {
      scheduleMicroEvent(15000, 'Eine winzige Sternschnuppe zieht eine feine, stumme Bahn durch das Schwarz.');
      scheduleMicroEvent(35000, 'Die kühle Nachtluft trägt den Duft von taufrischem Gras herauf.');
    } else if (room.id === 'ufer-nebel') {
      scheduleMicroEvent(25000, 'Ein Fisch durchbricht lautlos die Wasseroberfläche und hinterlässt sanfte Ringe.');
      scheduleMicroEvent(55000, 'Der Nebel teilt sich für einen kurzen Moment und gibt den Blick auf Schilf frei.');
    } else if (room.id === 'stiller-innenhof') {
      scheduleMicroEvent(20000, 'Eine kleine Feder schwebt vom Dachgesims herab und landet auf dem feuchten Stein.');
      scheduleMicroEvent(48000, 'Das Wasser im Brunnenbecken fängt einen fernen Sternenreflex ein.');
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
        <span className="text-xs tracking-[0.4em] text-gray-400/70 uppercase font-light mb-3 font-sans drop-shadow-lg">
          {room.emotionalWord}
        </span>
        <h1 className="text-3xl md:text-5xl font-light tracking-wider text-gray-100 font-cinzel drop-shadow-lg">
          {room.name}
        </h1>
      </div>

      {/* Mittlerer Bereich: Gedanke & Mikro-Ereignisse */}
      <div className="relative z-10 px-8 md:px-24 max-w-3xl mx-auto flex flex-col items-center justify-center pointer-events-none text-center my-auto">
        <p className="text-lg md:text-2xl text-gray-200/90 font-spectral italic font-light leading-relaxed tracking-wide mb-8 drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
          „{room.thought}“
        </p>

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