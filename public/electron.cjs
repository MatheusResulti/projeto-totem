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

const buildReceiptHtml = (payload = {}) => {
  const { company = {}, order = {}, payment = {}, timestamp } = payload;
  const items = Array.isArray(order.items) ? order.items : [];
  const companyHtml = [
    company.name,
    company.document ? `CNPJ: ${company.document}` : "",
    company.address,
  ]
    .filter(Boolean)
    .map((line) => `<div>${escapeHtml(line)}</div>`)
    .join("");

  const itemsHtml =
    items
      .map((item) => {
        const totalValue =
          item.total ?? (item.unitPrice ?? 0) * (item.quantity ?? 0);
        const additionals = Array.isArray(item.additionals)
          ? item.additionals
              .filter(Boolean)
              .map((add) => `<div class="muted">+ ${escapeHtml(add)}</div>`)
              .join("")
          : "";
        const observation = item.observation
          ? `<div class="muted">Obs: ${escapeHtml(item.observation)}</div>`
          : "";
        return `<div class="item">
            <div class="flex">
              <span>${escapeHtml(`${item.quantity ?? 0}x ${item.name ?? ""}`)}</span>
              <span>${formatCurrency(totalValue)}</span>
            </div>
            <div class="muted">${formatCurrency(item.unitPrice ?? 0)} un</div>
            ${additionals}${observation}
          </div>`;
      })
      .join("") || `<div class="item">Sem itens registrados.</div>`;

  const pix = payment.pix || {};
  const paidAt =
    pix.paidAt && !Number.isNaN(new Date(pix.paidAt).getTime())
      ? new Date(pix.paidAt)
      : timestamp
        ? new Date(timestamp)
        : null;
  const pixConfirmation = [
    "Pagamento PIX confirmado",
    pix.status ? `STATUS: ${escapeHtml(String(pix.status)).toUpperCase()}` : "",
    pix.pspReceiver ? `Instituição: ${escapeHtml(pix.pspReceiver)}` : "",
    pix.txId || pix.txid ? `TxId: ${escapeHtml(pix.txId || pix.txid)}` : "",
    pix.endToEndId
      ? `EndToEndId: ${escapeHtml(pix.endToEndId)}`
      : "",
    pix.authCode ? `Autenticação: ${escapeHtml(pix.authCode)}` : "",
    pix.description ? `Descrição: ${escapeHtml(pix.description)}` : "",
    pix.key ? `Chave utilizada: ${escapeHtml(pix.key)}` : "",
  ]
    .filter(Boolean)
    .map((line) => `<div>${line}</div>`)
    .join("");

  const receiverInfo = [
    pix.receiverName || company.name
      ? `Recebedor: ${escapeHtml(pix.receiverName || company.name || "")}`
      : "",
    pix.receiverDocument || company.document
      ? `CNPJ: ${escapeHtml(pix.receiverDocument || company.document || "")}`
      : "",
  ]
    .filter(Boolean)
    .map((line) => `<div>${line}</div>`)
    .join("");

  const paidDate =
    paidAt && !Number.isNaN(paidAt.getTime())
      ? paidAt.toLocaleString("pt-BR")
      : null;

  const pixHtml =
    pixConfirmation || receiverInfo
      ? `<div class="section">
          <div><strong>Pagamento PIX</strong></div>
          ${pixConfirmation}
          ${receiverInfo}
          ${
            paidDate
              ? `<div class="muted">Data/Hora: ${escapeHtml(paidDate)}</div>`
              : ""
          }
          <div class="total">Valor: ${formatCurrency(
            pix.amount ?? order.total ?? 0
          )}</div>
        </div>`
      : "";

  const paymentInfo = [
    payment.document ? `Documento: ${payment.document}` : "",
    payment.type ? `Tipo: ${payment.type}` : "",
    order.label ? `Identificador: ${order.label}` : "",
    order.code ? `Pedido: ${order.code}` : "",
  ]
    .filter(Boolean)
    .map((line) => `<div>${escapeHtml(line)}</div>`)
    .join("");

  const saleDate = (() => {
    const dateCandidate = timestamp ? new Date(timestamp) : new Date();
    if (Number.isNaN(dateCandidate.getTime())) {
      return new Date().toLocaleString("pt-BR");
    }
    return dateCandidate.toLocaleString("pt-BR");
  })();

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: "Roboto Mono", "Courier New", monospace;
        font-size: 12px;
        margin: 0;
        padding: 0;
      }
      .receipt {
        width: 280px;
        margin: 0 auto;
        padding: 12px;
      }
      .center {
        text-align: center;
      }
      .section {
        margin-top: 12px;
        border-top: 1px dashed #777;
        padding-top: 8px;
      }
      .item {
        margin: 6px 0;
      }
      .flex {
        display: flex;
        justify-content: space-between;
      }
      .muted {
        color: #555;
        font-size: 10px;
      }
      .total {
        font-size: 14px;
        font-weight: bold;
      }
      .qrcode {
        width: 120px;
        height: 120px;
        margin: 8px auto 0;
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="receipt">
      <div class="center">
        ${companyHtml || "<div>Pedido</div>"}
      </div>
      <div class="section">
        <div><strong>Itens</strong></div>
        ${itemsHtml}
      </div>
      <div class="section total">
        <span>Total: ${formatCurrency(order.total ?? 0)}</span>
      </div>
      <div class="section">
        ${paymentInfo || "<div>Pagamento não informado.</div>"}
      </div>
      ${pixHtml}
      <div class="section center">
        <div>${escapeHtml(saleDate)}</div>
      </div>
    </div>
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

  win.once("ready-to-show", () => win.show());

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
  win.setFullScreen(false);
  win.setKiosk(false);
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
