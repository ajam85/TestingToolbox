@echo off
title Diagnostika
echo ============================================
echo  Diagnostika prostredi
echo ============================================
echo.

echo -- Node.js --
node --version 2>&1
echo.

echo -- npm --
npm --version 2>&1
echo.

echo -- Obsah teto slozky --
dir /b
echo.

echo -- Zkousim npm install --
npm install 2>&1
echo.
echo Navratovy kod: %ERRORLEVEL%
echo.
pause
