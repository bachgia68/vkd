# Setup script for TA Project - Windows PowerShell
# Run: powershell -ExecutionPolicy Bypass -File SETUP.ps1

Write-Host "🚀 TA Project Setup" -ForegroundColor Cyan

# 1. Check prerequisites
Write-Host "`n✓ Checking prerequisites..." -ForegroundColor Yellow
$checks = @(
    @{ name = "Git"; cmd = "git --version" },
    @{ name = "Docker"; cmd = "docker --version" },
    @{ name = "Node.js"; cmd = "node --version" },
    @{ name = "Python"; cmd = "python --version" }
)

foreach ($check in $checks) {
    $result = & $check.cmd 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $($check.name): $result" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $($check.name): NOT FOUND (install required)" -ForegroundColor Red
    }
}

# 2. Setup .env
Write-Host "`n✓ Setting up .env..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "  Created .env (please edit with your tokens)" -ForegroundColor Green
} else {
    Write-Host "  .env already exists" -ForegroundColor Green
}

# 3. Install Node dependencies
Write-Host "`n✓ Installing Node dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
npm install framer-motion shadcn-ui next-intl umami

# 4. Install Python dependencies
Write-Host "`n✓ Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt 2>$null || Write-Host "  requirements.txt not found (optional)" -ForegroundColor Yellow

# 5. Start Docker services
Write-Host "`n✓ Starting Docker services..." -ForegroundColor Yellow
docker-compose up -d
Write-Host "  Waiting for services..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# 6. Status check
Write-Host "`n✓ Service status:" -ForegroundColor Yellow
docker ps --filter "name=ta-" --format "table {{.Names}}\t{{.Status}}"

# 7. Display access URLs
Write-Host "`n✓ Access URLs:" -ForegroundColor Green
Write-Host "  n8n:     http://localhost:5678" -ForegroundColor Cyan
Write-Host "  Strapi:  http://localhost:1337" -ForegroundColor Cyan
Write-Host "  Ollama:  http://localhost:11434" -ForegroundColor Cyan
Write-Host "  Upscayl: http://localhost:7860" -ForegroundColor Cyan

# 8. Next steps
Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Edit .env with your API tokens (Replicate, Strapi, etc.)" -ForegroundColor White
Write-Host "  2. Read TASK_1_SETUP.md to start Phase 1 (Images)" -ForegroundColor White
Write-Host "  3. Read TASK_5_SETUP.md to start Phase 2 (Chatbot)" -ForegroundColor White
Write-Host "  4. Read PHASE_3_TASKS.md to start Phase 3 (Frontend)" -ForegroundColor White
Write-Host "  5. npm run dev (to start Next.js dev server)" -ForegroundColor White

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
