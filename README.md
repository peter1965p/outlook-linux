# 📬 Outlook Linux – Dein Outlook-Client für CachyOS

Ein vollständiger Outlook-Klon für Linux, gebaut mit **React + Electron + Microsoft Graph API**.

---

## ✅ Was die App kann

- 📥 **E-Mails** lesen, schreiben, löschen (alle Ordner)
- 📅 **Kalender** – Termine anzeigen & erstellen
- 👤 **Kontakte** durchsuchen
- ✓  **Aufgaben** (Microsoft To-Do) verwalten

---

## 🚀 Schritt-für-Schritt Installation

### Schritt 0: Node.js installieren (falls noch nicht vorhanden)

```bash
sudo pacman -S nodejs npm
node --version   # sollte v18+ ausgeben
```

### Schritt 1: Azure App-Registrierung (MUSS einmalig gemacht werden!)

Du brauchst eine kostenlose Microsoft Azure App-ID, damit die App auf dein Konto zugreifen darf.

1. Gehe zu: https://portal.azure.com
2. Melde dich mit deinem Microsoft-Konto an
3. Suche oben nach **"App-Registrierungen"** → Klicke drauf
4. Klicke auf **"+ Neue Registrierung"**
5. Fülle aus:
   - **Name**: `Outlook Linux` (egal was)
   - **Kontotypen**: "Konten in einem beliebigen Organisationsverzeichnis und persönliche Microsoft-Konten"
   - **Umleitungs-URI**: `http://localhost:3000` (Typ: Web)
6. Klicke **"Registrieren"**
7. Kopiere die **"Anwendungs-ID (Client)"** – das ist deine CLIENT_ID!

8. Jetzt API-Berechtigungen hinzufügen:
   - Links auf **"API-Berechtigungen"** klicken
   - **"+ Berechtigung hinzufügen"** → Microsoft Graph → Delegierte Berechtigungen
   - Füge diese hinzu: `Mail.ReadWrite`, `Mail.Send`, `Calendars.ReadWrite`, `Contacts.ReadWrite`, `Tasks.ReadWrite`, `User.Read`
   - Klicke **"Administratorzustimmung erteilen"** (falls der Button da ist)

### Schritt 2: Client-ID in die App eintragen

Öffne die Datei `src/authConfig.js` und ersetze:
```
clientId: "DEINE_CLIENT_ID_HIER"
```
mit deiner echten Client-ID, z.B.:
```
clientId: "a1b2c3d4-1234-abcd-5678-ef0123456789"
```

### Schritt 3: Abhängigkeiten installieren

```bash
cd outlook-linux
npm install
```

Das dauert ein paar Minuten.

### Schritt 4: App starten (Entwicklungsmodus)

```bash
npm run electron-dev
```

Jetzt öffnet sich die App! Melde dich mit deinem Microsoft-Konto an.

---

## 📦 Als .AppImage / .deb packen (fertige Desktop-App)

```bash
npm run build
npm run package
```

Die fertige App liegt dann im Ordner `dist/`.

---

## 📁 Projektstruktur

```
outlook-linux/
├── electron/
│   ├── main.js          ← Electron Hauptprozess
│   └── preload.js       ← Sicherheitsbrücke
├── src/
│   ├── authConfig.js    ← ⚠️ HIER deine Client-ID eintragen!
│   ├── App.js           ← Haupt-App
│   ├── components/
│   │   └── Layout.js    ← Sidebar + Navigation
│   ├── pages/
│   │   ├── MailPage.js
│   │   ├── CalendarPage.js
│   │   ├── ContactsPage.js
│   │   └── TasksPage.js
│   ├── utils/
│   │   └── graphApi.js  ← Alle Microsoft Graph API Aufrufe
│   └── styles/
│       └── global.css
├── public/
│   └── index.html
└── package.json
```

---

## ❓ Häufige Probleme

**"Login funktioniert nicht"**
→ Prüfe die Client-ID in `authConfig.js`
→ Prüfe ob `http://localhost:3000` als Redirect-URI in Azure eingetragen ist

**"Keine Mails werden geladen"**
→ Prüfe ob alle API-Berechtigungen in Azure gesetzt sind

**"npm install schlägt fehl"**
→ `sudo pacman -S base-devel python` ausführen, dann nochmal

---

## 🔧 Technologien

| Technologie | Zweck |
|---|---|
| **Electron** | Desktop-App auf Linux |
| **React 18** | Benutzeroberfläche |
| **Microsoft MSAL** | Microsoft-Login (OAuth2) |
| **Microsoft Graph API** | Zugriff auf Mails/Kalender/etc. |
| **date-fns** | Deutsche Datumsformatierung |

---

Viel Spaß mit deinem Outlook auf CachyOS! 🐧
