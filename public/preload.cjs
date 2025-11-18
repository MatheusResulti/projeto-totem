const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("app-quit"),

  loginKiosk: () => ipcRenderer.send("auth:logged-in"),

  logoutKiosk: () => ipcRenderer.send("auth:logout"),

  printReceipt: (payload) => ipcRenderer.send("printer:receipt", payload),

  onNavigate: (cb) => ipcRenderer.on("app:navigate", (_e, route) => cb(route)),
});
