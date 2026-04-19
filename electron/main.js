const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Outlook Linux",
    backgroundColor: "#0d0f14", // Passend zu deinem CSS
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // DER ENTSCHEIDENDE FIX:
  if (isDev) {
    // Im Entwicklungsmodus: Lade vom React Dev Server
    win.loadURL("http://localhost:3000");
    // Öffne die DevTools automatisch beim Starten im Dev-Mode
    win.webContents.openDevTools();
  } else {
    // Im produktiven Build: Lade die statische Datei aus dem build-Ordner
    // Da die main.js in /electron liegt, müssen wir eine Ebene höher gehen (..)
    win.loadFile(path.join(__dirname, "../build/index.html"));
  }

  // Verhindert, dass neue Fenster in der App geöffnet werden (z.B. externe Links)
  win.webContents.setWindowOpenHandler(({ url }) => {
    // Microsoft Login-URLs im Fenster lassen
    if (url.includes("microsoftonline.com") || url.includes("live.com")) {
      return { action: "allow" };
    }
    // Alle anderen Links im Standard-Browser von CachyOS öffnen
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});