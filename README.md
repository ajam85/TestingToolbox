# TestingToolbox

Nástroj pro manuální testování software.

## Sestavení portable .exe

```
npm ci
npx electron-builder --win portable
```

Instalátor (s výběrem složky a zástupcem v nabídce Start):

```
npm run build:win:installer
```

Výsledek bude v `dist/TestingToolbox-Setup-29.0.0.exe`. Na Windows to funguje přímo, na Linuxu je k sestavení instalátoru potřeba Wine.

Výsledek bude v `dist/TestingToolbox-Portable-29.0.0.exe` (název je řízen verzí z `package.json`).

PDF generátor vytváří skutečný PDF dokument s platnou strukturou, zatímco TXT a CSV používají čitelný testovací obsah. Import JSONu je omezen velikostí a počtem/délkou položek; poškozená data se do aplikace nezapíšou.

Porovnávač umí načíst text z PDF (tlačítko „PDF" nebo přetažení souboru do pole). Slouží k tomu knihovna pdf.js (Mozilla, licence Apache 2.0, viz `LICENSE-pdfjs.txt`), která je vložena přímo v `src/index.html`. Naskenovaná PDF bez textové vrstvy (jen obrázky) neumí přečíst.
