// TestingToolbox v29 — Electron preload
const { contextBridge, ipcRenderer } = require('electron');

const MAX_CLIPBOARD_TEXT_LENGTH = 1024 * 1024;

contextBridge.exposeInMainWorld('electronAPI', {
  copyText: (text) => {
    if (typeof text !== 'string') throw new TypeError('Clipboard text must be a string');
    if (text.length > MAX_CLIPBOARD_TEXT_LENGTH) throw new RangeError('Clipboard text is too long');
    return ipcRenderer.invoke('clipboard-write', text);
  },
  copyRich: (text, html) => {
    if (typeof text !== 'string' || typeof html !== 'string') throw new TypeError('Clipboard text and html must be strings');
    if (text.length > MAX_CLIPBOARD_TEXT_LENGTH || html.length > MAX_CLIPBOARD_TEXT_LENGTH * 2) throw new RangeError('Clipboard content is too long');
    return ipcRenderer.invoke('clipboard-write-rich', text, html);
  }
});
