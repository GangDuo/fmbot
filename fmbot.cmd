@echo off
pushd "%~dp0"
set "PATH=%~dp0;%PATH%"
set "FMBOT_HOME=%~dp0"

IF /I %1 EQU install (
  call :SHOW_LOGO
  call .\.bin\install
) ELSE IF /I %1 EQU run (
  call :SHOW_LOGO
  call .\.bin\run %2
) ELSE (
  echo 存在しないコマンドです。
)
exit /b

:SHOW_LOGO
echo.
echo "              ________  _______  ____  ______
echo "             / ____/  |/  / __ )/ __ \/_  __/
echo "            / /_  / /|_/ / __  / / / / / /   
echo "           / __/ / /  / / /_/ / /_/ / / /    
echo "          /_/   /_/  /_/_____/\____/ /_/     
echo.
exit /b
