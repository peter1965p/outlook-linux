require('dotenv').config();
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { ImapFlow } = require('imapflow');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// --- KONFIGURATION (Jetzt sicher über .env) ---
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ACCOUNTS_FILE = path.join(app.getPath('userData'), 'accounts.json');

app.disableHardwareAcceleration();

// --- HELPER: JSON STORAGE ---
function saveAccountsToJSON(accounts) {
    try {
        const dir = path.dirname(ACCOUNTS_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
    }
}

function getAccountsFromJSON() {
    if (!fs.existsSync(ACCOUNTS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
}

// --- MAIL FETCH LOGIK (IMAP) ---
async function fetchMailsIMAP(config) {
    const client = new ImapFlow({
        host: config.incomingHost || 'imap.gmail.com',
        port: parseInt(config.incomingPort) || 993,
        secure: true,
        auth: { user: config.email, pass: config.password },
        logger: false
    });

    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    let emails = [];
    try {
        for await (let message of client.fetch('1:20', { envelope: true })) {
            emails.push({
                id: message.uid,
                subject: message.envelope.subject || "(Kein Betreff)",
                from: message.envelope.from[0]?.address || "Unbekannt",
                date: message.envelope.date,
            });
        }
    } finally { lock.release(); }
    await client.logout();
    return emails.reverse();
}

// --- IPC HANDLER ---

// Konten abrufen
ipcMain.handle('get-accounts', async () => getAccountsFromJSON());

// Mail-Liste laden
ipcMain.handle('get-messages', async () => {
    const accounts = getAccountsFromJSON();
    if (accounts.length === 0) return [];
    const acc = accounts[0];

    try {
        if (acc.type === 'google') {
            const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
            oauth2Client.setCredentials(acc.tokens);
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

            const res = await gmail.users.messages.list({ userId: 'me', maxResults: 20 });
            if (!res.data.messages) return [];

            return await Promise.all(res.data.messages.map(async (msg) => {
                const details = await gmail.users.messages.get({ userId: 'me', id: msg.id });
                const headers = details.data.payload.headers;
                return {
                    id: msg.id,
                    subject: headers.find(h => h.name === 'Subject')?.value || '(Kein Betreff)',
                    from: headers.find(h => h.name === 'From')?.value || 'Unbekannt',
                    date: headers.find(h => h.name === 'Date')?.value || '',
                    snippet: details.data.snippet
                };
            }));
        } else {
            return await fetchMailsIMAP(acc);
        }
    } catch (e) {
        console.error("Fehler beim Mail-Fetch:", e.message);
        return [];
    }
});

// DETAIL-ANSICHT (HTML Body laden)
ipcMain.handle('get-mail-detail', async (event, mailId) => {
    try {
        const accounts = getAccountsFromJSON();
        const acc = accounts[0];
        if (!acc || acc.type !== 'google') return { body: "Kein Google-Konto gefunden." };

        const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
        oauth2Client.setCredentials(acc.tokens);
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        const res = await gmail.users.messages.get({ userId: 'me', id: mailId });
        const payload = res.data.payload;

        const findHtml = (parts) => {
            if (!parts) return null;
            for (let part of parts) {
                if (part.mimeType === 'text/html') {
                    return Buffer.from(part.body.data, 'base64').toString('utf-8');
                }
                if (part.parts) {
                    const found = findHtml(part.parts);
                    if (found) return found;
                }
            }
            return null;
        };

        let body = "";
        if (payload.parts) {
            body = findHtml(payload.parts);
        }

        if (!body && payload.body && payload.body.data) {
            body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
        }

        return { body: body || "Inhalt konnte nicht dekodiert werden." };
    } catch (e) {
        console.error("Detail Fehler:", e);
        return { body: "Fehler: " + e.message };
    }
});

// Google Auth
ipcMain.handle('google-auth-start', async () => {
    const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, 'http://localhost');
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/gmail.readonly']
    });

    const authWin = new BrowserWindow({ width: 600, height: 800, autoHideMenuBar: true });
    authWin.loadURL(authUrl);

    return new Promise((resolve) => {
        authWin.webContents.on('will-redirect', async (event, url) => {
            if (url.startsWith('http://localhost')) {
                event.preventDefault();
                const code = new URL(url).searchParams.get('code');
                const { tokens } = await oauth2Client.getToken(code);
                const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
                oauth2Client.setCredentials(tokens);
                const userInfo = await oauth2.userinfo.get();

                const accounts = getAccountsFromJSON();
                const filtered = accounts.filter(a => a.email !== userInfo.data.email);
                filtered.push({ type: 'google', email: userInfo.data.email, tokens });
                saveAccountsToJSON(filtered);
                authWin.close();
                resolve({ success: true });
            }
        });
    });
});

// --- WINDOW SETUP ---
function createWindow() {
    const win = new BrowserWindow({
        width: 1280, height: 850,
        title: "Outlook Linux",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });
    win.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });