Refugium Portable

Dieser Ordner ist fuer die lokale Weitergabe ohne Node gedacht.

Inhalt:
- start-refugium.bat startet bevorzugt ein beigelegtes Server-Binary
- serve-refugium.ps1 ist der eingebaute PowerShell-Fallback
- app enthaelt die gebaute Web-App (Kopie von dist)
- optional: server\miniserve.exe oder server\caddy.exe

So verwendest du das Paket:
1. Den gesamten Ordner portable weitergeben oder als ZIP verpacken.
2. Auf dem Zielrechner entpacken.
3. start-refugium.bat doppelklicken.
4. Der Browser oeffnet sich automatisch auf localhost.

Hinweise:
- Es wird kein Node benoetigt.
- Ohne beigelegtes Server-Binary ist Windows PowerShell erforderlich.
- Wenn ein Port belegt ist, probiert das Skript automatisch mehrere localhost-Ports.
- Wenn du miniserve.exe oder caddy.exe in portable\server ablegst, wird diese Variante bevorzugt.
- Empfohlene Binary-Variante: miniserve.exe (Windows x64)

Fuer Entwickler:
- Zum Aktualisieren des portable/app-Ordners und Erzeugen eines ZIPs: scripts\package-portable.ps1
- Konkreten Windows-x64-Download holen: scripts\download-miniserve.ps1
- Alles in einem Schritt bauen und mit miniserve verpacken: npm run package:portable:binary