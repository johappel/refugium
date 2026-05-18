param(
  [Parameter(Mandatory = $true)]
  [string]$AppDir,
  [int[]]$PreferredPorts = @(4173, 4174, 4175, 4180),
  [switch]$NoOpenBrowser,
  [switch]$ValidateOnly
)

$ErrorActionPreference = "Stop"

function Get-ContentType {
  param([string]$Path)

  switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".html" { return "text/html; charset=utf-8" }
    ".js" { return "application/javascript; charset=utf-8" }
    ".css" { return "text/css; charset=utf-8" }
    ".json" { return "application/json; charset=utf-8" }
    ".webmanifest" { return "application/manifest+json; charset=utf-8" }
    ".svg" { return "image/svg+xml" }
    ".png" { return "image/png" }
    ".jpg" { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".webp" { return "image/webp" }
    ".mp3" { return "audio/mpeg" }
    ".wav" { return "audio/wav" }
    ".ico" { return "image/x-icon" }
    default { return "application/octet-stream" }
  }
}

function Get-FreePrefix {
  param([int[]]$Ports)

  foreach ($port in $Ports) {
    $probe = $null
    try {
      $probe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
      $probe.Start()
      $probe.Stop()
      return "http://127.0.0.1:$port/"
    }
    catch {
      if ($probe) {
        try { $probe.Stop() } catch {}
      }
    }
  }

  throw "Kein freier Port gefunden."
}

$resolvedAppDir = (Resolve-Path $AppDir).Path
$prefix = Get-FreePrefix -Ports $PreferredPorts

if ($ValidateOnly) {
  Write-Host "Validierung erfolgreich."
  Write-Host "AppDir: $resolvedAppDir"
  Write-Host "URL: $prefix"
  exit 0
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host "Refugium wird bereitgestellt unter $prefix"
Write-Host "Beenden mit Strg+C"

if (-not $NoOpenBrowser) {
  Start-Process $prefix | Out-Null
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    try {
      $requestedPath = [System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
      if ([string]::IsNullOrWhiteSpace($requestedPath)) {
        $requestedPath = 'index.html'
      }

      $relativePath = $requestedPath -replace '/', '\\'
      $candidatePath = Join-Path $resolvedAppDir $relativePath

      if ((Test-Path $candidatePath) -and (Get-Item $candidatePath).PSIsContainer) {
        $candidatePath = Join-Path $candidatePath 'index.html'
      }

      if (-not (Test-Path $candidatePath -PathType Leaf)) {
        $candidatePath = Join-Path $resolvedAppDir 'index.html'
      }

      $response = $context.Response
      $response.StatusCode = 200
      $response.ContentType = Get-ContentType -Path $candidatePath

      $bytes = [System.IO.File]::ReadAllBytes($candidatePath)
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    catch {
      try {
        $context.Response.StatusCode = 500
        $errorBytes = [System.Text.Encoding]::UTF8.GetBytes("Interner Serverfehler")
        $context.Response.ContentLength64 = $errorBytes.Length
        $context.Response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
      }
      catch {}
    }
    finally {
      try { $context.Response.OutputStream.Close() } catch {}
    }
  }
}
finally {
  if ($listener.IsListening) {
    $listener.Stop()
  }
  $listener.Close()
}