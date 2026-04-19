const { contextBridge } = require("electron");

// Hier kannst du später sichere Node.js APIs für React freigeben
contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  version: process.versions.electron,
});
