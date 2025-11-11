const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

app.disableHardwareAcceleration();
process.env.GDK_BACKEND = "x11";
process.env.XDG_SESSION_TYPE = "x11";
process.env.ELECTRON_OZONE_PLATFORM_HINT = "x11";
process.env.LIBGL_ALWAYS_SOFTWARE = "1";
process.env.LIBVA_DRIVER_NAME = "dummy";
app.commandLine.appendSwitch("ozone-platform", "x11");
app.commandLine.appendSwitch("in-process-gpu");
app.commandLine.appendSwitch("use-gl", "swiftshader");
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-gpu-sandbox");
<<<<<<< HEAD
app.commandLine.appendSwitch(
  "disable-features",
  "VaapiVideoDecoder,CanvasOopRasterization"
);
app.commandLine.appendSwitch("disable-dev-shm-usage");
app.commandLine.appendSwitch("no-sandbox");

const isDev = !app.isPackaged;
const DEV_URL = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";

function createWindow() {
=======
app.commandLine.appendSwitch("disable-features", "VaapiVideoDecoder,CanvasOopRasterization");
app.commandLine.appendSwitch("disable-dev-shm-usage");
app.commandLine.appendSwitch("no-sandbox");

const resolveApp = (...segments) =>
  app.isPackaged
    ? path.join(app.getAppPath(), ...segments)
    : path.join(__dirname, ...segments);

const isDev = !app.isPackaged;
const DEV_URL = process.env.VITE_DEV_SERVER_URL || "http://localhost:3000";

app.on("web-contents-created", (_evt, contents) => {
  contents.on("will-navigate", (_e, url) => console.log("➡️ will-navigate:", url));
  contents.on("did-start-navigation", (_e, url, isInPlace, isMainFrame) =>
    console.log("🚦 did-start-navigation:", { url, isInPlace, isMainFrame })
  );
  contents.on("did-finish-load", () => console.log("✅ Página carregada com sucesso"));
  contents.on("did-fail-load", (_e, code, desc, url) =>
    console.error("❌ did-fail-load:", { code, desc, url })
  );
  contents.on("crashed", () => console.error("💥 WebContents crashed"));
});

function createWindow() {
  const preloadPath = isDev
    ? resolveApp("preload.cjs")
    : resolveApp("dist", "preload.cjs");

>>>>>>> 189e5da (alterações feitas para o exe)
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
<<<<<<< HEAD
      preload: path.join(__dirname, "preload.cjs"),
=======
      preload: preloadPath,
>>>>>>> 189e5da (alterações feitas para o exe)
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

<<<<<<< HEAD
  if (isDev) win.loadURL(DEV_URL);
  else win.loadFile(path.join(__dirname, "index.html"));
=======
  if (isDev) {
    win.loadURL(DEV_URL);
  } else {
    const indexPath = resolveApp("dist", "index.html");
    console.log("📂 Carregando:", indexPath);
    win.loadFile(indexPath);
  }

  win.webContents.on("console-message", (_e, level, message, line, sourceId) => {
    const levels = ["log", "warn", "error", "debug", "info"];
    const tag = levels[level] || "log";
    console[tag](`🪵 [renderer:${tag}] ${message} (${sourceId}:${line})`);
  });
>>>>>>> 189e5da (alterações feitas para o exe)
}

app.whenReady().then(() => {
  createWindow();
<<<<<<< HEAD

=======
>>>>>>> 189e5da (alterações feitas para o exe)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on("app-quit", () => {
  console.log("Fechando app via IPC...");
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
