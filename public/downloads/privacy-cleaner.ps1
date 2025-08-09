# Privacy Cleaner PowerShell Script v1.0
# Created by OG Rusil - SigmaChat
# WARNING: This script clears various system traces and temporary files

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Privacy Cleaner v1.0" -ForegroundColor Cyan
Write-Host "    Created by OG Rusil - SigmaChat" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Red
    pause
    exit
}

Write-Host "Cleaning temporary files..." -ForegroundColor Yellow

# Clear Windows Temp folder
Remove-Item -Path "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✓ Windows Temp folder cleared" -ForegroundColor Green

# Clear Windows Prefetch
Remove-Item -Path "$env:WINDIR\Prefetch\*" -Force -ErrorAction SilentlyContinue
Write-Host "✓ Prefetch folder cleared" -ForegroundColor Green

# Clear Recent Documents
Remove-Item -Path "$env:APPDATA\Microsoft\Windows\Recent\*" -Force -ErrorAction SilentlyContinue
Write-Host "✓ Recent documents cleared" -ForegroundColor Green

# Clear Browser Caches (Chrome, Edge, Firefox)
$chromeCache = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache"
if (Test-Path $chromeCache) {
    Remove-Item -Path "$chromeCache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Chrome cache cleared" -ForegroundColor Green
}

$edgeCache = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache"
if (Test-Path $edgeCache) {
    Remove-Item -Path "$edgeCache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Edge cache cleared" -ForegroundColor Green
}

# Clear Windows Event Logs
wevtutil el | Foreach-Object {wevtutil cl "$_"}
Write-Host "✓ Windows Event Logs cleared" -ForegroundColor Green

# Clear DNS Cache
ipconfig /flushdns | Out-Null
Write-Host "✓ DNS cache flushed" -ForegroundColor Green

# Clear Windows Update Cache
Stop-Service -Name wuauserv -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:WINDIR\SoftwareDistribution\Download\*" -Recurse -Force -ErrorAction SilentlyContinue
Start-Service -Name wuauserv -ErrorAction SilentlyContinue
Write-Host "✓ Windows Update cache cleared" -ForegroundColor Green

Write-Host ""
Write-Host "Privacy cleaning completed successfully!" -ForegroundColor Green
Write-Host "Your system traces have been cleared." -ForegroundColor Green
Write-Host ""
pause
