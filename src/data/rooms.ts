import { Room, RoomPackage } from '../types/refugium';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'fensterplatz-regen',
    name: 'Fensterplatz im Regen',
    emotionalWord: 'Geborgenheit',
    thought: 'Tropfen zeichnen flüchtige Wege auf das Glas. Nichts drängt. Die Welt da draußen wäscht sich rein.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 60%, #020617 100%)',
      overlayEffect: 'rain'
    },
    audio: { type: 'rain', volume: 0.24 },
    singleSounds: [
      { name: 'Distant Thunder', frequency: 110, type: 'thunder', intervalMin: 80, intervalMax: 160 }
    ],
    clickAreas: [
      { id: 'ca-regen-1', targetRoomId: 'bibliothek-nacht', x: 70, y: 30, width: 25, height: 40, label: 'Ein warmer Lichtschein im Flur' },
      { id: 'ca-regen-2', targetRoomId: 'wintergarten', x: 10, y: 50, width: 20, height: 35, label: 'Beschlagene Glastür zum Grün' }
    ],
    transitionType: 'wasserreflexion',
    movementIntensity: 'gering',
    colorTemperature: '#0F172A',
    hasAblageGeste: true
  },
  {
    id: 'bibliothek-nacht',
    name: 'Bibliothek bei Nacht',
    emotionalWord: 'Stille',
    thought: 'Draußen darf der Tag weiterfordern. Zwischen Holz, Papier und gedimmtem Licht fällt alles langsam von dir ab. Hier hat jede Frage Zeit, und nichts drängt auf Antwort.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 30% 40%, #291e1e 0%, #1a1010 60%, #0a0505 100%)',
      overlayEffect: 'dust'
    },
    audio: { type: 'archive', volume: 0.28 },
    singleSounds: [
      { name: 'Glass Resonance', frequency: 392, type: 'bell', intervalMin: 70, intervalMax: 130 }
    ],
    clickAreas: [
      { id: 'ca-bib-1', targetRoomId: 'fensterplatz-regen', x: 5, y: 20, width: 20, height: 60, label: 'Das leise Prasseln am Fenster' },
      { id: 'ca-bib-2', targetRoomId: 'sternwarte', x: 75, y: 15, width: 20, height: 50, label: 'Eine Wendeltreppe nach oben' },
      { id: 'ca-bib-3', targetRoomId: 'stiller-innenhof', x: 34, y: 70, width: 18, height: 24, label: 'Schwere Holztür zum Hof' },
      { id: 'ca-bib-4', targetRoomId: 'leere-kirche', x: 54, y: 18, width: 16, height: 40, label: 'Ein schmaler Seitengang in die leere Kirche' }
    ],
    transitionType: 'tuer',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#1E110A',
    hasAblageGeste: false
  },
  {
    id: 'wintergarten',
    name: 'Wintergarten',
    emotionalWord: 'Behutsamkeit',
    thought: 'Große Blätter atmen im Halbdunkel. Feuchte Erde und beschlagene Scheiben halten die Welt auf Abstand. Hier wächst nur, was Zeit, Wärme und Ruhe braucht.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 60% 50%, #11251d 0%, #08140e 65%, #020604 100%)',
      overlayEffect: 'leaves'
    },
    audio: { type: 'wind', volume: 0.3 },
    singleSounds: [
      { name: 'Wintergarten Chime', frequency: 783.99, type: 'bell', intervalMin: 28, intervalMax: 72 }
    ],
    clickAreas: [
      { id: 'ca-wint-1', targetRoomId: 'fensterplatz-regen', x: 15, y: 60, width: 25, height: 30, label: 'Zurück zum Fensterplatz' },
      { id: 'ca-wint-2', targetRoomId: 'ufer-nebel', x: 65, y: 40, width: 25, height: 45, label: 'Ein Pfad durch den Nebel' },
      { id: 'ca-wint-3', targetRoomId: 'hain', x: 40, y: 10, width: 20, height: 30, label: 'Ein sonniger Spalt im dichten Blattwerk' }
    ],
    transitionType: 'vorhang',
    movementIntensity: 'moderat',
    colorTemperature: '#061B10',
    hasAblageGeste: true
  },
  {
    id: 'nachtzug',
    name: 'Nachtzug',
    emotionalWord: 'Loslassen',
    thought: 'Du sitzt geschützt im warmen Abteil und blickst durch das dunkle Fenster in die vorbeiziehende Nacht. Das gleichmäßige Wiegen trägt dich, ohne etwas von dir zu verlangen. Hier musst du nirgends ankommen.',
    visual: {
      type: 'css-ambient',
      background: 'linear-gradient(135deg, #1b1e2b 0%, #10121a 50%, #06070a 100%)',
      overlayEffect: 'train-lights'
    },
    audio: { type: 'train', volume: 0.3 },
    singleSounds: [
      { name: 'Muted Rail Joint', frequency: 120, type: 'triangle', intervalMin: 30, intervalMax: 70 }
    ],
    clickAreas: [
      { id: 'ca-zug-1', targetRoomId: 'bibliothek-nacht', x: 10, y: 25, width: 20, height: 50, label: 'Abteil-Tür zum stillen Gang' },
      { id: 'ca-zug-2', targetRoomId: 'sternwarte', x: 70, y: 20, width: 25, height: 40, label: 'Blick in den klaren Nachthimmel' }
    ],
    transitionType: 'detailzoom',
    movementIntensity: 'moderat',
    colorTemperature: '#101420',
    hasAblageGeste: true
  },
  {
    id: 'sternwarte',
    name: 'Sternwarte',
    emotionalWord: 'Weite',
    thought: 'Die Kuppel steht offen, und doch bleibst du gehalten. Unzählige Lichtpunkte lassen jeden inneren Lärm kleiner werden. Hier darf dein Atem weit und ruhig werden.',
    visual: {
      type: 'css-ambient',
      background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
      overlayEffect: 'stars'
    },
    audio: { type: 'observatory', volume: 0.22 },
    singleSounds: [
      { name: 'Star Shimmer', frequency: 880, type: 'bell', intervalMin: 110, intervalMax: 220 }
    ],
    clickAreas: [
      { id: 'ca-stern-1', targetRoomId: 'bibliothek-nacht', x: 20, y: 65, width: 25, height: 25, label: 'Die dunkle Holztreppe hinab' },
      { id: 'ca-stern-2', targetRoomId: 'nachtzug', x: 75, y: 55, width: 20, height: 35, label: 'Ein fernes Grollen am Horizont' },
      { id: 'ca-stern-3', targetRoomId: 'blaue-lagune', x: 45, y: 15, width: 15, height: 30, label: 'Ein türkisblauer Lichtsaum in der Felswand' }
    ],
    transitionType: 'dunkelheit',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#0A0E1A',
    hasAblageGeste: false
  },
  {
    id: 'ufer-nebel',
    name: 'Ufer im Nebel',
    emotionalWord: 'Weite',
    thought: 'Wasser und Luft verschwimmen zu einem einzigen weichen Grau. Alles Harte bleibt jenseits des Nebels zurück. Am Ufer darf dein Inneres leiser werden.',
    visual: {
      type: 'css-ambient',
      background: 'linear-gradient(180deg, #2d3748 0%, #1a202c 55%, #0f172a 100%)',
      overlayEffect: 'fog'
    },
    audio: { type: 'shoreline', volume: 0.24 },
    singleSounds: [
      { name: 'Water Lap', frequency: 220, type: 'sine', intervalMin: 24, intervalMax: 60 }
    ],
    clickAreas: [
      { id: 'ca-ufer-1', targetRoomId: 'wintergarten', x: 10, y: 30, width: 25, height: 40, label: 'Der Umriss eines Glashauses' },
      { id: 'ca-ufer-2', targetRoomId: 'stiller-innenhof', x: 70, y: 40, width: 25, height: 35, label: 'Ein steinernes Eisentor' },
      { id: 'ca-ufer-3', targetRoomId: 'sandstrand', x: 40, y: 60, width: 20, height: 25, label: 'Pfad zum weiten Sandstrand' }
    ],
    transitionType: 'nebel',
    movementIntensity: 'gering',
    colorTemperature: '#1A202C',
    hasAblageGeste: true
  },
  {
    id: 'stiller-innenhof',
    name: 'Alter Brunnenhof',
    emotionalWord: 'Einkehr',
    thought: 'Der alte Brunnen hält ein dunkles Auge aus Wasser in der Mitte des Hofes. Moosbedeckte Steine tragen noch die Wärme des Tages. Niemand sucht dich hier, und genau das macht diesen Ort so sanft.',
    visual: {
      type: 'css-ambient',
      background: 'radial-gradient(circle at 50% 60%, #27272a 0%, #18181b 60%, #09090b 100%)',
      overlayEffect: 'water'
    },
    audio: { type: 'courtyard', volume: 0.22 },
    singleSounds: [
      { name: 'Stone Echo', frequency: 349.23, type: 'bell', intervalMin: 70, intervalMax: 140 }
    ],
    clickAreas: [
      { id: 'ca-hof-1', targetRoomId: 'bibliothek-nacht', x: 22, y: 14, width: 18, height: 24, label: 'Die hohen Fenster der Bibliothek' },
      { id: 'ca-hof-4', targetRoomId: 'leere-kirche', x: 53, y: 14, width: 20, height: 30, label: 'Ein Rundbogen in die leere Kirche' },
      { id: 'ca-hof-2', targetRoomId: 'ufer-nebel', x: 5, y: 50, width: 20, height: 40, label: 'Ein kühler Luftzug vom Wasser' },
      { id: 'ca-hof-3', targetRoomId: 'hain', x: 75, y: 20, width: 20, height: 40, label: 'Eine überwucherte Pforte' }
    ],
    transitionType: 'wasserreflexion',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#18181B',
    hasAblageGeste: false
  },
  {
    id: 'leere-kirche',
    name: 'Leere Kirche',
    emotionalWord: 'Andacht',
    thought: 'Kühler Stein, warmes Kerzenlicht und eine Stille, die nichts von dir verlangt. Zwischen den Bänken darf alles schwer Gewordene einfach sinken.',
    visual: {
      type: 'css-ambient',
      background: 'radial-gradient(circle at 50% 18%, #473b2f 0%, #211b17 45%, #080706 100%)',
      overlayEffect: 'dust'
    },
    audio: { type: 'cathedral', volume: 0.24 },
    singleSounds: [
      { name: 'Fernes Nachklingen', frequency: 293.66, type: 'chime', intervalMin: 120, intervalMax: 220 }
    ],
    clickAreas: [
      { id: 'ca-kirche-1', targetRoomId: 'stiller-innenhof', x: 12, y: 58, width: 18, height: 28, label: 'Durch den stillen Kreuzgang zurück' },
      { id: 'ca-kirche-2', targetRoomId: 'bibliothek-nacht', x: 70, y: 28, width: 18, height: 42, label: 'Seitenschiff zur Bibliothek' }
    ],
    transitionType: 'dunkelheit',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#1B1713',
    hasAblageGeste: false
  },
  // 3 NEUE ORTE - VERBESSERT
  {
    id: 'hain',
    name: 'Hain der goldenen Stille',
    emotionalWord: 'Geborgenheit',
    thought: 'Warmes Licht sickert durch das Blätterdach. Der Waldboden gibt sanft nach. Hier kannst du auftanken, bevor du weiterziehst.',
    visual: {
      type: 'css-ambient',
      background: 'radial-gradient(ellipse at 50% 0%, #3d4a25 0%, #1f2914 50%, #0d1208 100%)',
      overlayEffect: 'rays'
    },
    audio: { type: 'forest', volume: 0.34 },
    singleSounds: [
      { name: 'Distant Bird', frequency: 1046.5, type: 'bell', intervalMin: 45, intervalMax: 95 }
    ],
    clickAreas: [
      { id: 'ca-hain-1', targetRoomId: 'wintergarten', x: 10, y: 40, width: 20, height: 40, label: 'Zurück zum schattigen Glashaus' },
      { id: 'ca-hain-2', targetRoomId: 'stiller-innenhof', x: 70, y: 50, width: 25, height: 35, label: 'Rückweg zum steinernen Innenhof' },
      { id: 'ca-hain-3', targetRoomId: 'sandstrand', x: 40, y: 75, width: 20, height: 20, label: 'Ein sandiger Trampelpfad hinab' }
    ],
    transitionType: 'tuer',
    movementIntensity: 'gering',
    colorTemperature: '#1F2914',
    hasAblageGeste: true
  },
  {
    id: 'sandstrand',
    name: 'Strand bei Abenddämmerung',
    emotionalWord: 'Weite',
    thought: 'Der Horizont verschwimmt zwischen Wasser und Himmel. Jede Welle nimmt ein wenig Anspannung mit sich fort. Hier darf der Tag enden, ohne noch etwas von dir zu wollen.',
    visual: {
      type: 'css-ambient',
      background: 'linear-gradient(180deg, #1e3542 0%, #2a4a5a 30%, #1c3a47 60%, #0f1f26 100%)',
      overlayEffect: 'waves'
    },
    audio: { type: 'ocean', volume: 0.32 },
    singleSounds: [
      { name: 'Wave Crest', frequency: 180, type: 'sine', intervalMin: 24, intervalMax: 56 }
    ],
    clickAreas: [
      { id: 'ca-strand-1', targetRoomId: 'ufer-nebel', x: 10, y: 30, width: 20, height: 45, label: 'Kühler Nebelpfad am Wasser' },
      { id: 'ca-strand-2', targetRoomId: 'hain', x: 70, y: 20, width: 20, height: 40, label: 'Weg hinauf in den schattigen Hain' },
      { id: 'ca-strand-3', targetRoomId: 'blaue-lagune', x: 40, y: 65, width: 20, height: 20, label: 'Ein schmaler Felspfad zur blauen Lagune' }
    ],
    transitionType: 'wasserreflexion',
    movementIntensity: 'moderat',
    colorTemperature: '#0F1F26',
    hasAblageGeste: true
  },
  {
    id: 'blaue-lagune',
    name: 'Blaue Lagune',
    emotionalWord: 'Sanftheit',
    thought: 'Zwischen dunklem Fels und ruhigem Wasser sammelt sich türkises Licht. Jeder Atemzug wird weiter. Hier fühlt sich selbst die Stille freundlich an.',
    visual: {
      type: 'css-ambient',
      background: 'radial-gradient(circle at 50% 30%, #1e6b7b 0%, #0a3340 35%, #04161c 100%)',
      overlayEffect: 'water'
    },
    audio: { type: 'lagoon', volume: 0.26 },
    singleSounds: [
      { name: 'Cave Drop', frequency: 261.63, type: 'bell', intervalMin: 65, intervalMax: 130 }
    ],
    clickAreas: [
      { id: 'ca-lagune-1', targetRoomId: 'sternwarte', x: 18, y: 14, width: 20, height: 38, label: 'Ein schmaler Felsgang zurück zur Sternwarte' },
      { id: 'ca-lagune-2', targetRoomId: 'sandstrand', x: 58, y: 60, width: 26, height: 26, label: 'Über den warmen Fels zurück zum Strand' }
    ],
    transitionType: 'wasserreflexion',
    movementIntensity: 'gering',
    colorTemperature: '#08242D',
    hasAblageGeste: false
  }
];

