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
      { name: 'Distant Thunder', frequency: 110, type: 'thunder', intervalMin: 20, intervalMax: 45 }
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
    audio: { type: 'library', volume: 0.4 },
    singleSounds: [
      { name: 'Soft Chime', frequency: 523.25, type: 'chime', intervalMin: 30, intervalMax: 60 }
    ],
    clickAreas: [
      { id: 'ca-bib-1', targetRoomId: 'fensterplatz-regen', x: 5, y: 20, width: 20, height: 60, label: 'Das leise Prasseln am Fenster' },
      { id: 'ca-bib-2', targetRoomId: 'sternwarte', x: 75, y: 15, width: 20, height: 50, label: 'Eine Wendeltreppe nach oben' },
      { id: 'ca-bib-3', targetRoomId: 'stiller-innenhof', x: 40, y: 70, width: 25, height: 25, label: 'Schwere Holztür zum Hof' }
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
    audio: { type: 'wind', volume: 0.4 },
    singleSounds: [
      { name: 'Wind Chime', frequency: 880, type: 'bell', intervalMin: 15, intervalMax: 40 }
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
    thought: 'Das gleichmäßige Wiegen trägt dich durch die Dunkelheit, ohne etwas von dir zu verlangen. Draußen huschen fremde Lichter vorbei. Hier musst du nirgends ankommen.',
    visual: {
      type: 'css-ambient',
      background: 'linear-gradient(135deg, #1b1e2b 0%, #10121a 50%, #06070a 100%)',
      overlayEffect: 'train-lights'
    },
    audio: { type: 'train', volume: 0.5 },
    singleSounds: [
      { name: 'Rail Click', frequency: 150, type: 'triangle', intervalMin: 10, intervalMax: 25 }
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
    audio: { type: 'space', volume: 0.5 },
    singleSounds: [
      { name: 'Star Shimmer', frequency: 1200, type: 'bell', intervalMin: 25, intervalMax: 50 }
    ],
    clickAreas: [
      { id: 'ca-stern-1', targetRoomId: 'bibliothek-nacht', x: 20, y: 65, width: 25, height: 25, label: 'Die dunkle Holztreppe hinab' },
      { id: 'ca-stern-2', targetRoomId: 'nachtzug', x: 75, y: 55, width: 20, height: 35, label: 'Ein fernes Grollen am Horizont' },
      { id: 'ca-stern-3', targetRoomId: 'unterwasserstation', x: 45, y: 15, width: 15, height: 30, label: 'Ein tiefblaues Okular' }
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
    audio: { type: 'water', volume: 0.5 },
    singleSounds: [
      { name: 'Water Lap', frequency: 300, type: 'sine', intervalMin: 12, intervalMax: 30 }
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
    name: 'Stiller Innenhof',
    emotionalWord: 'Einkehr',
    thought: 'Ein alter Brunnen flüstert vor sich hin. Moosbedeckte Steine halten die Wärme des vergangenen Tages. Niemand sucht dich hier, und genau das macht diesen Ort so sanft.',
    visual: {
      type: 'css-ambient',
      background: 'radial-gradient(circle at 50% 60%, #27272a 0%, #18181b 60%, #09090b 100%)',
      overlayEffect: 'water'
    },
    audio: { type: 'silence', volume: 0.3 },
    singleSounds: [
      { name: 'Stone Echo', frequency: 440, type: 'bell', intervalMin: 35, intervalMax: 70 }
    ],
    clickAreas: [
      { id: 'ca-hof-1', targetRoomId: 'bibliothek-nacht', x: 30, y: 15, width: 40, height: 25, label: 'Die hohen Fenster der Bibliothek' },
      { id: 'ca-hof-2', targetRoomId: 'ufer-nebel', x: 5, y: 50, width: 20, height: 40, label: 'Ein kühler Luftzug vom Wasser' },
      { id: 'ca-hof-3', targetRoomId: 'hain', x: 75, y: 20, width: 20, height: 40, label: 'Eine überwucherte Pforte' }
    ],
    transitionType: 'wasserreflexion',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#18181B',
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
    audio: { type: 'forest', volume: 0.48 },
    singleSounds: [
      { name: 'Distant Bird', frequency: 1200, type: 'bell', intervalMin: 25, intervalMax: 55 }
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
    audio: { type: 'ocean', volume: 0.58 },
    singleSounds: [
      { name: 'Wave Crest', frequency: 200, type: 'sine', intervalMin: 12, intervalMax: 28 }
    ],
    clickAreas: [
      { id: 'ca-strand-1', targetRoomId: 'ufer-nebel', x: 10, y: 30, width: 20, height: 45, label: 'Kühler Nebelpfad am Wasser' },
      { id: 'ca-strand-2', targetRoomId: 'hain', x: 70, y: 20, width: 20, height: 40, label: 'Weg hinauf in den schattigen Hain' },
      { id: 'ca-strand-3', targetRoomId: 'unterwasserstation', x: 40, y: 65, width: 20, height: 20, label: 'Eine eiserne Luke im Sand' }
    ],
    transitionType: 'wasserreflexion',
    movementIntensity: 'moderat',
    colorTemperature: '#0F1F26',
    hasAblageGeste: true
  },
  {
    id: 'unterwasserstation',
    name: 'Tiefsee-Beobachtungsluke',
    emotionalWord: 'Gelassenheit',
    thought: 'Das Bullauge hält die Tiefe draußen und macht sie sanft. Blasen steigen wie gelöste Gedanken auf. In diesem stillen Blau ist alles entschleunigt.',
    visual: {
      type: 'css-ambient',
      background: 'radial-gradient(circle at 50% 50%, #0d4a5c 0%, #052a35 40%, #021016 100%)',
      overlayEffect: 'underwater'
    },
    audio: { type: 'submarine', volume: 0.52 },
    singleSounds: [
      { name: 'Deep Ping', frequency: 523.25, type: 'chime', intervalMin: 30, intervalMax: 70 }
    ],
    clickAreas: [
      { id: 'ca-luke-1', targetRoomId: 'sternwarte', x: 20, y: 15, width: 20, height: 40, label: 'Blick hinauf zum Fernrohr-Okular' },
      { id: 'ca-luke-2', targetRoomId: 'sandstrand', x: 60, y: 60, width: 25, height: 30, label: 'Die Luke nach oben zum Strand öffnen' }
    ],
    transitionType: 'detailzoom',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#021016',
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
      audio: { type: 'rain', volume: 0.4 },
      singleSounds: [{ name: 'Bamboo Chime', frequency: 700, type: 'bell', intervalMin: 20, intervalMax: 45 }],
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
      audio: { type: 'library', volume: 0.6 },
      singleSounds: [{ name: 'Ember Crackle', frequency: 800, type: 'triangle', intervalMin: 15, intervalMax: 35 }],
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