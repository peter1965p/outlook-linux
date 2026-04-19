const { app, BrowserWindow, ipcMain } = require('electron');
const { ImapFlow } = require('imapflow');
const path = require('path');

// Deine Mail-Konfiguration (für United Domains)
const mailConfig = {
    host: 'imap.udag.de',
    port: 993,
    secure: true,
    auth: {
        user: 'news24regional@gmail.com', // Oder deine @paeffgen-it.de Adresse
        pass: 'DEIN_PASSWORT' 
    }
};

async function getMails() {
    const client = new ImapFlow(mailConfig);
    await client.connect();

    let lock = await client.getMailboxLock('INBOX');
    let emails = [];
    try {
        // Die letzten 10 Mails abrufen
        for await (let message of client.fetch('1:10', { envelope: true })) {
            emails.push({
                subject: message.envelope.subject,
                from: message.envelope.from[0].address,
                date: message.envelope.date,
                id: message.uid
            });
        }
    } finally {
        lock.release();
    }
    await client.logout();
    return emails;
}

// IPC Handler: React fragt nach Mails
ipcMain.handle('get-emails', async () => {
    try {
        return await getMails();
    } catch (error) {
        console.error("IMAP Fehler:", error);
        return [];
    }
});

// Standard Electron Window Setup...
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadURL('http://localhost:3000'); // Dein React Dev Server
}

app.whenReady().then(createWindow);