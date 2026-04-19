const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    fetchEmails: () => ipcRenderer.invoke('get-emails')
});