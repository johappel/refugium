import React, { useState, useEffect } from 'react';
import { Room, TransitionType, ClickArea } from './types/refugium';
import { INITIAL_ROOMS } from './data/rooms';
import { packageService } from './services/packageService';
import { audioService } from './services/audioService';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RoomView } from './components/RoomView';
import { TransitionOverlay } from './components/TransitionOverlay';
import { ArchitectureModal } from './components/ArchitectureModal';
import { PackageInstaller } from './components/PackageInstaller';
import { Volume2, VolumeX, BookOpen, Package, Eye, Gift } from 'lucide-react';

const STORAGE_KEY_LAST_ROOM = 'refugium_last_room_id';

const getTransitionDuration = (type: TransitionType) => {
  switch (type) {
    case 'nebel':
      return 12500;
    case 'tuer':
      return 11200;
    case 'vorhang':
      return 11800;
    case 'wasserreflexion':
      return 12100;
    case 'detailzoom':
      return 10900;
    case 'dunkelheit':
      return 11600;
    default:
      return 11500;
  }
};

export const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [allRooms, setAllRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [currentRoom, setCurrentRoom] = useState<Room>(INITIAL_ROOMS[0]);
  const [pendingRoom, setPendingRoom] = useState<Room | null>(null);
  const [activeTransition, setActiveTransition] = useState<{
    type: TransitionType;
    originX: number;
    originY: number;
    durationMs: number;
  } | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [isPackageInstallerOpen, setIsPackageInstallerOpen] = useState(false);
  const [thoughtReplayTrigger, setThoughtReplayTrigger] = useState(0);
  const [isGiftPopoverOpen, setIsGiftPopoverOpen] = useState(false);

  useEffect(() => {
    const installedRooms = packageService.getInstalledRooms();
    const combinedRooms = [...INITIAL_ROOMS, ...installedRooms];
    setAllRooms(combinedRooms);

    try {
      const lastRoomId = localStorage.getItem(STORAGE_KEY_LAST_ROOM);
      if (lastRoomId) {
        const found = combinedRooms.find((r) => r.id === lastRoomId);
        if (found) {
          setCurrentRoom(found);
        }
      }
    } catch (err) {
      console.warn('Konnte letzten Raum nicht aus localStorage laden', err);
    }
  }, []);

  useEffect(() => {
    if (!hasEntered) return;

    const resumeAudio = async () => {
      if (document.hidden || !document.hasFocus() || activeTransition) return;

      await audioService.init();
      audioService.playRoomAudio(currentRoom.audio, currentRoom.singleSounds);
      audioService.setMuted(isMuted);
    };

    const suspendAudio = () => {
      audioService.stopAll();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        suspendAudio();
        return;
      }

      void resumeAudio();
    };

    const handleWindowBlur = () => {
      suspendAudio();
    };

    const handleWindowFocus = () => {
      void resumeAudio();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('pagehide', suspendAudio);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('pagehide', suspendAudio);
    };
  }, [activeTransition, currentRoom, hasEntered, isMuted]);

  useEffect(() => {
    return () => {
      audioService.stopAll();
    };
  }, []);

  useEffect(() => {
    setIsGiftPopoverOpen(false);
  }, [currentRoom.id]);

  const handleEnterRefuge = async () => {
    await audioService.init();
    setHasEntered(true);
    audioService.playRoomAudio(currentRoom.audio, currentRoom.singleSounds);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioService.setMuted(nextMuted);
  };

  const handleNavigate = (targetRoomId: string, area: ClickArea) => {
    const nextRoom = allRooms.find((r) => r.id === targetRoomId);
    if (!nextRoom) {
      console.warn(`Zielraum ${targetRoomId} nicht gefunden.`);
      return;
    }

    const durationMs = getTransitionDuration(nextRoom.transitionType);
    const originX = area.x + area.width / 2;
    const originY = area.y + area.height / 2;

    setPendingRoom(nextRoom);
    setActiveTransition({
      type: nextRoom.transitionType,
      originX,
      originY,
      durationMs
    });

    audioService.beginTransitionTo(nextRoom.audio, durationMs / 1000);
  };

  const handleTransitionComplete = () => {
    if (!pendingRoom) return;

    setCurrentRoom(pendingRoom);
    setActiveTransition(null);

    try {
      localStorage.setItem(STORAGE_KEY_LAST_ROOM, pendingRoom.id);
    } catch (err) {
      console.warn('Konnte Raum nicht in localStorage speichern', err);
    }

    audioService.finalizeTransition(pendingRoom.audio, pendingRoom.singleSounds);
    setPendingRoom(null);
  };

  const handlePackageInstalled = () => {
    const installedRooms = packageService.getInstalledRooms();
    const combinedRooms = [...INITIAL_ROOMS, ...installedRooms];
    setAllRooms(combinedRooms);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans select-none">
      {!hasEntered && <WelcomeScreen onEnter={handleEnterRefuge} />}

      {hasEntered && (
        <RoomView
          room={currentRoom}
          onNavigate={handleNavigate}
          thoughtReplayTrigger={thoughtReplayTrigger}
        />
      )}

      {activeTransition && pendingRoom && (
        <TransitionOverlay
          type={activeTransition.type}
          nextRoom={pendingRoom}
          originX={activeTransition.originX}
          originY={activeTransition.originY}
          durationMs={activeTransition.durationMs}
          onComplete={handleTransitionComplete}
        />
      )}

      {hasEntered && !activeTransition && (
        <div className="absolute top-6 right-6 z-40 flex flex-col items-end gap-3 opacity-30 hover:opacity-100 transition-opacity duration-700">
          <div className="flex items-center space-x-4">
            {currentRoom.giftPopoverText && (
              <button
                onClick={() => setIsGiftPopoverOpen((current) => !current)}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                  isGiftPopoverOpen
                    ? 'bg-amber-200/20 text-amber-100 border-amber-200/30'
                    : 'bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white border-white/10'
                }`}
                title="Besondere Notiz öffnen"
                aria-pressed={isGiftPopoverOpen}
              >
                <Gift size={16} />
              </button>
            )}

            <button
              onClick={handleToggleMute}
              className="p-2.5 bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white rounded-full backdrop-blur-md border border-white/10 transition-all"
              title={isMuted ? 'Ton einschalten' : 'Ton stummschalten'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <button
              onClick={() => setThoughtReplayTrigger((current) => current + 1)}
              className="p-2.5 bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white rounded-full backdrop-blur-md border border-white/10 transition-all"
              title="Hauptgedanken erneut zeigen"
            >
              <Eye size={16} />
            </button>
            
            <button
              onClick={() => setIsPackageInstallerOpen(true)}
              className="hidden p-2.5 bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white rounded-full backdrop-blur-md border border-white/10 transition-all relative"
              title="Erweiterungs-Pakete verwalten"
            >
              <Package size={16} />
              {packageService.getAvailablePackages().length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              )}
            </button>

            <button 
              onClick={() => setIsArchModalOpen(true)}
              className="hidden p-2.5 bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white rounded-full backdrop-blur-md border border-white/10 transition-all flex items-center space-x-2 px-4"
              title="Konzept & Architektur öffnen"
            >
              <BookOpen size={16} />
              <span className="text-[11px] tracking-widest uppercase font-light hidden md:inline">Konzept</span>
            </button>
          </div>

          {currentRoom.giftPopoverText && isGiftPopoverOpen && (
            <div className="max-w-md rounded-[1.75rem] border border-amber-100/15 bg-black/55 px-5 py-4 text-left text-sm leading-relaxed text-gray-100/90 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
              {currentRoom.giftPopoverTitle && (
                <h2 className="mb-3 text-xs font-light uppercase tracking-[0.22em] text-amber-100/80">
                  {currentRoom.giftPopoverTitle}
                </h2>
              )}
              <div className="whitespace-pre-line">
                {currentRoom.giftPopoverText}
              </div>
            </div>
          )}
        </div>
      )}

      <ArchitectureModal isOpen={isArchModalOpen} onClose={() => setIsArchModalOpen(false)} />

      <PackageInstaller
        isOpen={isPackageInstallerOpen}
        onClose={() => setIsPackageInstallerOpen(false)}
        onPackageInstalled={handlePackageInstalled}
      />
    </div>
  );
};

export default App;