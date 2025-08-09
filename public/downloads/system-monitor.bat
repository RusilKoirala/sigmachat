@echo off
title System Monitor - Real Time Stats
color 0A
echo ========================================
echo    System Monitor v1.0
echo    Created by OG Rusil - SigmaChat
echo ========================================
echo.
echo Real-time system performance monitoring
echo Press Ctrl+C to exit
echo.
pause

:monitor
cls
echo ========================================
echo    SYSTEM PERFORMANCE MONITOR
echo ========================================
echo Current Time: %date% %time%
echo ----------------------------------------

REM CPU Usage
for /f "skip=1" %%p in ('wmic cpu get loadpercentage /value') do (
    for /f "tokens=2 delims==" %%i in ("%%p") do (
        if not "%%i"=="" echo CPU Usage: %%i%%
    )
)

REM Memory Usage
for /f "skip=1" %%p in ('wmic OS get TotalVisibleMemorySize /value') do (
    for /f "tokens=2 delims==" %%i in ("%%p") do (
        if not "%%i"=="" set totalmem=%%i
    )
)

for /f "skip=1" %%p in ('wmic OS get FreePhysicalMemory /value') do (
    for /f "tokens=2 delims==" %%i in ("%%p") do (
        if not "%%i"=="" set freemem=%%i
    )
)

set /a usedmem=%totalmem%-%freemem%
set /a mempercent=(%usedmem%*100)/%totalmem%
echo Memory Usage: %mempercent%%%

REM Disk Usage for C: drive
for /f "tokens=3" %%a in ('dir C:\ /-c ^| find "bytes free"') do set freespace=%%a
for /f "tokens=1" %%a in ('dir C:\ /-c ^| find "bytes free"') do set totalspace=%%a

echo ----------------------------------------
echo Network Connections:
netstat -an | find "ESTABLISHED" | find /c ":"

echo ----------------------------------------
echo Top Processes by CPU:
wmic process get name,processid,percentprocessortime /format:table

echo ----------------------------------------
echo Waiting 5 seconds for next update...
timeout /t 5 /nobreak >nul
goto monitor
