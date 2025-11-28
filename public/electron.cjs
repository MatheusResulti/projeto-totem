const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  session,
} = require("electron");

if (require("electron-squirrel-startup")) {
  app.quit();
}

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
app.commandLine.appendSwitch(
  "disable-features",
  "VaapiVideoDecoder,CanvasOopRasterization"
);
app.commandLine.appendSwitch("disable-dev-shm-usage");
app.commandLine.appendSwitch("no-sandbox");

const isDev = !app.isPackaged;
const DEV_URL = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";

const preloadPath = isDev
  ? path.join(__dirname, "preload.cjs")
  : path.join(app.getAppPath(), "dist", "preload.cjs");

let win;
let kioskLocked = false;
let forceQuit = false;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatCurrency = (value) => {
  const numeric = Number(value);
  return currencyFormatter.format(Number.isFinite(numeric) ? numeric : 0);
};

const escapeHtml = (value = "") =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const cleanText = (value = "") =>
  String(value ?? "")
    .replace(/\r/g, "")
    .replace(/\u00C2/g, "")
    .trim();

const splitInLines = (text, maxLen = 26) => {
  const clean = cleanText(text ?? "");
  const words = clean.split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length > maxLen) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines;
};

const buildReceiptHtmlFromImpressao = (payload = {}) => {
  const impressao = Array.isArray(payload?.data?.impressao)
    ? payload.data.impressao
    : [];
  const { company = {} } = payload;

  const lineWidth = 48;
  const baseSize = 10;

  const logoUrl = company.logoUrl;
  const companyName = company.name || "";
  const companyDocument = company.document || "";
  const addressLines = splitInLines(company.address, 26);

  const normalizeSkip = (value) =>
    cleanText(String(value ?? ""))
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

  const skipSet = new Set(
    [
      companyName,
      companyDocument,
      companyDocument ? `CNPJ: ${companyDocument}` : "",
      ...addressLines,
    ]
      .filter(Boolean)
      .map((v) => normalizeSkip(v))
  );

  const headerHtml =
    logoUrl || companyName || companyDocument || addressLines.length
      ? `
    <div class="header-flex">
      ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="Logo" />` : ""}
      <div class="header-text">
        ${escapeHtml(cleanText(companyName))}<br />
        ${
          companyDocument
            ? "CNPJ: " + escapeHtml(cleanText(companyDocument)) + "<br />"
            : ""
        }
        ${addressLines.map((l) => escapeHtml(l)).join("<br/>")}
      </div>
    </div>
  `
      : "";

  const renderLine = (item = {}) => {
    if (item.cutt) return null;
    if (item.line) return "-".repeat(lineWidth);
    if (item.doubleLine) return "=".repeat(lineWidth);
    if (item.emptyLine) return "";
    if (item.text == null) return null;

    const normalizedText = normalizeSkip(item.text);

    if (!item.bold && !item.center && skipSet.has(normalizedText)) {
      return null;
    }

    const fontSize = Number.isFinite(item.size)
      ? baseSize + (item.size - 6) * 1
      : baseSize;

    let content = escapeHtml(String(item.text ?? ""));

    if (item.bold) {
      content = `<b>${content}</b>`;
    }

    if (item.size) {
      content = `<span style="font-size:${fontSize}pt">${content}</span>`;
    }

    if (item.center) {
      return `<span style="display:block;text-align:center">${content}</span>`;
    }

    return content;
  };

  const lines = impressao
    .map((item) => renderLine(item))
    .filter((l) => l !== null);

  if (lines.length === 0) {
    lines.push("Recibo indisponível.");
  }

  const body = lines.join("\n");

  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page {
      margin: 0;
      size: 80mm auto;
    }

    html, body {
      margin: 0;
      padding: 0;
    }

    body {
      font-family: monospace;
    }

    .ticket {
      width: 100%;
      font-family: monospace;
    }

    .header-flex {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 6px;
      margin: 4px 0 6px 0;
      padding: 0 4px;
    }

    .header-flex img {
      width: 70px;
      height: auto;
    }

    .header-text {
      font-size: 10pt;
      line-height: 1.2;
      max-width: 100%;
      overflow-wrap: anywhere;
      white-space: normal;
    }

    pre {
      margin: 0;
      padding: 4px;
      font-size: 10pt;
      white-space: pre;
    }
  </style>
</head>
<body>
  <div class="ticket">
    ${headerHtml}
    <pre>${body}</pre>
  </div>
</body>
</html>`;
};

const handleReceiptPrint = (payload = {}) => {
  const html = buildReceiptHtmlFromImpressao(payload);

  const runPrint = () => {
    const printWindow = new BrowserWindow({
      show: false,
      frame: false,
      skipTaskbar: true,
      webPreferences: {
        sandbox: true,
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    const cleanup = () => {
      if (printWindow && !printWindow.isDestroyed()) {
        printWindow.close();
      }
    };

    printWindow.on("closed", () => {});

    printWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
    );

    printWindow.webContents.on("did-finish-load", () => {
      printWindow.webContents.print(
        {
          silent: true,
          deviceName: payload?.printerName || undefined,
          printBackground: true,
        },
        (success, failureReason) => {
          if (!success) {
            console.error("Erro ao imprimir recibo:", failureReason);
          }
          cleanup();
        }
      );
    });

    printWindow.webContents.on("did-fail-load", (_event, code, desc) => {
      console.error("Erro ao preparar a impressão:", code, desc);
      cleanup();
    });
  };

  if (app.isReady()) {
    runPrint();
  } else {
    app.once("ready", runPrint);
  }
};

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
    win.loadFile(indexPath);
  }

  win.once("ready-to-show", () => {
    win.show();
    win.setFullScreen(true);
  });

  win.webContents.once("did-finish-load", () => {
    win.webContents.send("app:navigate", "/login");
  });

  win.on("close", (e) => {
    if (kioskLocked && !forceQuit) {
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
    const allowDevtools = ctrl && input.shift && key === "i";
    if (allowDevtools) return;
    if (
      key === "f5" ||
      key === "f11" ||
      key === "escape" ||
      (ctrl && (key === "r" || key === "w" || key === "q" || key === "i")) ||
      (alt && key === "f4")
    ) {
      event.preventDefault();
    }
  });

  win.webContents.on(
    "console-message",
    (_e, level, message, line, sourceId) => {
      const levels = ["log", "warn", "error", "debug", "info"];
      const tag = levels[level] || "log";
    }
  );
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("CommandOrControl+R", () => {});
  globalShortcut.register("F5", () => {});
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
  win.setKiosk(false);
  win.setFullScreen(true);
  win.webContents.send("app:navigate", "/login");
});

ipcMain.on("app-quit", () => {
  forceQuit = true;
  kioskLocked = false;

  if (win) {
    try {
      win.setAlwaysOnTop(false);
      win.setFullScreen(false);
      win.setKiosk(false);
    } catch {}
    win.close();
  } else {
    app.quit();
  }
});

ipcMain.on("printer:receipt", (_event, payload) => {
  if (!payload || typeof payload !== "object") return;
  try {
    handleReceiptPrint(payload);
  } catch (error) {
    console.error("Erro durante a impressão do recibo:", error);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
