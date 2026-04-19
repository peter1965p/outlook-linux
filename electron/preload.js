const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  version: process.versions.electron,
  // Hiermit könnte React später dem Hauptprozess sagen: "Schick mal ne Mail"
  sendNotification: (title, body) => ipcRenderer.send("show-notification", { title, body }),
});