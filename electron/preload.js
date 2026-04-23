const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Schickt die manuellen IMAP Daten ans Backend
    saveAccount: (config) => ipcRenderer.invoke('save-account', config),

    // Startet den Google OAuth Prozess
    startGoogleAuth: () => ipcRenderer.invoke('google-auth-start'),

    // Holt die Account-Liste für deine Konten-Seite
    getAccounts: () => ipcRenderer.invoke('get-accounts'),

    // Holt die Mails für die MailPage
    fetchEmails: (folder) => ipcRenderer.invoke('get-messages', folder),

    // Details einer Mail abrufen
    getMailDetail: (id) => ipcRenderer.invoke('get-mail-detail', id),
});