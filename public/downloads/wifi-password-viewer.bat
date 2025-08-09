@echo off
echo ========================================
echo    WiFi Password Viewer v1.0
echo    Created by OG Rusil - SigmaChat
echo ========================================
echo.
echo This tool will show all saved WiFi passwords on this computer
echo.
pause

echo Retrieving saved WiFi networks and passwords...
echo.
echo ========================================
echo    SAVED WIFI NETWORKS & PASSWORDS
echo ========================================
echo.

REM Get all WiFi profiles
for /f "skip=9 tokens=1,2 delims=:" %%i in ('netsh wlan show profiles') do (
    if not "%%j"=="" (
        set "profile=%%j"
        setlocal enabledelayedexpansion
        set "profile=!profile:~1!"
        echo Network: !profile!
        
        REM Get password for each profile
        for /f "skip=1 tokens=2 delims=:" %%k in ('netsh wlan show profile name^="!profile!" key^=clear ^| findstr "Key Content"') do (
            set "password=%%k"
            set "password=!password:~1!"
            echo Password: !password!
        )
        echo ----------------------------------------
        endlocal
    )
)

echo.
echo All saved WiFi passwords have been displayed above.
echo.
echo NOTE: This only shows networks that were connected to on this computer.
echo If no password is shown, the network might use a different security type.
echo.
pause
