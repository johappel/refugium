import React, { useState } from 'react';
import { X, BookOpen, Layers, Database, Cpu, Package, Sparkles } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'arch' | 'files' | 'model' | 'pwa' | 'packages' | 'ai'>('arch');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none font-sans">
      <div className="relative w-full max-w-5xl bg-[#0B0F17] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
        
        {/* Linke Seitenleiste: Navigation durch die geforderten Themenbereiche */}
        <div className="w-full md:w-72 bg-[#0F172A] border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] tracking-[0.3em] text-amber-400 uppercase font-light">Konzept & Spezifikation</span>
                <h2 className="text-xl font-light tracking-wide text-gray-100 font-cinzel mt-1">Refugium</h2>
              </div>
              <button onClick={onClose} className="md:hidden p-1 text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('arch')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs tracking-wider transition-all ${
                  activeTab === 'arch' ? 'bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20' : 'text-gray-400 hover:bg-slate-800/50 hover:text-gray-200 font-light'
                }`}
              >
                <BookOpen size={16} />
                <span className="uppercase">1. Architekturvorschlag</span>
              </button>

              <button
                onClick={() => setActiveTab('files')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs tracking-wider transition-all ${
                  activeTab === 'files' ? 'bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20' : 'text-gray-400 hover:bg-slate-800/50 hover:text-gray-200 font-light'
                }`}
              >
                <Layers size={16} />
                <span className="uppercase">2. Dateistruktur</span>
              </button>

              <button
                onClick={() => setActiveTab('model')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs tracking-wider transition-all ${
                  activeTab === 'model' ? 'bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20' : 'text-gray-400 hover:bg-slate-800/50 hover:text-gray-200 font-light'
                }`}
              >
                <Database size={16} />
                <span className="uppercase">3. Datenmodell</span>
              </button>

              <button
                onClick={() => setActiveTab('pwa')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs tracking-wider transition-all ${
                  activeTab === 'pwa' ? 'bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20' : 'text-gray-400 hover:bg-slate-800/50 hover:text-gray-200 font-light'
                }`}
              >
                <Cpu size={16} />
                <span className="uppercase">4. PWA & Service Worker</span>
              </button>

              <button
                onClick={() => setActiveTab('packages')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs tracking-wider transition-all ${
                  activeTab === 'packages' ? 'bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20' : 'text-gray-400 hover:bg-slate-800/50 hover:text-gray-200 font-light'
                }`}
              >
                <Package size={16} />
                <span className="uppercase">6. Raum-Pakete</span>
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs tracking-wider transition-all ${
                  activeTab === 'ai' ? 'bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20' : 'text-gray-400 hover:bg-slate-800/50 hover:text-gray-200 font-light'
                }`}
              >
                <Sparkles size={16} />
                <span className="uppercase">7. KI-Asset Hinweise</span>
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-800 hidden md:block">
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-2xl text-xs tracking-widest uppercase transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>

        {/* Rechter Inhaltsbereich */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto text-gray-300 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 md:hidden">
            <h3 className="text-sm font-cinzel text-amber-300 uppercase tracking-wider">
              {activeTab === 'arch' && '1. Architekturvorschlag'}
              {activeTab === 'files' && '2. Dateistruktur'}
              {activeTab === 'model' && '3. Datenmodell'}
              {activeTab === 'pwa' && '4. PWA & Service Worker'}
              {activeTab === 'packages' && '6. Raum-Pakete'}
              {activeTab === 'ai' && '7. KI-Asset Hinweise'}
            </h3>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {activeTab === 'arch' && (
            <div className="space-y-6 leading-relaxed font-light">
              <h3 className="text-2xl font-light font-cinzel text-gray-100">1. Architekturvorschlag</h3>
              <p className="font-spectral italic text-gray-400 text-lg">
                Eine kontemplative, autarke und dezentrale Architektur für digitale Entschleunigung.
              </p>
              
              <div className="space-y-4 text-sm">
                <h4 className="font-medium text-amber-300 uppercase tracking-wider text-xs">Leitprinzipien & Entwurfsmuster</h4>
                <p>
                  <strong>1. Autarkie & Local-First:</strong> Refugium verzichtet bewusst auf serverseitige Abhängigkeiten, Benutzerkonten und Tracking. Die Applikation wird als Progressive Web App (PWA) auf dem Endgerät installiert. Alle Kernressourcen und Ambient-Synthese-Engines werden per Service Worker im CacheStorage vorgehalten.
                </p>
                <p>
                  <strong>2. Prozedurale Klangsynthese (Web Audio API):</strong> Um den Speicherbedarf auf ein Minimum zu reduzieren und dennoch unendliche, nicht-repetitive Klanglandschaften zu bieten, setzt die Architektur auf prozedurale Rausch- und Oszillatorsynthese. Regen, Wind, Bibliotheksknistern und Sphärenklänge werden in Echtzeit berechnet.
                </p>
                <p>
                  <strong>3. Zustand & Flüchtigkeit:</strong> Der Architekturansatz trennt strikt zwischen persistentem Zustand (zuletzt besuchter Raum via localStorage/IndexedDB) und flüchtigem Zustand (Gedanken in der Ablage-Geste). Abgelegte Texte existieren ausschließlich im flüchtigen RAM der React-Komponente, werden in Partikel-Koordinaten umgewandelt und bei Animationsende vom Garbage Collector gelöscht.
                </p>
                <p>
                  <strong>4. Schwellenrituale als Entkopplungsschicht:</strong> Die Navigation erfolgt asynchron über eine 6–14 Sekunden dauernde Ritual-Schicht. Diese visuelle und auditive Übergangsphase blockiert weitere User-Events, erzwingt Verweilen und gibt dem Browser Zeit für sanftes Audio-Crossfading und Asset-Vorbereitung.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6 leading-relaxed font-light">
              <h3 className="text-2xl font-light font-cinzel text-gray-100">2. Dateistruktur</h3>
              <p className="font-spectral italic text-gray-400 text-lg">
                Modularer Aufbau nach Clean-Code-Prinzipien für React & PWA.
              </p>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
                <div>├── public/</div>
                <div>│   ├── manifest.webmanifest    <span className="text-slate-500">// PWA-Konfiguration & App-Icons</span></div>
                <div>│   └── sw.js                   <span className="text-slate-500">// Service Worker (Cache-First & Dynamik)</span></div>
                <div>├── src/</div>
                <div>│   ├── components/</div>
                <div>│   │   ├── AblageGeste.tsx     <span className="text-slate-500">// Partikel-Auflösung flüchtiger Gedanken</span></div>
                <div>│   │   ├── ArchitectureModal.tsx <span className="text-slate-500">// Spezifikation & Dokumentation</span></div>
                <div>│   │   ├── PackageInstaller.tsx <span className="text-slate-500">// Unaufdringliche Raumpaket-Verwaltung</span></div>
                <div>│   │   ├── RoomView.tsx        <span className="text-slate-500">// Hauptansicht, Click-Areas, Mikroereignisse</span></div>
                <div>│   │   ├── TransitionOverlay.tsx <span className="text-slate-500">// Schwellenrituale (6-14 Sekunden)</span></div>
                <div>│   │   └── WelcomeScreen.tsx   <span className="text-slate-500">// Onboarding & Web Audio Autoplay-Geste</span></div>
                <div>│   ├── data/</div>
                <div>│   │   └── rooms.ts            <span className="text-slate-500">// Definition der 7 Startorte & 2 Beispielpakete</span></div>
                <div>│   ├── services/</div>
                <div>│   │   ├── audioService.ts     <span className="text-slate-500">// Web Audio Synthesizer & Crossfader</span></div>
                <div>│   │   └── packageService.ts   <span className="text-slate-500">// Background Downloader für Erweiterungen</span></div>
                <div>│   ├── types/</div>
                <div>│   │   └── refugium.ts         <span className="text-slate-500">// TypeScript-Spezifikation des Datenmodells</span></div>
                <div>│   ├── App.tsx                 <span className="text-slate-500">// Orchestrierung & Persistenz des Raums</span></div>
                <div>│   ├── index.css               <span className="text-slate-500">// Tailwind CSS & Keyframe-Animationen</span></div>
                <div>│   └── main.tsx                <span className="text-slate-500">// React-Root</span></div>
                <div>└── index.html                  <span className="text-slate-500">// Einstiegspunkt & SW-Registrierung</span></div>
              </div>
            </div>
          )}

          {activeTab === 'model' && (
            <div className="space-y-6 leading-relaxed font-light">
              <h3 className="text-2xl font-light font-cinzel text-gray-100">3. Datenmodell für Räume</h3>
              <p className="font-spectral italic text-gray-400 text-lg">
                Vollständige Typdefinition der kontemplativen Orte und Übergänge.
              </p>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-300 overflow-x-auto space-y-4">
                <pre className="text-amber-300/90">{`interface Room {
  id: string;
  name: string;
  emotionalWord: string;
  thought: string;
  visual: {
    type: 'css-ambient' | 'image' | 'video';
    background: string;
    overlayEffect?: 'rain' | 'dust' | 'stars' | 'fog' | 'leaves' | 'water';
  };
  audio: AmbientAudioConfig;
  singleSounds?: SingleSoundConfig[];
  clickAreas: ClickArea[];
  transitionType: TransitionType;
  movementIntensity: 'sehr_gering' | 'gering' | 'moderat';
  colorTemperature: string;
  hasAblageGeste?: boolean;
  isCustomPackage?: boolean;
  packageVersion?: string;
}`}</pre>

                <pre className="text-slate-400">{`interface ClickArea {
  id: string;
  targetRoomId: string;
  x: number; // Prozent 0-100
  y: number; // Prozent 0-100
  width: number;
  height: number;
  label?: string;
}`}</pre>

                <pre className="text-slate-400">{`type TransitionType = 
  | 'nebel' | 'tuer' | 'vorhang' 
  | 'wasserreflexion' | 'detailzoom' | 'dunkelheit';`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-6 leading-relaxed font-light">
              <h3 className="text-2xl font-light font-cinzel text-gray-100">4. PWA, Service Worker & Raumwechsel</h3>
              <p className="font-spectral italic text-gray-400 text-lg">
                Auszug der asynchronen Kernlogik für Offline-Betrieb und Schwellenrituale.
              </p>

              <div className="space-y-4 text-sm">
                <h4 className="font-medium text-amber-300 uppercase tracking-wider text-xs">Service Worker Cache-First Strategie</h4>
                <p>
                  Der Service Worker fängt alle `fetch`-Ereignisse ab. Statische Assets werden bei der Installation im Cache `refugium-core-v1` abgelegt. Bei Netzwerkanfragen wird zuerst der Cache geprüft (`caches.match`). Ist die Ressource vorhanden, wird sie ohne Netzwerklatenz ausgeliefert.
                </p>

                <h4 className="font-medium text-amber-300 uppercase tracking-wider text-xs mt-6">Raumwechsel-Orchestrierung (App.tsx)</h4>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-300 overflow-x-auto">
                  <pre>{`const handleNavigate = (targetRoomId: string, area: ClickArea) => {
  const next = allRooms.find((r) => r.id === targetRoomId);
  if (!next) return;

  // 1. Starte Audio-Fadeout des aktuellen Raums
  audioService.fadeOutAmbient(3);

  // 2. Aktiviere Transition Overlay (Schwellenritual)
  setPendingRoom(next);
  setActiveTransition({
    type: next.transitionType,
    targetRoomName: next.name,
    emotionalWord: next.emotionalWord,
  });

  // 3. Nach Ablauf des 9s Rituals: Setze neuen Raum & starte Audio
  // (Wird über onComplete Callback im TransitionOverlay ausgelöst)
};`}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="space-y-6 leading-relaxed font-light">
              <h3 className="text-2xl font-light font-cinzel text-gray-100">6. Mechanismus für optionale Raum-Pakete</h3>
              <p className="font-spectral italic text-gray-400 text-lg">
                Hintergrund-Synchronisation ohne störende UI-Hinweise.
              </p>

              <div className="space-y-4 text-sm">
                <p>
                  Um dem Prinzip <em>„ohne Update-Button und ohne störende Hinweise“</em> gerecht zu werden, nutzt Refugium eine entkoppelte Paket-Architektur:
                </p>

                <ul className="list-disc list-inside space-y-3 text-slate-300 ml-2">
                  <li>
                    <strong className="text-white">Manifest & Asset-Bündel:</strong> Jedes Raumpaket besitzt eine Version und eine Liste von Asset-URLs (z.B. Hintergrundgrafiken, spezifische Klangbausteine).
                  </li>
                  <li>
                    <strong className="text-white">Silent Background Fetching:</strong> Bei aktiver Internetverbindung prüft ein Hintergrund-Prozess (`packageService`) auf neue Raum-Manifeste.
                  </li>
                  <li>
                    <strong className="text-white">Service Worker Caching:</strong> Über die `postMessage`-API wird der Service Worker angewiesen, die Paket-Assets in einen separaten Cache (`refugium-packages-v1`) zu legen.
                  </li>
                  <li>
                    <strong className="text-white">Nahtlose Integration:</strong> Sobald der Download abgeschlossen ist, wird die Raumdefinition in `localStorage` registriert. Die unsichtbaren Click-Areas in bestehenden Räumen (z.B. im `stiller-innenhof` oder `wintergarten`) werden automatisch freigeschaltet. Der Nutzer entdeckt den neuen Ort rein intuitiv beim Verweilen.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6 leading-relaxed font-light">
              <h3 className="text-2xl font-light font-cinzel text-gray-100">7. Hinweise zur Asset-Erstellung mit KI</h3>
              <p className="font-spectral italic text-gray-400 text-lg">
                Prompt-Strategien für kontemplative, organische und unaufdringliche Raumwelten.
              </p>

              <div className="space-y-4 text-sm">
                <p>
                  Die Erstellung von visuellen und auditiven Assets für „Refugium“ erfordert ein Höchstmaß an Subtilität. Grelle Farben, harte Kontraste oder fotorealistische Hektik zerstören das Gefühl der Zuflucht.
                </p>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h4 className="font-medium text-amber-300 uppercase tracking-wider text-xs">Visuelle KI-Prompts (Midjourney / DALL-E 3 / Stable Diffusion)</h4>
                  <p className="font-mono text-xs text-slate-300 italic">
                    "A contemplative, atmospheric sanctuary, [e.g. window seat in dark rain / quiet night library], soft muted colors, low key lighting, chiaroscuro, hazy mist, no sharp edges, tranquil, soothing, digital matte painting, 8k resolution, extreme subtle grain, masterpiece, peaceful silence --ar 16:9 --stylize 200"
                  </p>

                  <h4 className="font-medium text-amber-300 uppercase tracking-wider text-xs pt-4 border-t border-slate-800/80">Audio-KI & Synthese-Hinweise (Stable Audio / Suno / Web Audio)</h4>
                  <p className="text-xs text-slate-300">
                    Für Hintergrundrauschen (Regen, Wind) sollte auf KI-generierte Loops verzichtet werden, wenn diese hörbare Nahtstellen aufweisen. Stattdessen empfiehlt sich die Nutzung von prozeduralem Rauschen (Brownian/Pink Noise) kombiniert mit dezenten, KI-generierten Einzelklängen (z.B. tibetische Klangschale, sanftes Umblättern), die im Abstand von 20–60 Sekunden zufällig eingestreut werden.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};