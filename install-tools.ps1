# TA Project - Auto Install Tools
# Chay: powershell -ExecutionPolicy Bypass -File install-tools.ps1

$ErrorActionPreference = "Continue"
$ToolsDir = "$HOME\.claude-tools"
New-Item -ItemType Directory -Force -Path $ToolsDir | Out-Null
New-Item -ItemType Directory -Force -Path "$ToolsDir\repos" | Out-Null

Write-Host "[1/4] Cai npm global tools..." -ForegroundColor Yellow

$npmTools = @("repomix", "@openai/codex", "claude-code-router")
foreach ($pkg in $npmTools) {
    Write-Host "  -> $pkg" -NoNewline
    npm install -g $pkg --silent 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green }
    else { Write-Host " SKIP" -ForegroundColor DarkYellow }
}

Write-Host "[2/4] Dang ky MCP servers..." -ForegroundColor Yellow

claude mcp add repomix npx "-y" "repomix" "--mcp" 2>&1 | Out-Null
Write-Host "  -> repomix MCP OK" -ForegroundColor Green

claude mcp add playwright npx "-y" "@playwright/mcp@latest" 2>&1 | Out-Null
Write-Host "  -> playwright MCP OK" -ForegroundColor Green

Write-Host "[3/4] Clone repos..." -ForegroundColor Yellow

$repos = @(
    @{ url = "https://github.com/anthropics/anthropic-cookbook"; dir = "anthropic-cookbook" },
    @{ url = "https://github.com/punkpeye/awesome-mcp-servers"; dir = "awesome-mcp-servers" },
    @{ url = "https://github.com/yamadashy/repomix"; dir = "repomix-src" },
    @{ url = "https://github.com/musistudio/claude-code-router"; dir = "claude-code-router" }
)

foreach ($repo in $repos) {
    $dest = "$ToolsDir\repos\$($repo.dir)"
    if (-not (Test-Path $dest)) {
        Write-Host "  -> Cloning $($repo.dir)..." -NoNewline
        git clone --depth=1 --quiet $repo.url $dest 2>&1 | Out-Null
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host "  -> $($repo.dir) da co" -ForegroundColor DarkYellow
    }
}

Write-Host "[4/4] Cai VS Code extensions..." -ForegroundColor Yellow

$extensions = @(
    "deepseek.deepseek-vscode",
    "eamodio.gitlens",
    "bradlc.vscode-tailwindcss",
    "PKief.material-icon-theme"
)

foreach ($ext in $extensions) {
    Write-Host "  -> $ext" -NoNewline
    code --install-extension $ext --force 2>&1 | Out-Null
    Write-Host " OK" -ForegroundColor Green
}

Write-Host ""
Write-Host "Hoan tat! Tools da duoc cai dat." -ForegroundColor Cyan
Write-Host "Tools dir: $ToolsDir" -ForegroundColor Cyan
