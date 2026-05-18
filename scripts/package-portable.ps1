param(
  [string]$SourceDir = "dist",
  [string]$PortableDir = "portable",
  [string]$ReleaseDir = "release",
  [switch]$IncludeMiniserve,
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $repoRoot $SourceDir
$portablePath = Join-Path $repoRoot $PortableDir
$appPath = Join-Path $portablePath "app"
$releasePath = Join-Path $repoRoot $ReleaseDir
$zipPath = Join-Path $releasePath "refugium-portable.zip"
$serverPath = Join-Path $portablePath "server"
$miniservePath = Join-Path $serverPath "miniserve.exe"

if (-not (Test-Path $sourcePath -PathType Container)) {
  throw "Build-Ausgabe nicht gefunden: $sourcePath"
}

if (-not $SkipBuild) {
  Push-Location $repoRoot
  try {
    & npm run build
    if ($LASTEXITCODE -ne 0) {
      throw "Build fehlgeschlagen."
    }
  }
  finally {
    Pop-Location
  }
}

if ($IncludeMiniserve) {
  Push-Location $repoRoot
  try {
    & powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\download-miniserve.ps1
    if ($LASTEXITCODE -ne 0) {
      throw "miniserve-Download fehlgeschlagen."
    }
  }
  finally {
    Pop-Location
  }
}

New-Item -ItemType Directory -Force -Path $portablePath | Out-Null
New-Item -ItemType Directory -Force -Path $releasePath | Out-Null

if (Test-Path $appPath) {
  Remove-Item -Path $appPath -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $appPath | Out-Null
Copy-Item -Path (Join-Path $sourcePath "*") -Destination $appPath -Recurse -Force

if (Test-Path $miniservePath) {
  Write-Host "Server-Binary wird mit verpackt: $miniservePath"
}

if (Test-Path $zipPath) {
  Remove-Item -Path $zipPath -Force
}

Compress-Archive -Path (Join-Path $portablePath "*") -DestinationPath $zipPath -Force

Write-Host "Portable Paket aktualisiert: $portablePath"
Write-Host "ZIP erstellt: $zipPath"