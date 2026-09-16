// TestingToolbox v23 — Electron preload
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  copyText: (text) => ipcRenderer.invoke('clipboard-write', text)
});
