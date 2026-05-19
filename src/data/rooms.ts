import { Room, RoomPackage } from '../types/refugium';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'fensterplatz-regen',
    name: 'Veranda im Regen',
    emotionalWord: 'Aufatmen',
    thought: 'Das sanfte Prasseln des Regens legt sich wie eine schützende Decke über die Welt draußen. Hier gibt es keine Eile. Ein geschützter Raum, der dich einlädt, den Moment einfach umhüllen zu lassen und frei durchzuatmen.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 60%, #020617 100%)',
      overlayEffect: 'rain'
    },
    audio: {
      type: 'silence',
      volume: 0.48,
      sampleLayer: {
        url: 'sound-effects/healing.mp3',
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
    thought: 'Zwischen warmem Licht, Leder und altem Papier findet der Geist eine ruhige Verankerung. Eine Einladung, das außen Vorbeirollende pausieren zu lassen und Klarheit ganz im eigenen Tempo entstehen zu lassen.',
    giftPopoverTitle: 'Für die Tage, an denen alles zu viel wird',
    giftPopoverText:
      'Hier musst du nicht immer antworten.\nNicht immer funktionieren.\nNicht immer stark wirken.\n\nManche Orte entstehen nur dafür,\ndass man kurz aufhören darf.\n\nSich zurückziehen heißt nicht verschwinden.\nManchmal bedeutet es nur:\n\nwieder Luft holen.\nwieder bei sich ankommen.\n\nDieses Refugium kann so ein Ort sein.\n\nFür stille Gedanken.\nFür langsame Abende.\nFür Regen, Licht, Ferne und Atempausen.\n\nUnd vielleicht auch als Erinnerung:\n\nEs ist vollkommen in Ordnung,\nmanchmal einfach nur zu sein.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 30% 40%, #291e1e 0%, #1a1010 60%, #0a0505 100%)',
      overlayEffect: 'dust'
    },
    audio: { type: 'library', volume: 0.045 },
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
    thought: 'Das diffuse Morgenlicht bricht sich in feuchten Blättern. Der Duft von feuchter Erde vermittelt Stabilität und sanftes Wachstum. Ein freundlicher Ort, an dem sich neue Energie auf entspannte Weise entfalten kann.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 60% 50%, #11251d 0%, #08140e 65%, #020604 100%)',
      overlayEffect: 'leaves'
    },
    audio: {
      type: 'silence',
      volume: 1,
      sampleLayer: {
        url: 'sound-effects/gewaechshaus.mp3',
        volume: 0.36,
        fadeInSeconds: 0,
        loop: true,
        lowpass: 2600
      }
    },
    clickAreas: [
      { id: 'ca-wint-1', targetRoomId: 'fensterplatz-regen', x: 15, y: 60, width: 25, height: 30, label: 'Zurück zur warmen Veranda' },
      { id: 'ca-wint-2', targetRoomId: 'ufer-nebel', x: 55, y: 62, width: 25, height: 45, label: 'Ein heller Steg im Morgennebel' },
      { id: 'ca-wint-3', targetRoomId: 'hain', x: 57, y: 38, width: 20, height: 30, label: 'Ein verwurzelter Pfad ins weite Grün' }
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
    thought: 'Vom gleichmäßigen Rollen der Räder begleitet, zieht die Welt draußen gelassen vorbei. Ein Raum in sanfter Bewegung, der dazu einlädt, alle Pläne für eine Weile ruhen zu lassen und einfach nur im Hier zu sein.',
    visual: {
      type: 'image',
      background: 'linear-gradient(135deg, #1b1e2b 0%, #10121a 50%, #06070a 100%)',
      overlayEffect: 'train-lights'
    },
    audio: {
      type: 'silence',
      volume: 0.3,
      sampleLayer: {
        url: 'sound-effects/train.mp3',
        volume: 0.24,
        fadeInSeconds: 3.2,
        loop: true,
        lowpass: 1700
      }
    },
    clickAreas: [
      { id: 'ca-zug-1', targetRoomId: 'bibliothek-nacht', x: 6, y: 12, width: 20, height: 50, label: 'Der ruhige Gang zurück zur Lesestube' },
      { id: 'ca-zug-2', targetRoomId: 'sternwarte', x: 70, y: 5, width: 25, height: 40, label: 'Ein Aufriss von Sternen über der Nacht' }
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
    thought: 'Unter dem leuchtenden Sternenzelt öffnet sich eine weite, friedliche Perspektive. In dieser stillen Weite können sich Gedanken vollkommen frei und unbeschwert bewegen, fernab von jedem Alltagsrhythmus.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
      overlayEffect: 'stars'
    },
    audio: {
      type: 'silence',
      volume: 1,
      sampleLayer: {
        url: 'sound-effects/sternwarte.mp3',
        volume: 0.5,
        fadeInSeconds: 4,
        loop: true,
        lowpass: 2600
      }
    },
    clickAreas: [
      { id: 'ca-stern-1', targetRoomId: 'bibliothek-nacht', x: 10, y: 65, width: 25, height: 25, label: 'Die Holztreppe zurück ins warme Licht' },
      { id: 'ca-stern-2', targetRoomId: 'nachtzug', x: 80, y: 45, width: 20, height: 35, label: 'Ein fernes Rollen auf nächtlichen Schienen' },
      { id: 'ca-stern-3', targetRoomId: 'blaue-lagune', x: 65, y: -10, width: 15, height: 30, label: 'Ein blauer Schimmer tief im Fels' }
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
    giftPopoverTitle: 'Falls die Welt einmal zu laut wird',
    giftPopoverText:
      'darf dieser Ort dich daran erinnern,\ndass Rückzug nichts Falsches ist.\n\nManche Menschen brauchen Stille\nnicht weil sie fliehen,\nsondern weil sie fühlen.\n\nBleib einfach kurz hier.\n\nMehr musst du gerade nicht.',
    visual: {
      type: 'image',
      background: 'linear-gradient(180deg, #2d3748 0%, #1a202c 55%, #0f172a 100%)',
      overlayEffect: 'mist'
    },
    audio: { type: 'shoreline', volume: 0.24 },
    clickAreas: [
      { id: 'ca-ufer-1', targetRoomId: 'wintergarten', x: 10, y: 30, width: 25, height: 40, label: 'Das Glashaus hinter dem Dunst' },
      { id: 'ca-ufer-2', targetRoomId: 'stiller-innenhof', x: 70, y: 40, width: 25, height: 35, label: 'Ein stiller Hof mit Brunnenlicht' },
      { id: 'ca-ufer-3', targetRoomId: 'sandstrand', x: 40, y: 30, width: 20, height: 25, label: 'Der Weg zum offenen Meer' }
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
    thought: 'Das leise, beständige Plätschern des Brunnens rahmt die Stille des Gartens sanft ein. Wie das sich klärende Wasser bietet dieser Ort die Möglichkeit, die eigene Aufmerksamkeit ganz im Jetzt ruhen zu lassen.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 50% 60%, #27272a 0%, #18181b 60%, #09090b 100%)',
      overlayEffect: 'stone-drips'
    },
    audio: {
      type: 'silence',
      volume: 0.34,
      sampleLayer: {
        url: 'sound-effects/rain.mp3',
        volume: 0.52,
        fadeInSeconds: 0,
        loop: true,
        lowpass: 2600
      },
    },
    singleSounds: [
      {
        name: 'Keltische Flöte',
        type: 'sample',
        startImmediately: true,
        sample: {
          url: 'sound-effects/celtic-well.mp3',
          volume: 0.72,
          lowpass: 2400,
          fadeInSeconds: 3.5,
          fadeOutSeconds: 4
        },
        intervalMin: 120,
        intervalMax: 180
      }
    ],
    clickAreas: [
      { id: 'ca-hof-1', targetRoomId: 'bibliothek-nacht', x: 22, y: 14, width: 18, height: 24, label: 'Die warme Stube aus Holz und Papier' },
      { id: 'ca-hof-4', targetRoomId: 'leere-kirche', x: 85, y: 30, width: 20, height: 30, label: 'Die Kapelle voller fallendem Licht' },
      { id: 'ca-hof-2', targetRoomId: 'ufer-nebel', x: 5, y: 50, width: 20, height: 40, label: 'Der Steg durch den lichten Nebel' },
      { id: 'ca-hof-3', targetRoomId: 'hain', x: 75, y: 50, width: 20, height: 40, label: 'Ein Pfad unter alten Wurzeln' }
    ],
    transitionType: 'wasserreflexion',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#18181B',
    hasAblageGeste: false
  },
  {
    id: 'leere-kirche',
    name: 'Kapellenruine',
    emotionalWord: 'Weite',
    thought: 'Durch den eingestürzten Dachstuhl fällt ein friedliches Licht. Die verwitterten Mauern strahlen eine unaufgeregte Beständigkeit aus. Ein freier, urteilsfreier Raum, der einlädt, Gedanken einfach ziehen zu lassen.',
    visual: {
      type: 'image',
      background: 'radial-gradient(circle at 50% 18%, #473b2f 0%, #211b17 45%, #080706 100%)',
      overlayEffect: 'prayer-lights'
    },
    audio: {
      type: 'cathedral',
      volume: 0.04
    },
    singleSounds: [
      {
        name: 'Kirchenglocke',
        type: 'sample',
        startImmediately: true,
        sample: {
          url: 'sound-effects/glocke.mp3',
          volume: 0.72,
          lowpass: 2400
        },
        intervalMin: 30,
        intervalMax: 30
      }
    ],
    clickAreas: [
      { id: 'ca-kirche-1', targetRoomId: 'stiller-innenhof', x: 15, y: 58, width: 18, height: 28, label: 'Zurück zum Brunnen' },
      { id: 'ca-kirche-2', targetRoomId: 'bibliothek-nacht', x: 65, y: 55, width: 18, height: 42, label: 'Der Seitengang zur Lesestube' }
    ],
    transitionType: 'dunkelheit',
    movementIntensity: 'sehr_gering',
    colorTemperature: '#1B1713',
    hasAblageGeste: true
  },
  // 3 NEUE ORTE - VERBESSERT
  {
    id: 'hain',
    name: 'Behüteter Hain',
    emotionalWord: 'Geborgensein',
    thought: 'Ein friedlicher Pfad unter weiten Kronen, geschützt durch alte, verwurzelte Bäume. Ein natürlicher Rückzugsort, der zum unbeschwerten Verweilen einlädt und dem Geist erlaubt, eine offene Ruhe zu finden.',
    giftPopoverTitle: 'Ein Schatz für die Momente, in denen Nähe sich schwer anfühlt',
    giftPopoverText:
      'Zwischen den alten Wurzeln\nist etwas verborgen,\ndas man nicht sofort erkennt.\n\nErst wenn man stiller wird,\nbeginnt der Wald,\neine Form von Nähe sichtbar zu machen.\n\nVielleicht sind wir niemals ganz allein.\n\nVielleicht steht alles,\nwas uns umgibt,\nauf uns bezogen —\nwartend,\nantwortend,\ntragend.\n\nManche Begegnungen brauchen keine Worte.\n\nUnd manchmal fühlt sich selbst die Welt\nfür einen Augenblick so an,\nals würde sie uns halten.',
    visual: {
      type: 'image',
      background: 'radial-gradient(ellipse at 50% 0%, #3d4a25 0%, #1f2914 50%, #0d1208 100%)',
      overlayEffect: 'rays'
    },
    audio: {
      type: 'silence',
      volume: 0.34,
      sampleLayer: {
        url: 'sound-effects/hain.mp3',
        volume: 0.22,
        fadeInSeconds: 2.5,
        loop: true,
        lowpass: 2200
      }
    },
    clickAreas: [
      { id: 'ca-hain-1', targetRoomId: 'wintergarten', x: 20, y: 60, width: 20, height: 40, label: 'Zurück ins lichtdurchflutete Gewächshaus' },
      { id: 'ca-hain-2', targetRoomId: 'stiller-innenhof', x: 80, y: 60, width: 25, height: 35, label: 'Der Pfad zum Brunnenlicht' },
      { id: 'ca-hain-3', targetRoomId: 'sandstrand', x: 5, y: 45, width: 18, height: 18, label: 'Ein warmer Abstieg zum Abendstrand' }
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
    thought: 'Das beständige Vor und Zurück der Wellen begleitet den weich werdenden Abend. Ein offener Horizont, an dem Gedanken wie Treibholz mit der Strömung ziehen können – eine ruhige Kulisse, um den Tag entspannt loszulassen.',
    visual: {
      type: 'image',
      background: 'linear-gradient(180deg, #1e3542 0%, #2a4a5a 30%, #1c3a47 60%, #0f1f26 100%)',
      overlayEffect: 'waves'
    },
    audio: {
      type: 'ocean',
      volume: 0.05,
      sampleLayer: {
        url: 'sound-effects/deep-ocean.mp3',
        volume: 2.22,
        startDelay: 1,
        startOffset: 0.45,
        fadeInSeconds: 1.5,
        loop: true,
        lowpass: 1500,
        roomGainMultiplier: 0.58
      }
    },
    clickAreas: [
      { id: 'ca-strand-1', targetRoomId: 'ufer-nebel', x: 10, y: 45, width: 20, height: 45, label: 'Zurück über den lichten Nebelweg' },
      { id: 'ca-strand-2', targetRoomId: 'hain', x: 85, y: 65, width: 20, height: 40, label: 'Hinauf in den behüteten Hain' },
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
    audio: {
      type: 'silence',
      volume: 0.04,
      sampleLayer: {
        url: 'sound-effects/blaue-grotte.mp3',
        volume: 0.1,
        fadeInSeconds: 2,
        loop: false,
        lowpass: 2300
      }
    },
    clickAreas: [
      { id: 'ca-lagune-1', targetRoomId: 'sternwarte', x: 60, y: -5, width: 20, height: 38, label: 'Ein schmaler Felsgang zurück zur Sternwarte' },
      { id: 'ca-lagune-2', targetRoomId: 'sandstrand', x: 35, y: 78, width: 26, height: 26, label: 'Über warmen Stein hinaus zum Abendstrand' }
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
    assets: ['manifest.webmanifest']
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
    assets: ['manifest.webmanifest']
  }
];