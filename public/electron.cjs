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

const resultiLogoPath = path.join(
  app.getAppPath(),
  isDev ? "public" : "dist",
  "assets",
  "resultiLogo.png"
);

const resultiLogoUrl = `file:///${resultiLogoPath.replace(/\\/g, "/")}`;

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

const buildReceiptHtml = (payload = {}) => {
  const { company = {}, order = {}, payment = {}, timestamp } = payload;
  const items = Array.isArray(order.items) ? order.items : [];
  const pix = payment.pix || {};
  const paidAtDate = pix.paidAt
    ? new Date(pix.paidAt)
    : timestamp
      ? new Date(timestamp)
      : null;

  const saleDate = (() => {
    const dateCandidate =
      paidAtDate && !Number.isNaN(paidAtDate.getTime())
        ? paidAtDate
        : new Date();
    if (Number.isNaN(dateCandidate.getTime())) {
      return new Date().toLocaleString("pt-BR");
    }
    return dateCandidate.toLocaleString("pt-BR");
  })();

  const lineWidth = 32;
  const pad = (str = "", size = lineWidth, align = "left") => {
    const s = String(str);
    if (s.length >= size) return s.slice(0, size);
    const spaces = " ".repeat(size - s.length);
    return align === "right" ? spaces + s : s + spaces;
  };

  const formatItemLine = (qty, name, total) => {
    const left = `${qty}x ${name}`;
    const right = formatCurrency(total);
    const space = lineWidth - left.length - right.length;
    return `${left}${space > 0 ? " ".repeat(space) : ""}${right}`;
  };

  const lines = [];

  const header = [
    cleanText(company.name),
    company.document ? cleanText(`CNPJ: ${company.document}`) : "",
    cleanText(company.address),
  ]
    .filter(Boolean)
    .map((l) => pad(l, lineWidth, "left"));
  lines.push(...header);
  lines.push("-".repeat(lineWidth));

  lines.push("ITENS");
  if (items.length === 0) {
    lines.push("Sem itens registrados.");
  } else {
    items.forEach((item) => {
      const qty = item.quantity ?? 0;
      const name = cleanText(item.name ?? "");
      const totalValue = item.total ?? (item.unitPrice ?? 0) * qty;
      lines.push(formatItemLine(qty, name, totalValue));
      lines.push(
        pad(`Unit: ${formatCurrency(item.unitPrice ?? 0)}`, lineWidth)
      );
      if (Array.isArray(item.additionals)) {
        item.additionals
          .filter(Boolean)
          .forEach((add) => lines.push(pad(`+ ${cleanText(add)}`, lineWidth)));
      }
      if (item.observation) {
        lines.push(pad(`Obs: ${cleanText(item.observation)}`, lineWidth));
      }
    });
  }

  lines.push("-".repeat(lineWidth));
  lines.push(pad(`TOTAL: ${formatCurrency(order.total ?? 0)}`, lineWidth));

  const paymentInfo = [
    payment.document ? `Documento: ${payment.document}` : "",
    payment.type ? `Tipo: ${payment.type}` : "",
    order.label ? `Identificador: ${order.label}` : "",
    order.code ? `Pedido: ${order.code}` : "",
  ]
    .filter(Boolean)
    .map((info) => cleanText(info));

  if (paymentInfo.length) {
    lines.push("-".repeat(lineWidth));
    lines.push("PAGAMENTO");
    paymentInfo.forEach((info) => lines.push(pad(info, lineWidth)));
  }

  const pixInfoRaw = [
    "Pagamento PIX confirmado",
    pix.status ? `STATUS: ${String(pix.status).toUpperCase()}` : "",
    pix.pspReceiver ? `Instituição: ${pix.pspReceiver}` : "",
    pix.txId || pix.txid ? `TxId: ${pix.txId || pix.txid}` : "",
    pix.endToEndId ? `EndToEndId: ${pix.endToEndId}` : "",
    pix.authCode ? `Autenticação: ${pix.authCode}` : "",
    pix.description ? `Desc: ${pix.description}` : "",
    pix.receiverName || company.name
      ? `Recebedor: ${pix.receiverName || company.name}`
      : "",
    pix.receiverDocument || company.document
      ? `CNPJ: ${pix.receiverDocument || company.document}`
      : "",
    `Valor: ${formatCurrency(pix.amount ?? order.total ?? 0)}`,
    `Pago em: ${saleDate}`,
  ].filter(Boolean);

  const pixInfo = pixInfoRaw.map((i) => cleanText(i));

  if (pixInfo.length) {
    lines.push("-".repeat(lineWidth));
    lines.push("COMPROVANTE PIX");
    pixInfo.forEach((info) => lines.push(pad(info, lineWidth)));
  }

  lines.push("-".repeat(lineWidth));
  lines.push(pad("Obrigado pela preferência!", lineWidth));

  const logoSrc = company.logoBase64 || company.logoUrl || "";

  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page {
      margin: 0;
    }
    html, body {
      margin: 0;
      padding: 0;
    }
    pre {
      margin: 0;
      padding: 0;
      font-family: monospace;
      font-size: 10pt;
      white-space: pre-wrap;
    }
    img.logo {
      display: block;
      margin: 12px auto;
      max-width: 180px;
      width: 100%;
      height: auto;
      object-fit: contain;
      image-rendering: smooth;
    }
  </style>
</head>
<body>
  <pre>${escapeHtml(lines.join("\n"))}</pre>

  ${logoSrc ? `<img class="logo" src="${logoSrc}" />` : ""}

  <pre>${escapeHtml(lines.join("\n"))}</pre>
</body>
</html>`;
};

const handleReceiptPrint = (payload = {}) => {
  const html = buildReceiptHtml(payload);
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
  if (!payload.company) payload.company = {};
  if (!payload.company.logoBase64 && !payload.company.logoUrl) {
    payload.company.logoUrl = resultiLogoUrl;
  }
  try {
    handleReceiptPrint(payload);
  } catch (error) {
    console.error("Erro durante a impressão do recibo:", error);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
