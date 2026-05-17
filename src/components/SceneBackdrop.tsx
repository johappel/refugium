import React from 'react';
import { Room } from '../types/refugium';
import { CanvasOverlay } from './CanvasOverlay';
import { ROOM_IMAGES } from '../data/roomImages';

interface SceneBackdropProps {
  room: Room;
  className?: string;
}

export const SceneBackdrop: React.FC<SceneBackdropProps> = ({ room, className = '' }) => {
  const imageUrl = ROOM_IMAGES[room.id];
  const hasImage = !!imageUrl;
  const overlayCanvasStyle: React.CSSProperties | undefined =
    room.id === 'fensterplatz-regen' && room.visual.overlayEffect === 'rain'
      ? {
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 42%, rgba(0,0,0,0.78) 50%, rgba(0,0,0,0.25) 58%, rgba(0,0,0,0) 66%)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 42%, rgba(0,0,0,0.78) 50%, rgba(0,0,0,0.25) 58%, rgba(0,0,0,0) 66%)'
        }
      : room.id === 'sandstrand' && room.visual.overlayEffect === 'waves'
        ? {
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.14) 38%, rgba(0,0,0,0.92) 47%, rgba(0,0,0,1) 55%, rgba(0,0,0,1) 66%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 74%)',
            WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.14) 38%, rgba(0,0,0,0.92) 47%, rgba(0,0,0,1) 55%, rgba(0,0,0,1) 66%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 74%)'
          }
      : room.id === 'nachtzug' && room.visual.overlayEffect === 'train-lights'
        ? {
            maskImage: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.98) 60%, rgba(0,0,0,0.82) 72%, rgba(0,0,0,0.28) 86%, rgba(0,0,0,0) 96%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.98) 60%, rgba(0,0,0,0.82) 72%, rgba(0,0,0,0.28) 86%, rgba(0,0,0,0) 96%)'
          }
      : room.id === 'blaue-lagune' && room.visual.overlayEffect === 'water'
        ? {
            maskImage: 'radial-gradient(ellipse at 18% 42%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 18%, rgba(0,0,0,0.78) 34%, rgba(0,0,0,0.26) 50%, rgba(0,0,0,0.04) 62%, rgba(0,0,0,0) 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 18% 42%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 18%, rgba(0,0,0,0.78) 34%, rgba(0,0,0,0.26) 50%, rgba(0,0,0,0.04) 62%, rgba(0,0,0,0) 72%)'
          }
      : room.id === 'stiller-innenhof' && room.visual.overlayEffect === 'stone-drips'
        ? {
            maskImage: 'radial-gradient(ellipse at 50% 82%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 24%, rgba(0,0,0,0.62) 48%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0) 82%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 82%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 24%, rgba(0,0,0,0.62) 48%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0) 82%)'
          }
      : room.id === 'leere-kirche' && room.visual.overlayEffect === 'prayer-lights'
        ? {
            maskImage: 'radial-gradient(ellipse at 50% 62%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 18%, rgba(0,0,0,0.78) 40%, rgba(0,0,0,0.44) 62%, rgba(0,0,0,0.14) 80%, rgba(0,0,0,0) 92%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 62%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 18%, rgba(0,0,0,0.78) 40%, rgba(0,0,0,0.44) 62%, rgba(0,0,0,0.14) 80%, rgba(0,0,0,0) 92%)'
          }
      : room.id === 'ufer-nebel' && room.visual.overlayEffect === 'mist'
        ? {
            maskImage: 'radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.94) 26%, rgba(0,0,0,0.7) 48%, rgba(0,0,0,0.22) 68%, rgba(0,0,0,0) 82%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.94) 26%, rgba(0,0,0,0.7) 48%, rgba(0,0,0,0.22) 68%, rgba(0,0,0,0) 82%)'
          }
      : undefined;
  const overlayWrapperStyle: React.CSSProperties =
    room.id === 'nachtzug' && room.visual.overlayEffect === 'train-lights'
      ? {
          top: '11.5%',
          left: '24.8%',
          width: '50.8%',
          height: '49.5%',
          overflow: 'hidden',
          borderRadius: '2.4rem'
        }
      : room.id === 'blaue-lagune' && room.visual.overlayEffect === 'water'
        ? {
            top: '48%',
            left: '50%',
            width: '38%',
            height: '24%',
            overflow: 'hidden'
          }
      : room.id === 'stiller-innenhof' && room.visual.overlayEffect === 'stone-drips'
        ? {
            top: '44%',
            left: '12%',
            width: '76%',
            height: '42%',
            overflow: 'hidden'
          }
      : room.id === 'leere-kirche' && room.visual.overlayEffect === 'prayer-lights'
        ? {
            top: '6%',
            left: '6%',
            width: '88%',
            height: '84%',
            overflow: 'hidden'
          }
      : room.id === 'ufer-nebel' && room.visual.overlayEffect === 'mist'
        ? {
            top: '6%',
            left: '0%',
            width: '100%',
            height: '68%',
            overflow: 'hidden'
          }
      : { inset: 0 };

  const bgStyle = hasImage
    ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat' as const,
        backgroundColor: room.colorTemperature
      }
    : {
        background: room.visual.background,
        backgroundColor: room.colorTemperature
      };

  const renderExtraVisualLayers = () => {
    switch (room.id) {
      case 'nachtzug':
        return (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,12,0.08)_0%,rgba(6,6,9,0.14)_48%,rgba(4,4,6,0.34)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_26%,rgba(255,182,118,0.18),transparent_16%),radial-gradient(circle_at_85%_26%,rgba(255,186,126,0.18),transparent_16%),radial-gradient(circle_at_50%_56%,rgba(138,168,204,0.07),transparent_26%)]" />
            <div className="absolute inset-x-[24%] top-[11%] h-[51%] bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,0.06),rgba(120,148,176,0.03)_58%,transparent_78%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[22%] bg-[linear-gradient(180deg,rgba(9,7,6,0)_0%,rgba(8,7,6,0.46)_100%)]" />
          </>
        );

      case 'ufer-nebel':
        return (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,18,26,0.12)_0%,rgba(8,14,20,0.04)_36%,rgba(6,10,14,0.26)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_16%,rgba(255,224,176,0.24),transparent_24%),radial-gradient(circle_at_22%_28%,rgba(196,210,224,0.12),transparent_32%),radial-gradient(circle_at_62%_34%,rgba(224,148,138,0.16),transparent_32%)]" />
            <div className="absolute left-[58%] top-[8%] h-[32%] w-[24%] rounded-full bg-[radial-gradient(circle,rgba(255,230,186,0.2),transparent_74%)] blur-3xl" />
            <div className="absolute inset-x-[18%] top-[20%] h-[26%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(212,134,126,0.12),transparent_72%)] blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,rgba(10,14,18,0)_0%,rgba(8,12,16,0.62)_100%)]" />
          </>
        );

      case 'stiller-innenhof':
        return (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,16,0.08)_0%,rgba(10,10,12,0.02)_32%,rgba(8,8,10,0.2)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_20%,rgba(255,225,182,0.16),transparent_28%),radial-gradient(circle_at_46%_72%,rgba(126,150,166,0.1),transparent_26%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,rgba(18,15,14,0)_0%,rgba(10,9,9,0.48)_100%)]" />
          </>
        );

      case 'leere-kirche':
        return (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,15,12,0.14)_0%,rgba(8,7,6,0.1)_38%,rgba(6,5,4,0.34)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,244,210,0.18),transparent_18%),radial-gradient(circle_at_56%_38%,rgba(244,216,158,0.1),transparent_26%),radial-gradient(circle_at_20%_76%,rgba(255,214,152,0.08),transparent_18%)]" />
            <div className="absolute left-1/2 top-[8%] -translate-x-1/2 h-[50%] w-[38%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,236,186,0.14),rgba(255,218,150,0.06)_34%,transparent_72%)] blur-2xl" />
            <div className="absolute inset-x-0 bottom-0 h-[26%] bg-[linear-gradient(180deg,rgba(12,10,8,0)_0%,rgba(7,6,5,0.62)_100%)]" />
          </>
        );

      case 'hain':
        return null;

      case 'sandstrand':
        return (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,26,35,0.08)_0%,rgba(8,22,30,0.04)_35%,rgba(7,16,22,0.18)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[16%] bg-[linear-gradient(180deg,rgba(15,21,24,0)_0%,rgba(10,14,16,0.2)_45%,rgba(7,10,12,0.42)_100%)]" />
          </>
        );

      case 'blaue-lagune':
        return (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,13,18,0.16)_0%,rgba(5,14,18,0.08)_35%,rgba(3,8,12,0.28)_100%)]" />
            <div className="absolute left-[7%] top-[18%] h-[28%] w-[16%] rounded-full bg-[radial-gradient(circle,rgba(255,176,92,0.16),transparent_72%)] blur-3xl" />
            <div className="absolute right-[7%] top-[18%] h-[26%] w-[16%] rounded-full bg-[radial-gradient(circle,rgba(255,176,92,0.14),transparent_72%)] blur-3xl" />
            <div
              className="absolute left-[9%] top-[14%] h-[34%] w-[22%] rounded-full bg-[radial-gradient(circle_at_42%_45%,rgba(255,214,140,0.28),rgba(255,146,62,0.16)_30%,rgba(78,34,12,0.04)_58%,transparent_76%)] mix-blend-screen blur-3xl animate-torch-flicker"
              style={{ animationDuration: '4.8s' }}
            />
            <div
              className="absolute right-[-3%] top-[12%] h-[34%] w-[24%] rounded-full bg-[radial-gradient(circle_at_82%_42%,rgba(255,224,168,0.28),rgba(255,154,72,0.16)_26%,rgba(92,40,16,0.05)_52%,transparent_74%)] mix-blend-screen blur-3xl animate-torch-flicker"
              style={{ animationDuration: '5.6s', animationDelay: '0.9s' }}
            />
            <div
              className="absolute inset-x-[18%] top-[6%] h-[34%] bg-[radial-gradient(ellipse_at_50%_24%,rgba(255,196,110,0.14),rgba(255,150,70,0.06)_35%,transparent_72%)] mix-blend-soft-light blur-[52px] animate-torch-flicker"
              style={{ animationDuration: '6.4s', animationDelay: '0.4s' }}
            />
            <div className="absolute inset-x-[24%] bottom-[10%] h-[18%] bg-[radial-gradient(ellipse_at_50%_40%,rgba(120,240,255,0.18),transparent_70%)] blur-2xl" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.2)_0%,transparent_18%,transparent_82%,rgba(0,0,0,0.18)_100%)]" />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={bgStyle}>
      {/* Sanfter Vignette-Verlauf für Tiefe */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,255,255,0.04),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.15)_0%,transparent_30%,transparent_65%,rgba(2,6,23,0.35)_100%)] pointer-events-none" />

      {/* Zusätzliche visuelle Ebenen */}
      {renderExtraVisualLayers()}

      {/* Canvas-basierte Lebendigkeitseffekte */}
      {room.visual.overlayEffect && (
        <div className="absolute pointer-events-none" style={overlayWrapperStyle}>
          <div className={`absolute inset-0 ${room.id === 'ufer-nebel' ? 'opacity-100' : ''}`} style={overlayCanvasStyle}>
            <CanvasOverlay effect={room.visual.overlayEffect} intensity={1} />
          </div>
        </div>
      )}
    </div>
  );
};
