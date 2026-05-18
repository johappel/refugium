import { Room, RoomPackage } from '../types/refugium';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'fensterplatz-regen',
    name: 'Veranda im Regen',
    emotionalWord: 'Aufatmen',
    thought: 'Regen und Bergsee tragen den Lärm des Tages nach draußen. Zwischen Kerzen, Decken und warmem Holz darfst du einfach ankommen. Hier wirst du nicht gedrängt, nur gehalten.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 60%, #020617 100%)',
      overlayEffect: 'rain'
    },
    audio: {
      type: 'silence',
      volume: 0.48,
      sampleLayer: {
        url: '/sound-effects/healing.mp3',
        volume: 0.12,
        startDelay: 10,
        fadeInSeconds: 4,
        loop: true,
        lowpass: 2600
      }
    },
    clickAreas: [
      { id: 'ca-regen-1', targetRoomId: 'bibliothek-nacht', x: 70, y: 30, width: 25, height: 40, label: 'Der warme Schein der Lesestube' },
      { id: 'ca-regen-2', targetRoomId: 'wintergarten', x: 10, y: 50, width: 20, height: 35, label: 'Die gläserne Tür ins feuchte Grün' }
    ],
    transitionType: 'wasserreflexion',
    movementIntensity: 'gering',
    colorTemperature: '#0F172A',
    hasAblageGeste: true
  },
  {
    id: 'bibliothek-nacht',
    name: 'Lesestube bei Nacht',
    emotionalWord: 'Sammlung',
    thought: 'Feuer, Leder und Papier nehmen den Druck aus deinen Gedanken. Was eben noch kreiste, legt sich in ruhige Schichten. Hier darf Klarheit langsam wachsen, ohne dass du sie erzwingen musst.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 30% 40%, #291e1e 0%, #1a1010 60%, #0a0505 100%)',
      overlayEffect: 'dust'
    },
    audio: { type: 'silence', volume: 0 },
    clickAreas: [
      { id: 'ca-bib-1', targetRoomId: 'fensterplatz-regen', x: 5, y: 20, width: 20, height: 60, label: 'Das Leuchten der regennassen Veranda' },
      { id: 'ca-bib-2', targetRoomId: 'sternwarte', x: 75, y: 15, width: 20, height: 50, label: 'Die Wendeltreppe unter offenem Himmel' },
      { id: 'ca-bib-3', targetRoomId: 'stiller-innenhof', x: 34, y: 70, width: 18, height: 24, label: 'Der stille Weg zum Brunnenlicht' },
      { id: 'ca-bib-4', targetRoomId: 'leere-kirche', x: 54, y: 18, width: 16, height: 40, label: 'Der Gang in die lichtdurchbrochene Kapelle' }
    ],
    transitionType: 'tuer',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#1E110A',
    hasAblageGeste: false
  },
  {
    id: 'wintergarten',
    name: 'Gewächshaus des Morgens',
    emotionalWord: 'Erneuerung',
    thought: 'Licht fällt in breiten Bahnen durch das Glas und weckt alles Grüne. Der Duft von Erde und Blättern richtet dich von innen auf. Hier darf neue Kraft leise in dir aufgehen.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 60% 50%, #11251d 0%, #08140e 65%, #020604 100%)',
      overlayEffect: 'leaves'
    },
    audio: {
      type: 'silence',
      volume: 1,
      sampleLayer: {
        url: '/sound-effects/gewaechshaus.mp3',
        volume: 0.36,
        fadeInSeconds: 3,
        loop: true,
        lowpass: 2600
      }
    },
    singleSounds: [
      { name: 'Wintergarten Chime', frequency: 783.99, type: 'bell', intervalMin: 28, intervalMax: 72 }
    ],
    clickAreas: [
      { id: 'ca-wint-1', targetRoomId: 'fensterplatz-regen', x: 15, y: 60, width: 25, height: 30, label: 'Zurück zur warmen Veranda' },
      { id: 'ca-wint-2', targetRoomId: 'ufer-nebel', x: 65, y: 40, width: 25, height: 45, label: 'Ein heller Steg im Morgennebel' },
      { id: 'ca-wint-3', targetRoomId: 'hain', x: 40, y: 10, width: 20, height: 30, label: 'Ein verwurzelter Pfad ins weite Grün' }
    ],
    transitionType: 'vorhang',
    movementIntensity: 'moderat',
    colorTemperature: '#061B10',
    hasAblageGeste: true
  },
  {
    id: 'nachtzug',
    name: 'Nachtabteil',
    emotionalWord: 'Unterwegssein',
    thought: 'Der Zug trägt dich durch die Nacht, ohne dass du irgendwo ankommen musst. Hinter dem Fenster zieht die Welt vorbei, und mit ihr alles, was heute noch nach dir gegriffen hat. Hier darfst du einfach unterwegs sein: gehalten vom Rhythmus der Schienen, in Bewegung, ohne Zielzwang.',
    visual: {
      type: 'image',
      background: 'linear-gradient(135deg, #1b1e2b 0%, #10121a 50%, #06070a 100%)',
      overlayEffect: 'train-lights'
    },
    audio: {
      type: 'silence',
      volume: 0.3,
      sampleLayer: {
        url: '/sound-effects/train.mp3',
        volume: 0.24,
        fadeInSeconds: 3.2,
        loop: true,
        lowpass: 1700
      }
    },
    clickAreas: [
      { id: 'ca-zug-1', targetRoomId: 'bibliothek-nacht', x: 10, y: 25, width: 20, height: 50, label: 'Der ruhige Gang zurück zur Lesestube' },
      { id: 'ca-zug-2', targetRoomId: 'sternwarte', x: 70, y: 20, width: 25, height: 40, label: 'Ein Aufriss von Sternen über der Nacht' }
    ],
    transitionType: 'detailzoom',
    movementIntensity: 'moderat',
    colorTemperature: '#101420',
    hasAblageGeste: true
  },
  {
    id: 'sternwarte',
    name: 'Offene Sternwarte',
    emotionalWord: 'Unendlichkeit',
    thought: 'Unter dem klaren Himmel wird spürbar, wie weit alles ist und wie klein du darin bist. Und doch ist jeder Stern, der aufleuchtet, unverwechselbar, als trüge selbst die Ferne einen Namen. Hier werden deine Gedanken frei: Nichts ist von Bedeutung. Alles ist bedeutsam.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
      overlayEffect: 'stars'
    },
    audio: {
      type: 'silence',
      volume: 1,
      sampleLayer: {
        url: '/sound-effects/sternwarte.mp3',
        volume: 0.5,
        fadeInSeconds: 4,
        loop: true,
        lowpass: 2600
      }
    },
    clickAreas: [
      { id: 'ca-stern-1', targetRoomId: 'bibliothek-nacht', x: 20, y: 65, width: 25, height: 25, label: 'Die Holztreppe zurück ins warme Licht' },
      { id: 'ca-stern-2', targetRoomId: 'nachtzug', x: 75, y: 55, width: 20, height: 35, label: 'Ein fernes Rollen auf nächtlichen Schienen' },
      { id: 'ca-stern-3', targetRoomId: 'blaue-lagune', x: 45, y: 15, width: 15, height: 30, label: 'Ein blauer Schimmer tief im Fels' }
    ],
    transitionType: 'dunkelheit',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#0A0E1A',
    hasAblageGeste: false
  },
  {
    id: 'ufer-nebel',
    name: 'Steg im Morgennebel',
    emotionalWord: 'Vertrauen',
    thought: 'Der Nebel hält die Welt weich, und doch fällt schon Licht hindurch. Schritt für Schritt wird sichtbar, was vorher verborgen war. Hier musst du nicht alles wissen, um weiterzugehen.',
    visual: {
      type: 'image',
      background: 'linear-gradient(180deg, #2d3748 0%, #1a202c 55%, #0f172a 100%)',
      overlayEffect: 'mist'
    },
    audio: { type: 'shoreline', volume: 0.24 },
    singleSounds: [
      { name: 'Water Lap', frequency: 220, type: 'sine', intervalMin: 24, intervalMax: 60 }
    ],
    clickAreas: [
      { id: 'ca-ufer-1', targetRoomId: 'wintergarten', x: 10, y: 30, width: 25, height: 40, label: 'Das Glashaus hinter dem Dunst' },
      { id: 'ca-ufer-2', targetRoomId: 'stiller-innenhof', x: 70, y: 40, width: 25, height: 35, label: 'Ein stiller Hof mit Brunnenlicht' },
      { id: 'ca-ufer-3', targetRoomId: 'sandstrand', x: 40, y: 60, width: 20, height: 25, label: 'Der Weg hinab zum offenen Meer' }
    ],
    transitionType: 'nebel',
    movementIntensity: 'gering',
    colorTemperature: '#1A202C',
    hasAblageGeste: true
  },
  {
    id: 'stiller-innenhof',
    name: 'Brunnenlicht',
    emotionalWord: 'Tiefe',
    thought: 'Am Brunnen dürfen tiefe Gedanken bis auf den Grund sinken und still werden. Wer hier in die Tiefe hört, stößt nicht auf Leere, sondern auf etwas Klares, das aus dem Dunkel aufsteigt. Aus diesem Wasser lässt sich Ruhe schöpfen, Weite, vielleicht auch ein neuer Blick auf das, was in dir klingt.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 50% 60%, #27272a 0%, #18181b 60%, #09090b 100%)',
      overlayEffect: 'stone-drips'
    },
    audio: { type: 'silence', volume: 0 },
    singleSounds: [
      {
        name: 'Brunnen',
        frequency: 329.63,
        type: 'sample',
        startImmediately: true,
        sample: {
          url: '/sound-effects/brunnen.mp3',
          volume: 0.22,
          lowpass: 2600
        },
        intervalMin: 60,
        intervalMax: 60
      }
    ],
    clickAreas: [
      { id: 'ca-hof-1', targetRoomId: 'bibliothek-nacht', x: 22, y: 14, width: 18, height: 24, label: 'Die warme Stube aus Holz und Papier' },
      { id: 'ca-hof-4', targetRoomId: 'leere-kirche', x: 53, y: 14, width: 20, height: 30, label: 'Die Kapelle voller fallendem Licht' },
      { id: 'ca-hof-2', targetRoomId: 'ufer-nebel', x: 5, y: 50, width: 20, height: 40, label: 'Der Steg durch den lichten Nebel' },
      { id: 'ca-hof-3', targetRoomId: 'hain', x: 75, y: 20, width: 20, height: 40, label: 'Ein Pfad unter alten Wurzeln' }
    ],
    transitionType: 'wasserreflexion',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#18181B',
    hasAblageGeste: false
  },
  {
    id: 'leere-kirche',
    name: 'Kapellenruine',
    emotionalWord: 'Sehnsucht',
    thought: 'Wie diese zerfallene Kirche, so brüchig fühlen sich oft Sinn, Vertrauen und Glaube an. Und doch: Wie kleine Lichtffunken steigen sie auf, wie ein kurzes Gebet, wie ein stiller Aufschrei, wie Hoffnung. Hier dürfen deine Gedanken aufsteigen, ohne Antwort geben zu müssen, und sich für einen Moment dem öffnen, was größer ist als du selbst.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 50% 18%, #473b2f 0%, #211b17 45%, #080706 100%)',
      overlayEffect: 'prayer-lights'
    },
    audio: { type: 'silence', volume: 0 },
    singleSounds: [
      {
        name: 'Glockenschlag',
        frequency: 293.66,
        type: 'sample',
        sample: {
          url: '/sound-effects/glocke.mp3',
          volume: 0.2,
          lowpass: 2400,
          clipDuration: 5.5,
          playbackRateMin: 0.99,
          playbackRateMax: 1.01
        },
        intervalMin: 15,
        intervalMax: 15
      }
    ],
    clickAreas: [
      { id: 'ca-kirche-1', targetRoomId: 'stiller-innenhof', x: 12, y: 58, width: 18, height: 28, label: 'Zurück durch den stillen Hof' },
      { id: 'ca-kirche-2', targetRoomId: 'bibliothek-nacht', x: 70, y: 28, width: 18, height: 42, label: 'Der Seitengang zur Lesestube' }
    ],
    transitionType: 'dunkelheit',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#1B1713',
    hasAblageGeste: false
  },
  // 3 NEUE ORTE - VERBESSERT
  {
    id: 'hain',
    name: 'Behüteter Hain',
    emotionalWord: 'Geborgensein',
    thought: 'Zwischen alten Wurzeln, blauem Schimmer und wachendem Licht liegt ein Weg, der dich freundlich aufnimmt. Dieser Ort erinnert deinen Körper daran, dass Freundschaft und Geborgenheit real sind. Hier kannst du bleiben, solange du magst.',
    visual: {
      type: 'image',
      background: 'radial-gradient(ellipse at 50% 0%, #3d4a25 0%, #1f2914 50%, #0d1208 100%)',
      overlayEffect: 'rays'
    },
    audio: {
      type: 'silence',
      volume: 0.34,
      sampleLayer: {
        url: '/sound-effects/hain.mp3',
        volume: 0.22,
        fadeInSeconds: 2.5,
        loop: true,
        lowpass: 2200
      }
    },
    clickAreas: [
      { id: 'ca-hain-1', targetRoomId: 'wintergarten', x: 10, y: 40, width: 20, height: 40, label: 'Zurück ins lichtdurchflutete Gewächshaus' },
      { id: 'ca-hain-2', targetRoomId: 'stiller-innenhof', x: 70, y: 50, width: 25, height: 35, label: 'Der Pfad zum Brunnenlicht' },
      { id: 'ca-hain-3', targetRoomId: 'sandstrand', x: 6, y: 78, width: 18, height: 18, label: 'Ein warmer Abstieg zum Abendstrand' }
    ],
    transitionType: 'tuer',
    movementIntensity: 'gering',
    colorTemperature: '#1F2914',
    hasAblageGeste: true
  },
  {
    id: 'sandstrand',
    name: 'Abendstrand',
    emotionalWord: 'Loslassen',
    thought: 'Am Abendstrand darf der Tag hinter dir bleiben. Die sinkende Sonne gibt dir das Recht, den Blick schweifen zu lassen, weg von allem, was getan, versäumt oder bedacht werden wollte. Hier dürfen deine Gedanken still und ziellos werden, bis nur noch Weite, Licht und das leise Kommen der Wellen bleiben.',
    visual: {
      type: 'image',
      background: 'linear-gradient(180deg, #1e3542 0%, #2a4a5a 30%, #1c3a47 60%, #0f1f26 100%)',
      overlayEffect: 'waves'
    },
    audio: {
      type: 'ocean',
      volume: 0.01,
      sampleLayer: {
        url: '/sound-effects/deep-ocean.mp3',
        volume: 2.22,
        startDelay: 1,
        startOffset: 0.45,
        fadeInSeconds: 1.5,
        loop: true,
        lowpass: 1500,
        roomGainMultiplier: 0.58
      }
    },
    singleSounds: [
      { name: 'Wave Crest', frequency: 180, type: 'sine', intervalMin: 24, intervalMax: 56 }
    ],
    clickAreas: [
      { id: 'ca-strand-1', targetRoomId: 'ufer-nebel', x: 10, y: 30, width: 20, height: 45, label: 'Zurück über den lichten Nebelweg' },
      { id: 'ca-strand-2', targetRoomId: 'hain', x: 70, y: 20, width: 20, height: 40, label: 'Hinauf in den behüteten Hain' },
      { id: 'ca-strand-3', targetRoomId: 'blaue-lagune', x: 40, y: 65, width: 20, height: 20, label: 'Ein geschützter Felspfad zur blauen Grotte' }
    ],
    transitionType: 'wasserreflexion',
    movementIntensity: 'moderat',
    colorTemperature: '#0F1F26',
    hasAblageGeste: true
  },
  {
    id: 'blaue-lagune',
    name: 'Blaue Grotte',
    emotionalWord: 'Zuversicht',
    thought: 'Blaues Wasser atmet an den Fels, warmes Feuer hält dir den Rücken. Zwischen Schutz und Offenheit wird dein Atem ruhig und frei. Hier wächst neuer Mut, fast unmerklich, aus der Stille.',
    visual: {
      type: 'css-ambient',
      background: 'radial-gradient(circle at 50% 30%, #1e6b7b 0%, #0a3340 35%, #04161c 100%)',
      overlayEffect: 'water'
    },
    audio: { type: 'lagoon', volume: 0.26 },
    singleSounds: [
      { name: 'Cave Drop', frequency: 523.25, type: 'drip', intervalMin: 5, intervalMax: 10 }
    ],
    clickAreas: [
      { id: 'ca-lagune-1', targetRoomId: 'sternwarte', x: 18, y: 14, width: 20, height: 38, label: 'Ein schmaler Felsgang zurück zur Sternwarte' },
      { id: 'ca-lagune-2', targetRoomId: 'sandstrand', x: 58, y: 60, width: 26, height: 26, label: 'Über warmen Stein hinaus zum Abendstrand' }
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
    name: 'Teehaus im Regen',
    description: 'Papierlicht, gedämpfter Regen und der Duft von Tee lassen Gedanken klar und weich werden.',
    version: '1.0.0',
    sizeKb: 420,
    roomData: {
      id: 'japanisches-teehaueschen',
      name: 'Teehaus im Regen',
      emotionalWord: 'Ausgleich',
      thought: 'Dampf steigt aus der Kanne, Regen bleibt hinter den Shoji-Schirmen. Der Raum macht deine Gedanken nicht kleiner, aber ruhiger und klarer. Hier findet dein Inneres wieder seinen Takt.',
      visual: {
        type: 'css-ambient',
        background: 'radial-gradient(circle at 40% 50%, #2e2318 0%, #1c150e 60%, #0a0705 100%)',
        overlayEffect: 'leaves'
      },
      audio: { type: 'teahouse', volume: 0.22 },
      singleSounds: [{ name: 'Bamboo Chime', frequency: 659.25, type: 'bell', intervalMin: 40, intervalMax: 90 }],
      clickAreas: [
        { id: 'ca-tee-1', targetRoomId: 'stiller-innenhof', x: 10, y: 30, width: 25, height: 50, label: 'Steinpfad zum Brunnenlicht' },
        { id: 'ca-tee-2', targetRoomId: 'wintergarten', x: 70, y: 25, width: 20, height: 45, label: 'Blick ins erwachende Gewächshaus' }
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
    name: 'Stilles Kaminzimmer',
    description: 'Feuerwärme, schweres Holz und tiefe Sessel geben erschöpften Gedanken wieder Boden.',
    version: '1.0.0',
    sizeKb: 580,
    roomData: {
      id: 'kaminzimmer',
      name: 'Stilles Kaminzimmer',
      emotionalWord: 'Trost',
      thought: 'Das Feuer hält Wache, während draußen alles fern werden darf. In dieser Wärme musst du nichts leisten, nichts beweisen. Hier kann Erschöpfung weich werden und langsam in Kraft zurückfinden.',
      visual: {
        type: 'css-ambient',
        background: 'radial-gradient(circle at 50% 70%, #3b1d11 0%, #1f0d06 60%, #0a0301 100%)',
        overlayEffect: 'fire'
      },
      audio: { type: 'hearth', volume: 0.26 },
      singleSounds: [{ name: 'Ember Crackle', frequency: 587.33, type: 'triangle', intervalMin: 26, intervalMax: 65 }],
      clickAreas: [
        { id: 'ca-kamin-1', targetRoomId: 'bibliothek-nacht', x: 20, y: 20, width: 30, height: 50, label: 'Durchgang zur nächtlichen Lesestube' },
        { id: 'ca-kamin-2', targetRoomId: 'fensterplatz-regen', x: 75, y: 30, width: 20, height: 40, label: 'Die regennasse Veranda im warmen Licht' }
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