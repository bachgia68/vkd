# Claude boss -> Ollama codes
# Usage: .\ollama-code.ps1 "mo ta task" [file1] [file2]
# Example: .\ollama-code.ps1 "them progress bar vao MaiStudio" src/components/mai/MaiStudio.tsx

param(
    [Parameter(Mandatory=$true)]
    [string]$Task,
    [string[]]$Files = @()
)

$model = "ollama/qwen2.5-coder:7b"
$projectDir = "D:\TA page\site\ta_production\project"

Set-Location $projectDir

Write-Host "=== Ollama Coder ===" -ForegroundColor Cyan
Write-Host "Model: $model" -ForegroundColor DarkGray
Write-Host "Task: $Task" -ForegroundColor Yellow
Write-Host ""

if ($Files.Count -gt 0) {
    $fileArgs = $Files -join " "
    Write-Host "Files: $fileArgs" -ForegroundColor DarkGray
    Invoke-Expression "aider --model $model --message `"$Task`" $fileArgs"
} else {
    aider --model $model --message $Task
}
