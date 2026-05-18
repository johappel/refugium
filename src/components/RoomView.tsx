import React, { useEffect, useRef, useState } from 'react';
import { Room, ClickArea } from '../types/refugium';
import { AblageGeste } from './AblageGeste';
import { SceneBackdrop } from './SceneBackdrop';

const HEADER_FADE_MS = 1400;
const CENTER_TEXT_FADE_MS = 6000;
const INITIAL_THOUGHT_DELAY_MS = 10000;
const INITIAL_THOUGHT_DURATION_MS = 20000;
const RETURN_THOUGHT_DURATION_MS = 15000;
const MICRO_EVENT_INTERVAL_MS = 15000;
const MICRO_EVENT_DELAY_MS = 10000;
const MICRO_EVENT_VISIBLE_MS = MICRO_EVENT_INTERVAL_MS;

const SHARED_TEXT_PANEL_STYLE = {
  background:
    'radial-gradient(ellipse at center, rgba(7, 11, 16, 0.42) 0%, rgba(7, 11, 16, 0.28) 48%, rgba(7, 11, 16, 0.1) 72%, rgba(7, 11, 16, 0) 100%)',
  boxShadow: '0 16px 42px rgba(0, 0, 0, 0.18)'
} as const;

const SOFT_MIST_HEADER_PANEL_STYLE = {
  background:
    'radial-gradient(ellipse at center, rgba(244, 238, 228, 0.22) 0%, rgba(228, 220, 210, 0.14) 46%, rgba(196, 188, 178, 0.06) 72%, rgba(196, 188, 178, 0) 100%)',
  boxShadow: '0 14px 34px rgba(48, 36, 24, 0.08)'
} as const;

const ROOM_MICRO_EVENTS: Record<string, string[]> = {
  'fensterplatz-regen': [
    'Ein einzelner, schwerer Tropfen rinnt langsam das Fenster hinab.',
    'In der Ferne spiegelt sich das Scheinwerferlicht eines einsamen Wagens.'
  ],
  'bibliothek-nacht': [
    'Ein Glasgefäß fängt das warme Licht und gibt es stumpf an die Regale zurück.',
    'Ein Hauch von Kräutern, Staub und altem Papier bleibt in der Luft stehen.'
  ],
  wintergarten: [
    'Ein großes Farnblatt neigt sich unter dem eigenen Gewicht minimal nach unten.',
    'Ein kühler Luftzug streift die beschlagene Scheibe.'
  ],
  nachtzug: [
    'Hinter dem dunklen Fenster zieht eine Baumreihe als weicher Schatten vorbei.',
    'Ein fernes Signallicht gleitet kurz wie ein warmer Strich über die Scheibe.'
  ],
  sternwarte: [
    'Ein einzelner Stern wird für einen Atemzug heller und sinkt dann wieder in die Ruhe zurück.',
    'Die kühle Nachtluft trägt den Duft von taufrischem Gras herauf.'
  ],
  'ufer-nebel': [
    'Zwischen Wasser und Schilf zeichnet sich kurz der Bogen eines alten Stegs ab.',
    'Der Nebel hebt sich für einen Herzschlag und lässt das gegenüberliegende Ufer ahnen.'
  ],
  'stiller-innenhof': [
    'Im Brunnen sammelt sich ein ruhiger Kreis aus Licht und Wasser.',
    'Ein Tropfen löst sich vom Steinrand und verliert sich im dunklen Becken.'
  ],
  'leere-kirche': [
    'Eine Kerzenflamme richtet sich auf und macht die Stille noch größer.',
    'Vom Gewölbe sinkt langsam ein Staubkorn durch den goldenen Lichtkegel.'
  ],
  'blaue-lagune': [
    'Das Wasser unter dem Felsbogen leuchtet auf, als würde es von innen atmen.',
    'Ein einzelner Tropfen fällt von der Höhle herab und zieht einen weiten Ring.'
  ]
};

interface RoomViewProps {
  room: Room;
  onNavigate: (targetRoomId: string, area: ClickArea) => void;
  thoughtReplayTrigger: number;
}

type CenterTextKind = 'thought' | 'micro';

