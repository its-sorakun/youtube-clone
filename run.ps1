Write-Host "Setting up YouTube Clone..." -ForegroundColor Cyan

if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js (npm) is not installed or not in your PATH." -ForegroundColor Red
    exit 1
}

Write-Host "`n[1/3] Cloning repository..." -ForegroundColor Yellow
git clone https://github.com/its-sorakun/youtube-clone.git
Set-Location youtube-clone

Write-Host "`n[2/3] Installing frontend dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n[3/3] Installing backend dependencies and seeding database..." -ForegroundColor Yellow
Push-Location backend
npm install

node seed.js
Pop-Location

Write-Host "`nSetup complete! Starting servers..." -ForegroundColor Green
Write-Host "Backend will open in a new PowerShell window." -ForegroundColor Gray

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
npm run dev
