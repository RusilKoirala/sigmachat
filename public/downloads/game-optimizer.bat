@echo off
echo ========================================
echo    Game Performance Optimizer v1.0
echo    Created by OG Rusil - SigmaChat
echo ========================================
echo.
echo This will optimize your system for gaming performance
echo Make sure to close all games before running!
echo.
pause

echo Applying gaming optimizations...

REM Disable Windows Game Mode (can cause issues)
reg add "HKCU\Software\Microsoft\GameBar" /v "AutoGameModeEnabled" /t REG_DWORD /d 0 /f

REM Disable Fullscreen Optimizations
reg add "HKCU\System\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\GameDVR" /v "AllowGameDVR" /t REG_DWORD /d 0 /f

REM Set High Performance Power Plan
powercfg -setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

REM Disable Windows Search Indexing for better performance
sc config "WSearch" start= disabled

REM Set GPU scheduling to hardware accelerated
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "HwSchMode" /t REG_DWORD /d 2 /f

REM Optimize mouse settings for gaming
reg add "HKCU\Control Panel\Mouse" /v "MouseHoverTime" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Mouse" /v "MouseSpeed" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold1" /t REG_SZ /d "0" /f
reg add "HKCU\Control Panel\Mouse" /v "MouseThreshold2" /t REG_SZ /d "0" /f

REM Disable Windows Defender real-time protection (temporarily)
echo NOTE: Windows Defender will be temporarily disabled
echo You can re-enable it in Windows Security settings
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableRealtimeMonitoring" /t REG_DWORD /d 1 /f

echo.
echo Gaming optimizations applied successfully!
echo Restart your computer for all changes to take effect.
echo.
pause
