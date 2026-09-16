// TestingToolbox v21 — Electron main process
const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');

ipcMain.handle('clipboard-write', (event, text) => {
  clipboard.writeText(text);
  return true;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 800, minHeight: 600,
    title: 'TestingToolbox',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, contextIsolation: true, geolocation: false
    }
  });
  win.webContents.session.setPermissionRequestHandler((wc, permission, cb) => {
    cb(permission === 'notifications');
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
