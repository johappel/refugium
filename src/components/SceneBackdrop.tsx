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
      : room.id === 'blaue-lagune' && room.visual.overlayEffect === 'water'
        ? {
            maskImage: 'radial-gradient(ellipse at 18% 42%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 18%, rgba(0,0,0,0.78) 34%, rgba(0,0,0,0.26) 50%, rgba(0,0,0,0.04) 62%, rgba(0,0,0,0) 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 18% 42%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 18%, rgba(0,0,0,0.78) 34%, rgba(0,0,0,0.26) 50%, rgba(0,0,0,0.04) 62%, rgba(0,0,0,0) 72%)'
          }
      : undefined;
  const overlayWrapperStyle: React.CSSProperties =
    room.id === 'nachtzug' && room.visual.overlayEffect === 'train-lights'
      ? {
          top: '14%',
          left: '32%',
          width: '58%',
          height: '46%',
          overflow: 'hidden',
          borderRadius: '1.8rem'
        }
      : room.id === 'blaue-lagune' && room.visual.overlayEffect === 'water'
        ? {
            top: '48%',
            left: '50%',
            width: '38%',
            height: '24%',
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
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#16171d_0%,#0e1016_48%,#07080c_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_82%,rgba(180,120,76,0.18),transparent_24%),radial-gradient(circle_at_34%_68%,rgba(125,84,48,0.1),transparent_20%)]" />
            <div className="absolute left-[4%] bottom-[8%] h-[34%] w-[30%] rounded-[3rem_3rem_0_0] bg-gradient-to-tr from-[#2a1c16] via-[#5b3c2f] to-[#241813] shadow-[0_-10px_50px_rgba(0,0,0,0.55)] opacity-95" />
            <div className="absolute left-[7%] bottom-[18%] h-[12%] w-[17%] rounded-full bg-[radial-gradient(circle,rgba(255,202,132,0.22),transparent_72%)] blur-2xl" />
            <div className="absolute right-[10%] top-[14%] h-[46%] w-[58%] overflow-hidden rounded-[1.8rem] border-[10px] border-[#2e2019]/90 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_70px_rgba(0,0,0,0.55)]">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,#21303f_0%,#121923_42%,#090d13_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(255,238,205,0.08),transparent_20%),radial-gradient(circle_at_28%_38%,rgba(117,150,180,0.1),transparent_32%)]" />
              <div className="absolute inset-y-0 left-[48%] w-[10px] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#3a2922]/90 to-transparent" />
              <div className="absolute inset-x-0 top-[54%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <svg className="absolute inset-x-0 bottom-[18%] h-[30%] w-full opacity-45" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0 200H800V120C720 126 654 98 584 110C520 121 448 151 378 141C307 131 237 97 164 105C97 113 47 142 0 132V200Z" fill="#0d1218" />
              </svg>
              <svg className="absolute inset-x-0 bottom-0 h-[26%] w-full opacity-55" viewBox="0 0 800 160" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0 160H800V132L766 86L734 132L708 78L676 132L640 74L600 132L564 70L532 132L494 82L456 132L418 74L382 132L340 80L306 132L264 72L226 132L186 76L146 132L106 78L70 132L36 90L0 132V160Z" fill="#070b10" />
              </svg>
              <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[linear-gradient(180deg,rgba(9,13,18,0)_0%,rgba(8,10,14,0.62)_45%,rgba(5,7,10,0.95)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_0%,transparent_16%,transparent_84%,rgba(255,255,255,0.03)_100%)]" />
            </div>
            <div className="absolute right-[10%] top-[14%] h-[46%] w-[58%] rounded-[1.8rem] border border-white/5 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(180deg,rgba(11,8,7,0)_0%,rgba(11,8,7,0.82)_100%)]" />
          </>
        );

      case 'ufer-nebel':
        return (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(224,232,236,0.1),transparent_24%),linear-gradient(180deg,#4a5962_0%,#364149_38%,#182129_100%)]" />
            <div className="absolute inset-x-0 top-[44%] h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            <div className="absolute inset-x-[28%] top-[38%] h-[18%] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_55%,rgba(12,18,22,0.55),rgba(12,18,22,0.1)_60%,transparent_75%)] blur-xl opacity-80" />
            <div className="absolute inset-x-0 bottom-0 h-[36%] bg-[linear-gradient(180deg,rgba(24,38,46,0.08)_0%,rgba(12,20,26,0.55)_45%,rgba(7,11,15,0.92)_100%)]" />
            <div className="absolute inset-x-0 bottom-[20%] h-[10%] bg-[radial-gradient(ellipse_at_50%_20%,rgba(150,170,180,0.12),transparent_65%)]" />
            <svg className="absolute left-0 bottom-[16%] h-[30%] w-[22%] opacity-40" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M16 260C26 212 40 176 50 132C60 88 68 32 76 0" stroke="#1f2d31" strokeWidth="3" />
              <path d="M46 260C56 214 74 172 94 130C108 100 128 52 144 12" stroke="#24363a" strokeWidth="2.5" />
              <path d="M72 260C80 226 96 182 118 144C138 110 164 68 186 26" stroke="#2b4045" strokeWidth="2" />
            </svg>
            <svg className="absolute right-0 bottom-[14%] h-[28%] w-[22%] opacity-38" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M204 260C194 212 180 176 170 132C160 88 152 32 144 0" stroke="#1f2d31" strokeWidth="3" />
              <path d="M174 260C164 214 146 172 126 130C112 100 92 52 76 12" stroke="#24363a" strokeWidth="2.5" />
              <path d="M148 260C140 226 124 182 102 144C82 110 56 68 34 26" stroke="#2b4045" strokeWidth="2" />
            </svg>
          </>
        );

      case 'stiller-innenhof':
        return (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(231,210,176,0.12),transparent_24%),linear-gradient(180deg,#35322f_0%,#1e1b19_42%,#0c0b0a_100%)]" />
            <div className="absolute inset-x-[10%] top-[10%] h-[26%] rounded-b-[3rem] border border-stone-300/10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,224,180,0.08),transparent_70%)] opacity-60" />
            <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 w-[34%] h-[24%]">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[42%] h-[28%] rounded-t-[999px] bg-gradient-to-b from-[#6e6a65] to-[#38332f] shadow-[0_8px_20px_rgba(0,0,0,0.35)]" />
              <div className="absolute inset-x-[6%] bottom-[10%] h-[46%] rounded-full bg-gradient-to-b from-[#5e5953] to-[#2c2926] shadow-[0_20px_40px_rgba(0,0,0,0.45)]" />
              <div className="absolute inset-x-[18%] bottom-[22%] h-[20%] rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(115,155,172,0.45),rgba(11,19,24,0.9)_72%)]" />
              <div className="absolute left-1/2 bottom-0 -translate-x-1/2 h-[30%] w-[52%] rounded-full bg-black/35 blur-2xl" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,rgba(28,24,22,0)_0%,rgba(16,14,13,0.82)_100%)]" />
          </>
        );

      case 'leere-kirche':
        return (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(245,216,156,0.16),transparent_18%),linear-gradient(180deg,#2c261f_0%,#171311_44%,#090706_100%)]" />
            <div className="absolute left-1/2 top-[8%] -translate-x-1/2 h-[38%] w-[22%] rounded-b-[4rem] bg-[radial-gradient(circle_at_50%_20%,rgba(255,226,170,0.42),rgba(186,146,95,0.12)_42%,transparent_72%)] blur-sm" />
            <div className="absolute left-1/2 top-[10%] -translate-x-1/2 h-[30%] w-[18%] rounded-b-[3rem] border border-amber-100/10 bg-[linear-gradient(180deg,rgba(255,230,180,0.22),rgba(160,120,80,0.06))]" />
            <div className="absolute inset-x-0 bottom-[18%] h-[22%] bg-[linear-gradient(180deg,rgba(20,15,13,0)_0%,rgba(12,10,9,0.86)_100%)]" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="absolute bottom-[14%] rounded-t-2xl bg-gradient-to-b from-[#2e221a] to-[#130f0d] opacity-85"
                style={{
                  left: `${12 + index * 17}%`,
                  width: `${8 + Math.abs(2 - index) * 1.8}%`,
                  height: `${10 + (4 - Math.abs(2 - index)) * 2}%`
                }}
              />
            ))}
            <div className="absolute left-1/2 bottom-[16%] -translate-x-1/2 h-[18%] w-[12%] rounded-t-3xl bg-gradient-to-b from-[#2c2018] to-[#120d0a]" />
            <div className="absolute left-1/2 bottom-[31%] -translate-x-1/2 h-[10%] w-[2px] bg-amber-100/45" />
            <div className="absolute left-[48%] bottom-[24%] h-6 w-6 rounded-full bg-amber-100/18 blur-lg" />
            <div className="absolute left-[52%] bottom-[24%] h-6 w-6 rounded-full bg-amber-100/15 blur-lg" />
          </>
        );

      case 'hain':
        return (
          <>
            {/* Natürlicher Sonnenlicht-Glow von oben-links */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_10%,rgba(253,224,71,0.28),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_25%,rgba(255,237,120,0.15),transparent_45%)]" />
            
            {/* Mehrschichtiger Blätter-Baldachin für organische Tiefe */}
            <div className="absolute inset-x-0 top-0 h-2/5 pointer-events-none">
              {/* Hintere Blätterschicht - dunkler, langsamer */}
              <svg className="absolute inset-0 w-full h-full opacity-60 mix-blend-multiply" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path className="animate-pulse" style={{ animationDuration: '12s' }} d="M0 0H1440V220C1300 200 1240 280 1120 260C1000 240 920 180 800 200C680 220 600 300 480 280C360 260 280 160 160 180C40 200 0 120 0 100V0Z" fill="#0f1908" />
              </svg>
              {/* Mittlere Blätterschicht */}
              <svg className="absolute inset-0 w-full h-full opacity-50 mix-blend-multiply" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path className="animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} d="M0 0H1440V180C1360 160 1320 220 1220 200C1120 180 1040 140 940 160C840 180 780 240 680 220C580 200 500 120 400 140C300 160 240 100 140 120C40 140 0 80 0 60V0Z" fill="#1a2e0f" />
              </svg>
              {/* Vordere Blätterschicht - detailreicher */}
              <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path className="animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} d="M-20 0H1460V140C1400 120 1360 170 1280 150C1200 130 1140 90 1060 110C980 130 920 180 840 160C760 140 700 80 620 100C540 120 480 60 400 80C320 100 260 50 180 70C100 90 40 40 -20 60V0Z" fill="#243d15" />
              </svg>
            </div>

            {/* Seitliche Blätter-Rahmen für immersive Tiefe */}
            <div className="absolute left-0 inset-y-0 w-48 pointer-events-none opacity-35">
              <svg className="h-full w-full" viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path className="animate-pulse" style={{ animationDuration: '10s' }} d="M0 0V800C50 750 100 680 70 590C40 500 120 430 90 320C60 210 130 140 80 60C50 20 0 0 0 0Z" fill="#14200a" />
              </svg>
            </div>
            <div className="absolute right-0 inset-y-0 w-48 pointer-events-none opacity-35">
              <svg className="h-full w-full" viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path className="animate-pulse" style={{ animationDuration: '11s', animationDelay: '0.5s' }} d="M200 0V800C150 750 100 680 130 590C160 500 80 430 110 320C140 210 70 140 120 60C150 20 200 0 200 0Z" fill="#14200a" />
              </svg>
            </div>

            {/* Bodenvegetation im Vordergrund */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none">
              <svg className="w-full h-full opacity-50" viewBox="0 0 1440 300" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0 300H1440V200C1380 220 1320 180 1260 200C1200 220 1140 250 1080 230C1020 210 960 170 900 190C840 210 780 260 720 240C660 220 600 160 540 180C480 200 420 240 360 220C300 200 240 150 180 170C120 190 60 220 0 200V300Z" fill="#0d1407" />
              </svg>
            </div>
          </>
        );

      case 'sandstrand':
        return (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#243c4b_0%,#395d6d_34%,#517787_44%,#2b5566_45%,#24495b_62%,#172e39_100%)]" />
            <div className="absolute inset-x-0 top-[44%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div className="absolute inset-x-0 top-[45%] h-[26%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,214,150,0.16),transparent_55%),linear-gradient(180deg,rgba(30,64,78,0.2),rgba(21,45,57,0.72))]" />
            <div className="absolute inset-x-0 bottom-0 h-[29%] bg-gradient-to-b from-[#2b4450] via-[#203641] to-[#131f27]" />
            <div className="absolute inset-x-[18%] bottom-[22%] h-[10%] rounded-full bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,214,160,0.14),transparent_68%)] blur-xl" />
            <div className="absolute bottom-[24%] left-0 right-0 h-24 pointer-events-none opacity-25">
              <svg className="w-full h-full" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0 100H1440V60C1320 80 1200 40 1080 55C960 70 840 30 720 45C600 60 480 25 360 40C240 55 120 20 0 35V100Z" fill="#0d181c" />
              </svg>
            </div>
          </>
        );

      case 'blaue-lagune':
        return (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,13,18,0.16)_0%,rgba(5,14,18,0.08)_35%,rgba(3,8,12,0.28)_100%)]" />
            <div className="absolute left-[7%] top-[18%] h-[28%] w-[16%] rounded-full bg-[radial-gradient(circle,rgba(255,176,92,0.16),transparent_72%)] blur-3xl" />
            <div className="absolute right-[7%] top-[18%] h-[26%] w-[16%] rounded-full bg-[radial-gradient(circle,rgba(255,176,92,0.14),transparent_72%)] blur-3xl" />
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
          <div className="absolute inset-0" style={overlayCanvasStyle}>
            <CanvasOverlay effect={room.visual.overlayEffect} intensity={1} />
          </div>
        </div>
      )}
    </div>
  );
};