export const RoomView: React.FC<RoomViewProps> = ({ room, onNavigate, thoughtReplayTrigger }) => {
  const headerPanelStyle = room.id === 'ufer-nebel' ? SOFT_MIST_HEADER_PANEL_STYLE : SHARED_TEXT_PANEL_STYLE;
  const headerTitleShadow =
    room.id === 'ufer-nebel'
      ? '0 2px 10px rgba(48, 36, 24, 0.32), 0 8px 22px rgba(48, 36, 24, 0.12)'
      : '0 2px 10px rgba(0, 0, 0, 0.88), 0 10px 28px rgba(0, 0, 0, 0.42)';

  const [canNavigate, setCanNavigate] = useState(false);
  const [microEvent, setMicroEvent] = useState<string | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [centerTextMode, setCenterTextMode] = useState<'hidden' | 'thought' | 'micro'>('hidden');
  const manualThoughtTimerRef = useRef<number | null>(null);
  const centerTextClearTimerRef = useRef<number | null>(null);
  const [renderedCenterText, setRenderedCenterText] = useState<{
    kind: CenterTextKind;
    content: string;
  } | null>(null);
  const [isCenterTextVisible, setIsCenterTextVisible] = useState(false);

  const showThought = renderedCenterText?.kind === 'thought';
  const showCenterText = renderedCenterText !== null;
  const centerTextContent = renderedCenterText?.content ?? null;

  useEffect(() => {
    setCanNavigate(false);
    setHoveredArea(null);
    setCenterTextMode('hidden');
    setMicroEvent(null);
    setRenderedCenterText(null);
    setIsCenterTextVisible(false);

    if (manualThoughtTimerRef.current !== null) {
      clearTimeout(manualThoughtTimerRef.current);
      manualThoughtTimerRef.current = null;
    }

    if (centerTextClearTimerRef.current !== null) {
      clearTimeout(centerTextClearTimerRef.current);
      centerTextClearTimerRef.current = null;
    }

    const roomMicroEvents = ROOM_MICRO_EVENTS[room.id] ?? [];
    const sequenceTimers: number[] = [];
    let microEventIndex = 0;
    let microEventTimeoutId: number | null = null;
    let microEventsPaused = false;
    let isDisposed = false;

    const clearMicroEventTimeout = () => {
      if (microEventTimeoutId !== null) {
        clearTimeout(microEventTimeoutId);
        microEventTimeoutId = null;
      }
    };

    const runMicroEventCycle = () => {
      if (isDisposed || microEventsPaused || roomMicroEvents.length === 0) {
        return;
      }

      setCenterTextMode('hidden');
      setMicroEvent(null);

      microEventTimeoutId = window.setTimeout(() => {
        if (isDisposed || microEventsPaused) {
          return;
        }

        setMicroEvent(roomMicroEvents[microEventIndex]);
        setCenterTextMode('micro');
        microEventIndex = (microEventIndex + 1) % roomMicroEvents.length;

        microEventTimeoutId = window.setTimeout(() => {
          runMicroEventCycle();
        }, MICRO_EVENT_VISIBLE_MS);
      }, MICRO_EVENT_DELAY_MS);
    };

    const pauseMicroEvents = () => {
      microEventsPaused = true;
      clearMicroEventTimeout();
      setMicroEvent(null);
    };

    const startMicroEventCycle = () => {
      if (roomMicroEvents.length === 0) {
        setMicroEvent(null);
        setCenterTextMode('hidden');
        return;
      }

      microEventsPaused = false;
      runMicroEventCycle();
    };

    sequenceTimers.push(
      window.setTimeout(() => {
        pauseMicroEvents();
        setCenterTextMode('thought');
      }, INITIAL_THOUGHT_DELAY_MS)
    );

    sequenceTimers.push(
      window.setTimeout(() => {
        startMicroEventCycle();
      }, INITIAL_THOUGHT_DELAY_MS + INITIAL_THOUGHT_DURATION_MS)
    );

    const timer = window.setTimeout(() => {
      setCanNavigate(true);
    }, 3500);

    return () => {
      isDisposed = true;
      clearTimeout(timer);
      sequenceTimers.forEach((id) => clearTimeout(id));
      clearMicroEventTimeout();
    };
  }, [room.id]);

  useEffect(() => {
    return () => {
      if (manualThoughtTimerRef.current !== null) {
        clearTimeout(manualThoughtTimerRef.current);
      }

      if (centerTextClearTimerRef.current !== null) {
        clearTimeout(centerTextClearTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (centerTextClearTimerRef.current !== null) {
      clearTimeout(centerTextClearTimerRef.current);
      centerTextClearTimerRef.current = null;
    }

    if (centerTextMode === 'thought') {
      if (renderedCenterText?.kind !== 'thought' || renderedCenterText.content !== room.thought) {
        setRenderedCenterText({ kind: 'thought', content: room.thought });
      }
      setIsCenterTextVisible(true);
      return;
    }

    if (centerTextMode === 'micro' && microEvent) {
      if (renderedCenterText?.kind !== 'micro' || renderedCenterText.content !== microEvent) {
        setRenderedCenterText({ kind: 'micro', content: microEvent });
      }
      setIsCenterTextVisible(true);
      return;
    }

    setIsCenterTextVisible(false);

    if (renderedCenterText !== null) {
      centerTextClearTimerRef.current = window.setTimeout(() => {
        setRenderedCenterText(null);
        centerTextClearTimerRef.current = null;
      }, CENTER_TEXT_FADE_MS);
    }
  }, [centerTextMode, microEvent, renderedCenterText, room.thought]);

  useEffect(() => {
    if (thoughtReplayTrigger === 0) return;

    if (manualThoughtTimerRef.current !== null) {
      clearTimeout(manualThoughtTimerRef.current);
    }

    setCenterTextMode('thought');
    manualThoughtTimerRef.current = window.setTimeout(() => {
      setCenterTextMode((currentMode) => (currentMode === 'thought' ? 'hidden' : currentMode));
      manualThoughtTimerRef.current = null;
    }, RETURN_THOUGHT_DURATION_MS);
  }, [thoughtReplayTrigger, room.id]);

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
          style={headerPanelStyle}
        >
          <div className="mb-3 flex min-h-[1.5rem] items-center justify-center">
            <span
              className="block text-xs tracking-[0.4em] text-gray-300/78 uppercase font-light font-sans transition-all ease-out opacity-100 translate-y-0"
              style={{ transitionDuration: `${HEADER_FADE_MS}ms` }}
            >
              {room.emotionalWord}
            </span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light tracking-wider text-gray-50 font-cinzel"
            style={{ textShadow: headerTitleShadow }}
          >
            {room.name}
          </h1>
        </div>
      </div>

      {/* Mittlerer Bereich: Gedanke & Mikro-Ereignisse */}
      <div className="relative z-10 px-8 md:px-24 max-w-3xl mx-auto flex flex-col items-center justify-center pointer-events-none text-center my-auto">
        <div
          className={`relative mb-8 w-full max-w-2xl min-h-[8.5rem] md:min-h-[10rem] rounded-[2rem] px-6 py-5 md:px-8 md:py-6 backdrop-blur-[2px] border transition-all ease-out ${
            showCenterText && isCenterTextVisible
              ? 'opacity-100 translate-y-0 border-white/8'
              : 'opacity-0 translate-y-3 border-transparent'
          }`}
          style={{
            ...SHARED_TEXT_PANEL_STYLE,
            transitionDuration: `${CENTER_TEXT_FADE_MS}ms`
          }}
          aria-hidden={!showCenterText}
        >
          {centerTextContent && (
            <p
              className={`w-full text-center leading-relaxed transition-all ease-out ${
                showThought
                  ? 'text-lg md:text-2xl text-gray-100/92 font-spectral italic font-light tracking-wide'
                  : 'text-sm md:text-base text-gray-200/84 font-sans font-light tracking-[0.06em]'
              }`}
              style={{
                transitionDuration: `${CENTER_TEXT_FADE_MS}ms`,
                textShadow: showThought
                  ? '0 2px 10px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.34)'
                  : '0 2px 10px rgba(0, 0, 0, 0.78), 0 8px 24px rgba(0, 0, 0, 0.28)'
              }}
            >
              {showThought ? `„${room.thought}“` : centerTextContent}
            </p>
          )}
        </div>
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