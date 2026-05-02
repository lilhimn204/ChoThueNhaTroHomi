param(
  [string]$TunnelName = "homi",
  [string]$OriginUrl = "http://127.0.0.1:3000",
  [int]$TimeoutSeconds = 180,
  [switch]$NoBuild,
  [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

if (-not $NoBuild) {
  Write-Host "Starting Homi Docker services..."
  docker compose up --build -d
} else {
  Write-Host "Skipping Docker build/start because -NoBuild was passed."
}

Write-Host "Waiting for frontend origin at $OriginUrl ..."
$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
$ready = $false
$lastError = $null

while ((Get-Date) -lt $deadline) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $OriginUrl -TimeoutSec 5

    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
      $ready = $true
      break
    }

    $lastError = "Unexpected status code: $($response.StatusCode)"
  } catch {
    $lastError = $_.Exception.Message
  }

  Start-Sleep -Seconds 2
}

if (-not $ready) {
  throw "Frontend origin did not become ready within $TimeoutSeconds seconds. Last error: $lastError"
}

Write-Host "Frontend origin is ready."

if ($CheckOnly) {
  Write-Host "Check complete. Tunnel was not started because -CheckOnly was passed."
  exit 0
}

Write-Host "Starting Cloudflare tunnel '$TunnelName'..."
cloudflared tunnel run $TunnelName