export const AVAILABLE_PACKAGES: RoomPackage[] = [
  {
    id: 'pkg-teehaueschen',
    name: 'Japanisches Teehäuschen',
    description: 'Tatami-Matten, der Duft von grünem Tee und feiner Regen auf Bambusblättern.',
    version: '1.0.0',
    sizeKb: 420,
    roomData: {
      id: 'japanisches-teehaueschen',
      name: 'Japanisches Teehäuschen',
      emotionalWord: 'Gleichmut',
      thought: 'Wasserdampf steigt aus der gusseisernen Kanne. Der Wind bleibt jenseits der Shoji-Schirme. Im warmen Duft des Tees wird alles langsamer.',
      visual: {
        type: 'css-ambient',
        background: 'radial-gradient(circle at 40% 50%, #2e2318 0%, #1c150e 60%, #0a0705 100%)',
        overlayEffect: 'leaves'
      },
      audio: { type: 'teahouse', volume: 0.22 },
      singleSounds: [{ name: 'Bamboo Chime', frequency: 659.25, type: 'bell', intervalMin: 40, intervalMax: 90 }],
      clickAreas: [
        { id: 'ca-tee-1', targetRoomId: 'stiller-innenhof', x: 10, y: 30, width: 25, height: 50, label: 'Steinpfad zum Innenhof' },
        { id: 'ca-tee-2', targetRoomId: 'wintergarten', x: 70, y: 25, width: 20, height: 45, label: 'Blick in den Wintergarten' }
      ],
      transitionType: 'vorhang',
      movementIntensity: 'gering',
      colorTemperature: '#1C150E',
      hasAblageGeste: true,
      isCustomPackage: true,
      packageVersion: '1.0.0'
    },
    assets: ['/manifest.webmanifest']
  },
  {
    id: 'pkg-kaminzimmer',
    name: 'Verlassenes Kaminzimmer',
    description: 'Knisterndes Birkenholz, schwere Ohrensessel und tanzende Schatten an den Wänden.',
    version: '1.0.0',
    sizeKb: 580,
    roomData: {
      id: 'kaminzimmer',
      name: 'Verlassenes Kaminzimmer',
      emotionalWord: 'Wärme',
      thought: 'Glut schimmert rot im dunklen Kamin. Draußen mag es kalt und fordernd sein, doch hier halten Wärme und Schatten still für dich aus. Ein Ort, der nichts verlangt und dennoch empfängt.',
      visual: {
        type: 'css-ambient',
        background: 'radial-gradient(circle at 50% 70%, #3b1d11 0%, #1f0d06 60%, #0a0301 100%)',
        overlayEffect: 'fire'
      },
      audio: { type: 'hearth', volume: 0.26 },
      singleSounds: [{ name: 'Ember Crackle', frequency: 587.33, type: 'triangle', intervalMin: 26, intervalMax: 65 }],
      clickAreas: [
        { id: 'ca-kamin-1', targetRoomId: 'bibliothek-nacht', x: 20, y: 20, width: 30, height: 50, label: 'Durchgang zur Bibliothek' },
        { id: 'ca-kamin-2', targetRoomId: 'fensterplatz-regen', x: 75, y: 30, width: 20, height: 40, label: 'Ein hohes, verregnetes Fenster' }
      ],
      transitionType: 'dunkelheit',
      movementIntensity: 'gering',
      colorTemperature: '#1F0D06',
      hasAblageGeste: false,
      isCustomPackage: true,
      packageVersion: '1.0.0'
    },
    assets: ['/manifest.webmanifest']
  }
];