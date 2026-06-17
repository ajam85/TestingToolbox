@echo off
title TestingToolbox - sestaveni
echo ============================================
echo  TestingToolbox - sestaveni portable .exe
echo ============================================
echo.

where node >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo CHYBA: Node.js neni nainstalovan.
  echo Stahni na: https://nodejs.org  ^(LTS verze^)
  pause
  exit /b 1
)

echo Node.js: & node --version
echo npm:     & npm --version
echo.

echo [1/2] Instalace zavislosti...
npm install
IF %ERRORLEVEL% NEQ 0 ( echo CHYBA: npm install selhal & pause & exit /b 1 )

echo.
echo [2/2] Sestavovani portable .exe ^(bez podepisovani^)...
set CSC_LINK=
set CSC_KEY_PASSWORD=
set WIN_CSC_LINK=
npx electron-builder --win --x64
IF %ERRORLEVEL% NEQ 0 ( echo CHYBA: Sestaveni selhalo & pause & exit /b 1 )

echo.
echo ============================================
echo  HOTOVO! Soubor je ve slozce dist\
echo ============================================
dir dist\TestingToolbox.exe 2>nul || dir dist\*.exe 2>nul
echo.
pause
