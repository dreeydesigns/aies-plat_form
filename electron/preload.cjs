const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  openExternalOAuth: (provider) => ipcRenderer.invoke('open-external-oauth', provider),
  onOAuthCallback: (callback) => {
    ipcRenderer.on('oauth-callback-received', (event, data) => callback(data));
  }
});
