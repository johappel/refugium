param(
  [string]$Version = '0.35.0',
  [string]$TargetDir = 'portable/server',
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$resolvedTargetDir = Join-Path $repoRoot $TargetDir
$targetFile = Join-Path $resolvedTargetDir 'miniserve.exe'
$downloadUrl = "https://github.com/svenstaro/miniserve/releases/download/v$Version/miniserve-$Version-x86_64-pc-windows-msvc.exe"

New-Item -ItemType Directory -Force -Path $resolvedTargetDir | Out-Null

if ((Test-Path $targetFile) -and -not $Force) {
  Write-Host "miniserve.exe ist bereits vorhanden: $targetFile"
  Write-Host "Mit -Force wird die Datei erneut geladen."
  exit 0
}

Write-Host "Lade miniserve v$Version herunter ..."
Invoke-WebRequest -Uri $downloadUrl -OutFile $targetFile
Write-Host "Download abgeschlossen: $targetFile"