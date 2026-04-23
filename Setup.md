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

### Schritt 1: Node.js installieren (falls noch nicht vorhanden)

```bash
sudo pacman -S nodejs npm
node --version   # sollte v18+ ausgeben
```


### Schritt 2: Abhängigkeiten installieren

```bash
cd outlook-linux
npm install
```

Das dauert ein paar Minuten.

### Schritt 3: .env erstellen und App starten (Entwicklungsmodus)

🛠 Outlook für Linux - Google API Setup Guide

Diese Anleitung beschreibt, wie du die notwendigen Anmeldedaten (Keys) erstellst, um Gmail-Konten in dein Projekt einzubinden.
Schritt 1: Google Cloud Projekt erstellen

    Gehe zur Google Cloud Console.

    Klicke oben links auf das Projekt-Dropdown und wähle "Neues Projekt".

    Name: Outlook-Linux-Mail (oder ein Name deiner Wahl).

Schritt 2: APIs aktivieren

    Suche in der Suchleiste nach "Gmail API" und klicke auf Aktivieren.

    Suche nach "Google People API" (für Profilinfos und E-Mail-Adresse) und klicke auf Aktivieren.

Schritt 3: OAuth-Zustimmungsbildschirm (Consent Screen)

Bevor Google die Keys freigibt, musst du den Screen konfigurieren:

    Gehe zu "APIs & Dienste" > "OAuth-Zustimmungsbildschirm".

    Wähle "External".

    Gib die Pflichtfelder an (App-Name: Outlook für Linux, Support-E-Mail).

    WICHTIG: Unter "Testnutzer" musst du deine eigene E-Mail-Adresse hinzufügen, damit der Login im Entwicklungsmodus funktioniert.

Schritt 4: Anmeldedaten (Keys) erstellen

    Gehe zu "Anmeldedaten" (Credentials).

    Klicke auf "Anmeldedaten erstellen" > "OAuth-Client-ID".

    Anwendungstyp: "Webanwendung".

    Autorisierte Weiterleitungs-URIs:

        Füge http://localhost hinzu.

    Klicke auf Erstellen.

Schritt 5: Die .env Datei befüllen

Kopiere die Client ID und das Client Secret in deine lokale .env Datei im Hauptverzeichnis des Projekts:
Plaintext

GOOGLE_CLIENT_ID=deine-id-hier.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=dein-secret-hier

⚠️ Wichtige Hinweise zur Sicherheit

    Git-Schutz: Die Datei .env darf niemals auf GitHub landen. Prüfe, ob sie in der .gitignore steht.

    Neustart: Nach jeder Änderung an der .env musst du Electron neu starten (npm run electron-dev), damit die neuen Keys geladen werden.

Was machen diese Keys?

    Client ID: Identifiziert deine App gegenüber Google als "Outlook für Linux".

    Client Secret: Dient als geheimer Schlüssel, um die Echtheit der Anfrage zu bestätigen und die Token für den Mail-Abruf zu erhalten.
```bash
npm run electron-dev
```

Jetzt öffnet sich die App! Melde dich mit deinem Google-Konto an.

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
├── .env                ← 🔒 NEU: Hier liegen jetzt GOOGLE_CLIENT_ID & SECRET (Nicht pushen!)
├── .gitignore          ← Stellt sicher, dass die .env auf deinem Rechner bleibt
├── electron/
│   ├── main.js         ← Hauptprozess (lädt jetzt die Keys via dotenv)
│   └── preload.js      ← Die Brücke zwischen System und UI
├── src/
│   ├── App.js          ← Haupt-Logik & Routing
│   ├── components/
│   │   └── Layout.js   ← Sidebar & Navigation (Hier Branding auf "Outlook für Linux" anpassen)
│   ├── pages/
│   │   ├── MailPage.js      ← Die Mail-Zentrale (Peter's Ansicht)
│   │   ├── CalendarPage.js
│   │   ├── ContactsPage.js
│   │   ├── SettingsPage.js  ← (Zuvor Settings.js - jetzt korrigiert)
│   │   └── TasksPage.js
│   ├── utils/
│   │   └── googleApi.js     ← Alle API-Aufrufe (Gmail/Google Graph)
│   └── styles/
│       └── global.css
├── public/
│   └── index.html
├── SETUP.md            ← Dein neuer Guide für die Google-Keys
└── package.json        ← Start-Scripts (npm run electron-dev)
```

---


## 🔧 Technologien
Technologie,Zweck
Electron,Container für die Desktop-App (Linux-Integration)
React 18,Dynamische Benutzeroberfläche & Komponenten
Google Auth (OAuth2),Sicherer Login über den Google-Account
Gmail API,Abrufen und Senden von E-Mails
Google People API,Synchronisation von Kontakten und Profilbildern
date-fns,"Deutsche Datums- und Zeitformatierung (z.B. ""vor 2 Min"")"
dotenv,Sicherer Umgang mit Client-IDs & Secrets

---

Viel Spaß mit deinem Outlook auf CachyOS! 
