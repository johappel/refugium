# Refugium

Lokale Vite/React-Anwendung mit einer portablen Weitergabe-Variante fuer Windows.

## Entwicklung

- `pnpm install`
- `pnpm build`
- `pnpm dev`

## Portable ZIP erzeugen

Das ZIP fuer die lokale Weitergabe wird ueber `scripts/package-portable.ps1` erzeugt.

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

- `portable/app` enthaelt die gebaute Web-App
- `portable/server/miniserve.exe` enthaelt optional das Server-Binary
- `release/refugium-portable.zip` ist das weiterzugebende Archiv

## Auf GitHub deployen

Fuer das Repository ist jetzt ein GitHub-Pages-Workflow hinterlegt: `.github/workflows/deploy-pages.yml`.

Ablauf:

- Repository nach GitHub pushen
- In GitHub unter `Settings > Pages` als Quelle `GitHub Actions` verwenden
- Danach bei jedem Push auf `main` automatisch deployen
- Alternativ den Workflow manuell ueber `Actions > Deploy GitHub Pages > Run workflow` starten

Hinweise:

- Die App wird aus `dist` veroeffentlicht
- Der Build laeuft im Workflow mit `pnpm install --frozen-lockfile` und `pnpm build`
- Durch `base: './'` in `vite.config.ts` funktioniert die Ausgabe auch unter einer Projekt-Unterseite auf GitHub Pages

Weitere Hinweise zur portablen Nutzung stehen in `portable/README.txt`.