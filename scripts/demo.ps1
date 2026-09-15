$ErrorActionPreference = "Stop"
$ProjectDirectory = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectDirectory

if (-not (Test-Path "node_modules")) {
  npm install
}

Write-Host "Starting the AIDOS presentation at http://localhost:5173" -ForegroundColor Green
Write-Host "Open docs/DEMO_SCRIPT.md for the five-minute walkthrough."
npm run demo
