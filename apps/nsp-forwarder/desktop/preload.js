const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
	setSize: (size) => ipcRenderer.send('set-size', size),
});
