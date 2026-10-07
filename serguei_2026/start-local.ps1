$ErrorActionPreference = 'Stop'
$previewNode = (Get-Command node -ErrorAction Stop).Source
$previewScript = Join-Path $PSScriptRoot 'tools\serve-local.cjs'
$previewUrl = 'http://127.0.0.1:8080/'
try { $previewResponse = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 1 } catch { $previewResponse = $null }
if (-not $previewResponse) {
    Start-Process -FilePath $previewNode -ArgumentList ('"' + $previewScript + '"') -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
    for ($previewAttempt = 0; $previewAttempt -lt 20; $previewAttempt++) {
        try { $previewResponse = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 1; break } catch { Start-Sleep -Milliseconds 100 }
    }
}
if (-not $previewResponse) { throw 'Could not start the local preview on port 8080.' }
Start-Process $previewUrl
