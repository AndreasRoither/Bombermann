
@echo off
echo ------------------------------------------------ 
echo -- Batch Ran on %date% at %time% --
echo ------------------------------------------------
cd .\nodejs
echo.
:loop
echo Starting Server via .bat
node index.js echo.>>logfile.txt 2>> errorlog.txt
goto loop
pause