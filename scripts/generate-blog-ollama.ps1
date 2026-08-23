# Blog Post Generation Script (Ollama local)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$topics = @(
    "Rung Ngoc Linh - Hanh trinh cay sam hoang da",
    "Mua thu o Ngoc Linh - Khi thien nhien tao nen ky tich",
    "Nep song mien nui va sam hoang da - Lich su gan lien",
    "Sam Ngoc Linh - Quy hiem trong tay nhung nguoi nong dan",
    "Lam dep tu nhien - Bi quyet tu cay sam ngan nam",
    "Sam hoang da vs sam trong - Su khac biet ma ban can biet",
    "Qua tang vang - Tai sao Sam Ngoc Linh la lua chon hoan hao",
    "Doi song khoe manh voi ho tro tu thien nhien",
    "Ngoc Linh - Cau chuyen ve tinh yeu va bao ve thien nhien"
)

$outputDir = "generated-posts"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory $outputDir | Out-Null
}

Write-Host "Generating 9 blog posts via Ollama..."

$posts = @()
$counter = 1

foreach ($topic in $topics) {
    Write-Host "[$counter/9] $topic"

    $prompt = "Write a KGC luxury blog post about: $topic. Vietnamese, 800-1200 words, educational tone, NO medical claims."

    try {
        $response = Invoke-WebRequest `
            -Uri "http://localhost:11434/api/generate" `
            -Method POST `
            -ContentType "application/json" `
            -Body (@{ model = "qwen2.5:7b-instruct"; prompt = $prompt; stream = $false } | ConvertTo-Json) `
            -UseBasicParsing

        $json = $response.Content | ConvertFrom-Json
        $content = $json.response
        $filename = "$outputDir/post-$counter.md"

        $content | Out-File -FilePath $filename -Encoding UTF8

        $posts += @{ topic = $topic; file = $filename }
        Write-Host "  OK"
    }
    catch {
        Write-Host "  ERROR: $_"
    }

    $counter++
}

Write-Host "Generated: $($posts.Count)/9"
Write-Host "Output: $outputDir/"

@{ generated = (Get-Date -Format "yyyy-MM-dd"); count = $posts.Count } | ConvertTo-Json | Out-File "$outputDir/manifest.json" -Encoding UTF8
