import React, { useEffect, useRef, useState } from 'react';
import { Room, ClickArea } from '../types/refugium';
import { audioService } from '../services/audioService';
import { AblageGeste } from './AblageGeste';
import { ClickRippleOverlay, ClickRipple } from './ClickRippleOverlay';
import { SceneBackdrop } from './SceneBackdrop';

const HEADER_FADE_MS = 1400;
const CENTER_TEXT_FADE_MS = 6000;
const INITIAL_THOUGHT_DELAY_MS = 10000;
const INITIAL_THOUGHT_DURATION_MS = 20000;
const RETURN_THOUGHT_DURATION_MS = INITIAL_THOUGHT_DURATION_MS;
const MICRO_EVENT_INTERVAL_MS = 15000;
const MICRO_EVENT_DELAY_MS = 10000;
const MICRO_EVENT_VISIBLE_MS = MICRO_EVENT_INTERVAL_MS;
const INTERACTION_RIPPLE_LIFETIME_MS = 5600;

const ROOM_CLICK_SOUND = {
  name: 'Rauminteraktion',
  type: 'sample' as const,
  sample: {
    url: 'sound-effects/chakra3.mp3',
    volume: 0.06,
    lowpass: 5600,
    playbackRateMin: 1.004,
    playbackRateMax: 1.022
  },
  intervalMin: 0,
  intervalMax: 0
};

const NAVIGATION_CLICK_SOUND = {
  name: 'Navigation',
  type: 'sample' as const,
  sample: {
    url: 'sound-effects/navigation.mp3',
    volume: 0.45,
    lowpass: 6200,
    playbackRateMin: 0.994,
    playbackRateMax: 1.012
  },
  intervalMin: 0,
  intervalMax: 0
};

interface NavigationBeaconPalette {
  core: string;
  ring: string;
  glow: string;
}

const NAVIGATION_BEACON_PALETTES: Record<string, NavigationBeaconPalette> = {
  'fensterplatz-regen': { core: 'rgba(154, 208, 255, 0.7)', ring: 'rgba(154, 208, 255, 0.34)', glow: 'rgba(90, 172, 255, 0.42)' },
  'bibliothek-nacht': { core: 'rgba(255, 204, 150, 0.7)', ring: 'rgba(255, 204, 150, 0.32)', glow: 'rgba(208, 126, 70, 0.4)' },
  wintergarten: { core: 'rgba(183, 235, 177, 0.72)', ring: 'rgba(183, 235, 177, 0.34)', glow: 'rgba(112, 190, 112, 0.4)' },
  nachtzug: { core: 'rgba(175, 191, 255, 0.68)', ring: 'rgba(175, 191, 255, 0.3)', glow: 'rgba(102, 120, 220, 0.4)' },
  sternwarte: { core: 'rgba(186, 185, 255, 0.72)', ring: 'rgba(186, 185, 255, 0.32)', glow: 'rgba(116, 110, 255, 0.42)' },
  'ufer-nebel': { core: 'rgba(215, 228, 244, 0.7)', ring: 'rgba(215, 228, 244, 0.28)', glow: 'rgba(150, 174, 205, 0.36)' },
  'stiller-innenhof': { core: 'rgba(175, 242, 226, 0.7)', ring: 'rgba(175, 242, 226, 0.3)', glow: 'rgba(88, 178, 165, 0.38)' },
  'leere-kirche': { core: 'rgba(255, 228, 182, 0.74)', ring: 'rgba(255, 228, 182, 0.34)', glow: 'rgba(228, 176, 112, 0.42)' },
  hain: { core: 'rgba(190, 232, 154, 0.72)', ring: 'rgba(190, 232, 154, 0.3)', glow: 'rgba(124, 176, 92, 0.4)' },
  sandstrand: { core: 'rgba(255, 198, 154, 0.72)', ring: 'rgba(255, 198, 154, 0.32)', glow: 'rgba(220, 142, 100, 0.42)' },
  'blaue-lagune': { core: 'rgba(148, 234, 255, 0.74)', ring: 'rgba(148, 234, 255, 0.32)', glow: 'rgba(72, 168, 206, 0.42)' },
  'japanisches-teehaueschen': { core: 'rgba(255, 220, 176, 0.72)', ring: 'rgba(255, 220, 176, 0.3)', glow: 'rgba(192, 140, 92, 0.4)' },
  kaminzimmer: { core: 'rgba(255, 176, 136, 0.74)', ring: 'rgba(255, 176, 136, 0.32)', glow: 'rgba(214, 98, 58, 0.42)' }
};

const NAVIGATION_BEACON_FALLBACKS: NavigationBeaconPalette[] = [
  { core: 'rgba(175, 214, 255, 0.72)', ring: 'rgba(175, 214, 255, 0.3)', glow: 'rgba(98, 168, 224, 0.42)' },
  { core: 'rgba(194, 238, 176, 0.72)', ring: 'rgba(194, 238, 176, 0.32)', glow: 'rgba(110, 180, 108, 0.4)' },
  { core: 'rgba(255, 208, 162, 0.72)', ring: 'rgba(255, 208, 162, 0.32)', glow: 'rgba(210, 132, 86, 0.42)' },
  { core: 'rgba(198, 192, 255, 0.72)', ring: 'rgba(198, 192, 255, 0.3)', glow: 'rgba(112, 102, 224, 0.4)' }
];

