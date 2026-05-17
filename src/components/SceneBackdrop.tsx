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
            {/* Natürliche Küsten-Atmosphäre */}
            <div className="absolute inset-0 flex flex-col pointer-events-none">
              {/* Himmel mit Sonnenuntergang-Farben */}
              <div className="h-[40%] bg-gradient-to-b from-[#1a2f3d] via-[#2d4a5a] to-[#3d5f70]" />
              
              {/* Meer mit mehr Tiefe und Glanz */}
              <div className="h-[38%] bg-gradient-to-b from-[#1e3a47] via-[#264a58] to-[#2a5566] relative overflow-hidden">
                {/* Sonnenreflexion auf dem Wasser */}
                <div className="absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_0%,rgba(253,200,120,0.12),transparent_60%)]" />
                {/* Horizont-Linie */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.15)] to-transparent" />
                {/* Wasser-Glanz */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]" />
              </div>
              
              {/* Feuchter Sand mit Schärfentiefe */}
              <div className="h-[22%] bg-gradient-to-b from-[#2a4049] via-[#1f323a] to-[#151f24] relative">
                {/* Feuchtigkeitsschimmer */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[rgba(100,130,150,0.15)] to-transparent" />
                {/* Sand-Textur */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
              </div>
            </div>

            {/* Dünen-Silhouette im Hintergrund */}
            <div className="absolute bottom-[22%] left-0 right-0 h-24 pointer-events-none opacity-30">
              <svg className="w-full h-full" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0 100H1440V60C1320 80 1200 40 1080 55C960 70 840 30 720 45C600 60 480 25 360 40C240 55 120 20 0 35V100Z" fill="#0d181c" />
              </svg>
            </div>
          </>
        );

      case 'unterwasserstation':
        return (
          <>
            {/* Authentischer Tiefsee-Blau-Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#0c3d4a_0%,#062229_40%,#020f13_100%)]" />

            {/* Tiefsee-Lichteinfall von oben — realistischer */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_5%,rgba(100,200,255,0.25),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(150,220,255,0.1),transparent_40%)]" />

            {/* Mechanischer Stahlrahmen mit tiefen Schatten */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
              {/* Äußerer weicher Schatten für 3D-Effekt */}
              <div className="absolute w-[90vh] h-[90vh] rounded-full shadow-[0_0_180px_rgba(0,5,15,0.98),inset_0_0_120px_rgba(0,0,0,0.95)] pointer-events-none" />

              {/* Massiver Stahlrahmen (außen) */}
              <div className="w-[88vh] h-[88vh] rounded-full bg-gradient-to-br from-[#1a2630] via-[#0a1218] to-[#02060a] shadow-[0_0_60px_rgba(0,0,0,0.95)] flex items-center justify-center relative">
                {/* Innerer Rahmen-Ring mit Tiefe */}
                <div className="w-[82vh] h-[82vh] rounded-full bg-[#020608] shadow-[inset_0_0_50px_rgba(0,0,0,0.95)] flex items-center justify-center relative overflow-hidden">

                  {/* Glas-Ebene mit feinen Reflexionen */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-cyan-200/[0.04] to-cyan-100/[0.08]" />
                  <div className="absolute inset-2 rounded-full bg-gradient-to-bl from-white/[0.04] via-transparent to-transparent" />

                  {/* Tiefe Vignette im Glas */}
                  <div className="absolute inset-4 rounded-full shadow-[inset_0_0_100px_rgba(0,5,15,0.7)]" />
                </div>
              </div>

              {/* 8 mechanische Schraubbolzen */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                return (
                  <div
                    key={i}
                    className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-[#26343e] via-[#101a22] to-[#020608] border border-[#000] shadow-[0_2px_6px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(255,255,255,0.06)]"
                    style={{
                      left: `calc(50% + ${Math.sin(angle)} * (42.5vh) - 14px)`,
                      top: `calc(50% - ${Math.cos(angle)} * (42.5vh) - 14px)`
                    }}
                  >
                    {/* Innerer Schraubenkopf */}
                    <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-[#2e3f4a] to-[#0a1318]">
                      {/* Sechskant-Andeutung */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-[2px] bg-[#000]/70 rounded-full" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtiles Außenlicht */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_70%,rgba(100,200,255,0.1),transparent_50%)] pointer-events-none" />
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
        <CanvasOverlay effect={room.visual.overlayEffect} intensity={1} />
      )}
    </div>
  );
};
