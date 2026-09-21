# TestingToolbox

Nástroj pro manuální testování software.

## Sestavení portable .exe

```
npm ci
npx electron-builder --win portable
```

Výsledek bude v `dist/TestingToolbox-Portable-27.0.0.exe` (název je řízen verzí z `package.json`).

PDF generátor vytváří skutečný PDF dokument s platnou strukturou, zatímco TXT a CSV používají čitelný testovací obsah. Import JSONu je omezen velikostí a počtem/délkou položek; poškozená data se do aplikace nezapíšou.