function getNavigationBeaconPalette(targetRoomId: string): NavigationBeaconPalette {
  const explicitPalette = NAVIGATION_BEACON_PALETTES[targetRoomId];
  if (explicitPalette) return explicitPalette;

  const hash = Array.from(targetRoomId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return NAVIGATION_BEACON_FALLBACKS[hash % NAVIGATION_BEACON_FALLBACKS.length];
}

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
    'Regen glitzert auf dem Geländer, während eine Kerzenflamme ruhig weiterbrennt.',
    'Vom See her hebt sich für einen Moment ein heller Streifen zwischen den Bergen.'
  ],
  'bibliothek-nacht': [
    'Im Kamin sinkt ein Holzscheit in sich zusammen und lässt das Licht kurz tiefer atmen.',
    'Am Fensterglas zieht eine feine Regenbahn durch das Dunkel.'
  ],
  wintergarten: [
    'Ein Sonnenstrahl wandert über nasses Blattwerk und öffnet einen kleinen Goldrand.',
    'Aus dem feuchten Grün löst sich der Duft warmer Erde.'
  ],
  nachtzug: [
    'Die Lampe auf dem Tisch schwingt fast unmerklich mit dem Rhythmus der Schienen.',
    'Jenseits der Scheibe gleitet die Nacht vorbei, ohne dass irgendetwas erreicht werden müsste.'
  ],
  sternwarte: [
    'Ein einzelner Stern tritt aus dem Dunkel, fern und doch zum Greifen nah.',
    'Über der offenen Kuppel liegt eine Weite, in der der Blick sich öffnet und der Moment ganz dir gehört.'
  ],
  'ufer-nebel': [
    'Im Nebel zeichnet sich für einen Augenblick die nächste Planke deutlicher ab.',
    'Über dem Wasser wird das Licht wärmer und legt einen stillen Schein auf den Steg.'
  ],
  'stiller-innenhof': [
    'Aus der dunklen Tiefe steigt ein stilles Glänzen auf, als würde das Wasser kurz den Atem anhalten.',
    'Ein Tropfen fällt ins Becken, und für einen Augenblick breitet sich sanfte Ruhe über das Wasser aus.'
  ],
  'leere-kirche': [
    'Durch das offene Gewölbe fangen sich kleine Staubpartikel tanzend im weichen Gegenlicht.',
    'Zwischen den verwitterten Steinen breitet sich eine gelassene, unaufgeregte Stille aus.'
  ],
  hain: [
    'Zwischen den Wurzeln glimmt blaues Licht auf und verlischt wieder sanft.',
    'Ein Windzug fährt durch das Blätterdach, doch der Pfad bleibt still und geschützt.'
  ],
  sandstrand: [
    'Eine flache Welle schiebt sich über den Sand und nimmt die Spuren des Tages mit sich.',
    'Über dem Wasser sinkt die Sonne tiefer und lässt den Blick ohne Ziel in die Ferne gleiten.'
  ],
  'blaue-lagune': [
    'Das blaue Wasser wirft tanzendes Licht gegen den Fels und an die Decken.',
    'Eine Flamme neigt sich kurz zur Höhlenöffnung und richtet sich wieder auf.'
  ],
  'japanisches-teehaueschen': [
    'Ein feiner Dampffaden steigt aus der Kanne und löst sich lautlos im Papierlicht auf.',
    'Regen streicht über die Shoji-Schirme, weich genug, um fast wie Atem zu klingen.'
  ],
  kaminzimmer: [
    'Im Kamin platzt leise eine Glut und färbt die Lehne des Sessels kurz rot.',
    'Ein Schatten zieht langsam über die Holzvertäfelung und wird wieder still.'
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
  const [clickRipples, setClickRipples] = useState<ClickRipple[]>([]);
  const [centerTextMode, setCenterTextMode] = useState<'hidden' | 'thought' | 'micro'>('hidden');
  const manualThoughtTimerRef = useRef<number | null>(null);
  const manualThoughtActiveRef = useRef(false);
  const centerTextClearTimerRef = useRef<number | null>(null);
  const pauseMicroEventsRef = useRef<(() => void) | null>(null);
  const startMicroEventCycleRef = useRef<(() => void) | null>(null);
  const interactionRippleTimersRef = useRef<number[]>([]);
  const nextRippleIdRef = useRef(0);
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
    setClickRipples([]);
    setCenterTextMode('hidden');
    setMicroEvent(null);
    setRenderedCenterText(null);
    setIsCenterTextVisible(false);
    manualThoughtActiveRef.current = false;

    if (manualThoughtTimerRef.current !== null) {
      clearTimeout(manualThoughtTimerRef.current);
      manualThoughtTimerRef.current = null;
    }

    if (centerTextClearTimerRef.current !== null) {
      clearTimeout(centerTextClearTimerRef.current);
      centerTextClearTimerRef.current = null;
    }

    interactionRippleTimersRef.current.forEach((timerId) => clearTimeout(timerId));
    interactionRippleTimersRef.current = [];

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
      if (isDisposed || microEventsPaused || manualThoughtActiveRef.current || roomMicroEvents.length === 0) {
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
      if (manualThoughtActiveRef.current) {
        return;
      }

      if (roomMicroEvents.length === 0) {
        setMicroEvent(null);
        setCenterTextMode('hidden');
        return;
      }

      microEventsPaused = false;
      runMicroEventCycle();
    };

    pauseMicroEventsRef.current = pauseMicroEvents;
    startMicroEventCycleRef.current = startMicroEventCycle;

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
      pauseMicroEventsRef.current = null;
      startMicroEventCycleRef.current = null;
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

      interactionRippleTimersRef.current.forEach((timerId) => clearTimeout(timerId));
      interactionRippleTimersRef.current = [];
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

    manualThoughtActiveRef.current = true;
    pauseMicroEventsRef.current?.();
    setCenterTextMode('thought');
    manualThoughtTimerRef.current = window.setTimeout(() => {
      manualThoughtActiveRef.current = false;
      setCenterTextMode((currentMode) => (currentMode === 'thought' ? 'hidden' : currentMode));
      startMicroEventCycleRef.current?.();
      manualThoughtTimerRef.current = null;
    }, RETURN_THOUGHT_DURATION_MS);
  }, [thoughtReplayTrigger, room.id]);

  const handleAreaClick = (area: ClickArea) => {
    if (!canNavigate) return;
    audioService.playUiSample(NAVIGATION_CLICK_SOUND);
    onNavigate(area.targetRoomId, area);
  };

  const spawnInteractionRipple = (container: HTMLElement, clientX: number, clientY: number) => {
    const bounds = container.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;

    const x = ((clientX - bounds.left) / bounds.width) * 100;
    const y = ((clientY - bounds.top) / bounds.height) * 100;
    const rippleId = nextRippleIdRef.current++;

    setClickRipples((current) => [...current.slice(-5), { id: rippleId, x, y }]);

    const timerId = window.setTimeout(() => {
      setClickRipples((current) => current.filter((ripple) => ripple.id !== rippleId));
      interactionRippleTimersRef.current = interactionRippleTimersRef.current.filter((id) => id !== timerId);
    }, INTERACTION_RIPPLE_LIFETIME_MS);

    interactionRippleTimersRef.current.push(timerId);
  };

  const triggerInteractionFeedback = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!['mouse', 'touch', 'pen'].includes(event.pointerType)) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-nav-area="true"]')) return;

    spawnInteractionRipple(event.currentTarget, event.clientX, event.clientY);

    audioService.playUiSample(ROOM_CLICK_SOUND);
  };

  const handleAreaPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!['mouse', 'touch', 'pen'].includes(event.pointerType)) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    event.stopPropagation();
    spawnInteractionRipple(event.currentTarget, event.clientX, event.clientY);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none flex flex-col justify-between"
      onPointerDown={triggerInteractionFeedback}
    >
      {/* Hintergrundbild + Canvas-Animationen */}
      <SceneBackdrop room={room} />
      <ClickRippleOverlay ripples={clickRipples} />

      {/* Unsichtbare Click-Areas */}
      {room.clickAreas.map((area, index) => {
        const beaconPalette = getNavigationBeaconPalette(area.targetRoomId);
        const beaconDuration = 7.8 + (index % 4) * 0.7;
        const beaconDelay = -((index * 1.35) % 5.2);

        return (
        <div
          key={area.id}
          data-nav-area="true"
          onPointerDown={handleAreaPointerDown}
          onClick={() => handleAreaClick(area)}
          className={`absolute z-20 cursor-pointer transition-all duration-700 ${
            canNavigate ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          aria-label={area.label ?? `Navigation zu ${area.targetRoomId}`}
          title={area.label}
          style={{
            left: `${area.x}%`,
            top: `${area.y}%`,
            width: `${area.width}%`,
            height: `${area.height}%`
          }}
        >
          <span className="sr-only">{area.label ?? `Navigation zu ${area.targetRoomId}`}</span>
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="navigation-beacon-core"
              style={{
                background: beaconPalette.core,
                boxShadow: `0 0 18px ${beaconPalette.glow}, 0 0 36px ${beaconPalette.glow}`,
                animationDuration: `${beaconDuration}s`,
                animationDelay: `${beaconDelay}s`
              }}
            />
            <div
              className="navigation-beacon-ring"
              style={{
                borderColor: beaconPalette.ring,
                boxShadow: `0 0 18px ${beaconPalette.glow}, 0 0 42px ${beaconPalette.glow}`,
                animationDuration: `${beaconDuration}s`,
                animationDelay: `${beaconDelay}s`
              }}
            />
          </div>
        </div>
        );
      })}

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