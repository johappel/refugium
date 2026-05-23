# Refugium

Lokale Vite/React-Anwendung mit einer portablen Weitergabe-Variante für Windows.

## Was Besuchende im Refugium erleben können

Refugium ist als stiller digitaler Erfahrungsraum gedacht. Wer ihn betritt, soll nicht in erster Linie etwas erledigen, verstehen oder entscheiden müssen, sondern einen Ort vorfinden, in dem innere Anspannung für einen Moment weicher werden darf. Die Räume können emotional wie ein geschütztes Aufatmen wirken: als leise Entlastung, als freundliche Sammlung, als vorsichtige Rückkehr zu Atem, Körper und Gegenwart.

In seiner spirituellen und kontemplativen Qualität will das Refugium nichts behaupten und keine bestimmte Deutung vorgeben. Es bietet Weite statt Dogma, Resonanz statt Botschaft. Licht, Wetter, Architektur, Ferne, Wasser, Pflanzen, Nacht und Klang können ein Erleben von Verbundenheit, Demut, Trost oder stiller Offenheit begünstigen, ohne diese Empfindungen zu erzwingen. Die Erfahrung bleibt absichtlich frei: Manche Menschen spüren Ruhe, andere Trost, andere einfach nur eine Pause vom Druck des Alltags.

Ein tiefes positives Erlebnis wird durch eine innere Haltung begünstigt, die nicht auf Leistung, Kontrolle oder schnelle Wirkung ausgerichtet ist. Hilfreich sind Langsamkeit, freundliche Neugier, die Bereitschaft, nichts Bestimmtes erreichen zu müssen, und ein stilles Einverständnis damit, dass auch Unklarheit oder Schweigen wertvoll sein können. Refugium möchte nicht ablenken, antreiben oder optimieren, sondern einen Rahmen schaffen, in dem Besuchende sich selbst ohne Rechtfertigung wahrnehmen dürfen.

## Wie Gestaltung die Erfahrung verstärkt

Die grafischen Elemente tragen diese Wirkung, wenn sie Atmosphäre statt Reizdichte erzeugen. Lichtstimmungen, Tiefenräume, natürliche Oberflächen, Nebel, Regen, Sterne oder Wasserreflexionen können Orientierung über Stimmung geben, ohne zu laut zu werden. Animationen wirken dann stärkend, wenn sie verlangsamt, weich und atmend bleiben: ein leichtes Flirren, treibender Nebel, fallender Staub, ein fernes Schimmern. Nicht Spektakel, sondern die Glaubwürdigkeit eines ruhigen Ortes macht die Szene tragfähig.

Auch akustische Elemente entfalten ihre Stärke gerade durch Zurückhaltung. Leise Raumsounds, entfernte Naturklänge, vereinzelte Einzeltöne und behutsame Filterung können den Eindruck von Schutz, Tiefe und Gegenwart verstärken. Wichtig ist, dass Klang nicht besetzt, sondern offen lässt. Stille ist deshalb kein Mangel, sondern ein zentrales Gestaltungsmittel: Sie schafft Luft zwischen den Eindrücken, gibt dem Erleben Würde und verhindert emotionale Überformung.

Reduktion und Verlangsamung sind keine Verzichtsgesten, sondern Teil der Wirkung. Weniger gleichzeitige Reize, weniger visuelle Komplexität, weniger abrupte Übergänge und weniger akustischer Druck helfen, dass Aufmerksamkeit nicht zersplittert. Das Refugium gewinnt an Tiefe, wenn nicht alles sofort passiert. Verzögerung, Ruhe und Leere können hier genauso tragend sein wie Bilder oder Klänge.

## Fokus ohne Manipulation

Der Fokus bleibt erhalten, wenn die Gestaltung klar führt, ohne zu drücken. Dazu gehören lesbare visuelle Schwerpunkte, nachvollziehbare Blickachsen, sanfte Übergänge zwischen Räumen, eine begrenzte Zahl an Interaktionspunkten und eine konsistente atmosphärische Sprache. Solche Mittel stärken Orientierung und Sicherheit, ohne Verhalten vorzuschreiben.

Entscheidend ist, dass keine Ebene den Menschen zu einer bestimmten Emotion, Einsicht oder Handlung bewegen soll. Refugium soll weder belehren noch subtil lenken. Es darf einladen, aber nicht drängen; andeuten, aber nicht definieren; halten, aber nicht festhalten. Die Freiheit der Besuchenden bleibt zentral: Sie dürfen verweilen, weitergehen, nichts fühlen, viel fühlen, abbrechen oder zurückkehren. Genau diese Offenheit macht die Erfahrung glaubwürdig und respektvoll.

## Entwicklung

- `pnpm install`
- `pnpm build`
- `pnpm dev`

## Portable ZIP erzeugen

Das ZIP für die lokale Weitergabe wird über `scripts/package-portable.ps1` erzeugt.

Schnellstart:

- `npm run package:portable`

Mit beigelegtem Server-Binary (`miniserve.exe`):

- `npm run package:portable:binary`

Direkt per PowerShell:

- `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\package-portable.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\package-portable.ps1 -IncludeMiniserve`

Optional kann das bevorzugte Windows-x64-Binary separat geladen werden:

- `npm run download:miniserve`

Ergebnis:

- `portable/app` enthält die gebaute Web-App
- `portable/server/miniserve.exe` enthält optional das Server-Binary
- `release/refugium-portable.zip` ist das weiterzugebende Archiv

## Auf GitHub deployen

Für das Repository ist jetzt ein GitHub-Pages-Workflow hinterlegt: `.github/workflows/deploy-pages.yml`.

Ablauf:

- Repository nach GitHub pushen
- In GitHub unter `Settings > Pages` als Quelle `GitHub Actions` verwenden
- Danach bei jedem Push auf `main` automatisch deployen
- Alternativ den Workflow manuell über `Actions > Deploy GitHub Pages > Run workflow` starten

Hinweise:

- Die App wird aus `dist` veröffentlicht
- Der Build läuft im Workflow mit `pnpm install --frozen-lockfile` und `pnpm build`
- Durch `base: './'` in `vite.config.ts` funktioniert die Ausgabe auch unter einer Projekt-Unterseite auf GitHub Pages

Weitere Hinweise zur portablen Nutzung stehen in `portable/README.txt`.
