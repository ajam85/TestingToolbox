// TestingToolbox v28 — Electron main process
const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

const rendererPath = path.join(__dirname, 'src', 'index.html');
const rendererUrl = pathToFileURL(rendererPath).href;
const MAX_CLIPBOARD_TEXT_LENGTH = 1024 * 1024;
let mainWindow = null;

function isTrustedRenderer(event, win) {
  return Boolean(
    win && !win.isDestroyed() &&
    event.sender === win.webContents &&
    event.senderFrame && event.senderFrame.url === rendererUrl
  );
}

function isTrustedRequestingUrl(url) {
  return typeof url === 'string' && url === rendererUrl;
}

ipcMain.handle('clipboard-write', (event, text) => {
  if (!isTrustedRenderer(event, mainWindow)) {
    throw new Error('Unauthorized IPC sender');
  }
  if (typeof text !== 'string') {
    throw new TypeError('Clipboard text must be a string');
  }
  if (text.length > MAX_CLIPBOARD_TEXT_LENGTH) {
    throw new RangeError('Clipboard text is too long');
  }
  clipboard.writeText(text);
  return true;
});

ipcMain.handle('clipboard-write-rich', (event, text, html) => {
  if (!isTrustedRenderer(event, mainWindow)) {
    throw new Error('Unauthorized IPC sender');
  }
  if (typeof text !== 'string' || typeof html !== 'string') {
    throw new TypeError('Clipboard text and html must be strings');
  }
  if (text.length > MAX_CLIPBOARD_TEXT_LENGTH || html.length > MAX_CLIPBOARD_TEXT_LENGTH * 2) {
    throw new RangeError('Clipboard content is too long');
  }
  clipboard.write({ text, html });
  return true;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 800, minHeight: 600,
    title: 'TestingToolbox',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
      geolocation: false
    }
  });

  mainWindow = win;
  win.webContents.on('will-navigate', (event, url) => {
    if (url !== rendererUrl) event.preventDefault();
  });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-attach-webview', event => event.preventDefault());

  win.webContents.session.setPermissionRequestHandler((wc, permission, cb, details) => {
    cb(
      wc === win.webContents &&
      permission === 'notifications' &&
      isTrustedRequestingUrl(details && details.requestingUrl)
    );
  });
  win.webContents.session.setPermissionCheckHandler((wc, permission, requestingOrigin) => {
    return wc === win.webContents &&
      permission === 'notifications' &&
      isTrustedRequestingUrl(requestingOrigin === 'file://' ? rendererUrl : requestingOrigin);
  });

  win.loadFile(rendererPath);
  win.setMenuBarVisibility(false);
  win.on('closed', () => {
    if (mainWindow === win) mainWindow = null;
  });
  return win;
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
