// TestingToolbox v27 — Electron preload
const { contextBridge, ipcRenderer } = require('electron');

const MAX_CLIPBOARD_TEXT_LENGTH = 1024 * 1024;

contextBridge.exposeInMainWorld('electronAPI', {
  copyText: (text) => {
    if (typeof text !== 'string') throw new TypeError('Clipboard text must be a string');
    if (text.length > MAX_CLIPBOARD_TEXT_LENGTH) throw new RangeError('Clipboard text is too long');
    return ipcRenderer.invoke('clipboard-write', text);
  }
});
