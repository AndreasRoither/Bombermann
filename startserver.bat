
@echo off
echo ------------------------------------------------ 
echo -- Batch ran on %date% at %time% --
echo ------------------------------------------------
cd .\nodejs
echo.
:loop
echo Starting Server via .bat
echo Server started
node index.js echo.>>logfile.txt 2>> errorlog.txt
echo.
echo Server crashed
echo.
echo. >>logfile.txt 2>> errorlog.txt
echo Server crashed >>logfile.txt 2>> errorlog.txt
echo. >>logfile.txt 2>> errorlog.txt
echo ---------------------------
echo -- Restart at %time% --
echo ---------------------------
goto loop
pause