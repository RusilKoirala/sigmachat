@echo off
echo ========================================
echo    Windows Bloatware Cleaner v1.0
echo    Created by OG Rusil - SigmaChat
echo ========================================
echo.
echo WARNING: This will remove Windows bloatware apps
echo Make sure to create a system restore point first!
echo.
pause

echo Removing Windows bloatware apps...

REM Remove common bloatware apps
powershell -Command "Get-AppxPackage *3dbuilder* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *windowsalarms* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *windowscommunicationsapps* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *windowscamera* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *officehub* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *skypeapp* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *getstarted* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *zunemusic* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *windowsmaps* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *solitairecollection* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *bingfinance* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *bingnews* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *bingsports* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *bingweather* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage *xboxapp* | Remove-AppxPackage"

echo.
echo Bloatware removal completed!
echo Your system should now be cleaner and faster.
echo.
pause
