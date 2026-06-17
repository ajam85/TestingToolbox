const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  spustOCR: () => ipcRenderer.invoke('spust-ocr')
})
