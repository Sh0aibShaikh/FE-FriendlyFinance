# Friendly Finance Frontend - Quick Start Script

Write-Host ""
Write-Host "========================================"
Write-Host "  Friendly Finance Frontend"
Write-Host "  Starting Development Server"
Write-Host "========================================"
Write-Host ""

# Navigate to the correct directory
Set-Location FE-FriendlyFinance

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
    Write-Host ""
}

# Start the development server
Write-Host "Starting development server..."
Write-Host ""
npm run dev

Read-Host "Press Enter to exit"

