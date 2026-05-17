export type TransitionType = 
  | 'nebel'             // Nebel legt sich über den Screen und öffnet eine neue Szene
  | 'tuer'              // Eine Tür oder ein Lichtspalt öffnet sich
  | 'vorhang'           // Vorhang/Stoff bewegt sich über das Bild
  | 'wasserreflexion'   // Wasserreflexion verwandelt die Szene
  | 'detailzoom'        // Kamera nähert sich einem Detail, das zur neuen Welt wird
  | 'dunkelheit';       // Dunkelheit sammelt sich um eine Lichtquelle

export interface ClickArea {
  id: string;
  targetRoomId: string;
  x: number; // Prozentangabe 0-100
  y: number; // Prozentangabe 0-100
  width: number; // Prozentangabe 0-100
  height: number; // Prozentangabe 0-100
  label?: string; // Subtiler Hinweis für Screenreader oder sanfte Entdeckung
}

export interface AmbientAudioConfig {
  type: 'rain' | 'library' | 'archive' | 'wind' | 'train' | 'space' | 'observatory' | 'water' | 'courtyard' | 'shoreline' | 'lagoon' | 'silence' | 'forest' | 'ocean' | 'submarine' | 'cathedral' | 'teahouse' | 'hearth';
  baseFrequency?: number;
  modulationSpeed?: number;
  volume: number; // 0.0 bis 1.0
}

export interface SingleSoundConfig {
  name: string;
  frequency: number;
  type: 'sine' | 'triangle' | 'bell' | 'chime' | 'thunder' | 'drip';
  intervalMin: number; // in Sekunden
  intervalMax: number;
}

export interface Room {
  id: string;
  name: string;
  emotionalWord: string;
  thought: string;
  visual: {
    type: 'css-ambient' | 'image' | 'video';
    background: string; // CSS Gradient, Image URL oder Video URL
    overlayEffect?: 'rain' | 'dust' | 'stars' | 'fog' | 'leaves' | 'water' | 'fire' | 'train-lights' | 'rays' | 'waves' | 'underwater';
  };
  audio: AmbientAudioConfig;
  singleSounds?: SingleSoundConfig[];
  clickAreas: ClickArea[];
  transitionType: TransitionType;
  movementIntensity: 'sehr_gering' | 'gering' | 'moderat';
  colorTemperature: string; // z.B. "#1E293B", "#0F172A", "#18181B"
  hasAblageGeste?: boolean;
  isCustomPackage?: boolean;
  packageVersion?: string;
}

export interface RoomPackage {
  id: string;
  name: string;
  description: string;
  version: string;
  sizeKb: number;
  roomData: Room;
  assets: string[];
}