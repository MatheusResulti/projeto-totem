const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
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
app.commandLine.appendSwitch("disable-features", "VaapiVideoDecoder,CanvasOopRasterization");
app.commandLine.appendSwitch("disable-dev-shm-usage");
app.commandLine.appendSwitch("no-sandbox");

const isDev = !app.isPackaged;
const DEV_URL = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";

const preloadPath = isDev
  ? path.join(__dirname, "preload.cjs")      
  : path.join(app.getAppPath(), "dist", "preload.cjs"); 

let win;
let kioskLocked = false;

app.on("web-contents-created", (_evt, contents) => {
  contents.on("will-navigate", (_e, url) => console.log("➡️ will-navigate:", url));
  contents.on("did-start-navigation", (_e, url, isInPlace, isMainFrame) =>
    console.log("🚦 did-start-navigation:", { url, isInPlace, isMainFrame })
  );
  contents.on("did-finish-load", () => console.log("✅ Página carregada"));
  contents.on("did-fail-load", (_e, code, desc, url) =>
    console.error("❌ did-fail-load:", { code, desc, url })
  );
  contents.on("crashed", () => console.error("💥 WebContents crashed"));
});

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    frame: false,           
    resizable: isDev,             
    autoHideMenuBar: true,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev) {
    win.loadURL(DEV_URL);
  } else {
    const indexPath = path.join(app.getAppPath(), "dist", "index.html");
    console.log("📂 Carregando:", indexPath);
    win.loadFile(indexPath);
  }

  win.once("ready-to-show", () => win.show());

  win.on("close", (e) => {
    if (kioskLocked) {
      e.preventDefault();
      win.webContents.send("app:navigate", "/login");
    }
  });

  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("context-menu", (e) => e.preventDefault());
  win.webContents.on("before-input-event", (event, input) => {
    if (!kioskLocked) return;
    const key = input.key?.toLowerCase();
    const ctrl = input.control || input.meta;
    const alt = input.alt;
    if (
      key === "f5" || key === "f11" || key === "escape" ||
      (ctrl && (key === "r" || key === "w" || key === "q" || key === "i")) ||
      (alt && key === "f4")
    ) {
      event.preventDefault();
    }
  });

  win.webContents.on("console-message", (_e, level, message, line, sourceId) => {
    const levels = ["log", "warn", "error", "debug", "info"];
    const tag = levels[level] || "log";
    console[tag](`🪵 [renderer:${tag}] ${message} (${sourceId}:${line})`);
  });
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("CommandOrControl+R", () => {});
  globalShortcut.register("F5", () => {});
  globalShortcut.register("CommandOrControl+Shift+I", () => {});
  globalShortcut.register("F11", () => {});

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

ipcMain.on("auth:logged-in", () => {
  kioskLocked = true;
  if (!win) return;
  win.setKiosk(true);                   
  win.setFullScreen(true);
  win.setAlwaysOnTop(true, "screen-saver");
  win.setMenuBarVisibility(false);
});

ipcMain.on("auth:logout", () => {
  kioskLocked = false;
  if (!win) return;
  win.setAlwaysOnTop(false);
  win.setFullScreen(false);
  win.setKiosk(false);
  win.webContents.send("app:navigate", "/login");
});

ipcMain.on("app-quit", () => {
  console.log("Recebi app-quit");
  app.quit();
});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
