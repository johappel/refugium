import fensterplatzRegen from '../assets/Fensterplatz-am-Regen.png';
import bibliothekNacht from '../assets/bibliothek-nacht.jpg';
import wintergarten from '../assets/wintergarten.jpg';

const blaueLagune = '/images/grotte-lagune.png';
const sandstrand = '/images/sandstrand.png';
const hain = '/images/hein.png';
const nebel = '/images/Nebel.png';
const brunnen = '/images/Brunnen.png';
const kirche = '/images/kirche.png';

export const ROOM_IMAGES: Record<string, string> = {
  'fensterplatz-regen': fensterplatzRegen,
  'bibliothek-nacht': bibliothekNacht,
  'wintergarten': wintergarten,
  'ufer-nebel': nebel,
  'stiller-innenhof': brunnen,
  'leere-kirche': kirche,
  'hain': hain,
  'sandstrand': sandstrand,
  'blaue-lagune': blaueLagune
};