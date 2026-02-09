const { app, BrowserWindow, Tray, Menu, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store");
const si = require("systeminformation");

let win = null;
let tray = null;
const store = new Store();

/* ---------------------------------
   CREATE MAIN WINDOW
----------------------------------- */
function createWindow() {
  // Load saved position
  const { x, y } = store.get("windowPosition", { x: null, y: null });

  win = new BrowserWindow({
    width: 200,
    height: 80,
    x: x !== null ? x : undefined,
    y: y !== null ? y : undefined,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile("./renderer/index.html");

  // Save drag position
  win.on("move", () => {
    const [newX, newY] = win.getPosition();
    store.set("windowPosition", { x: newX, y: newY });
  });

  win.on("closed", () => {
    win = null;
  });

  return win;
}

/* Hide from X button */
ipcMain.on("hide-window", () => {
  if (win) win.hide();
});

/* ---------------------------------
   TRAY SETUP
----------------------------------- */
function createTray() {
  tray = new Tray(path.join(__dirname, "icon.png"));

  /* ✔ Single-left-click tray toggles show/hide */
  tray.on("click", () => {
    if (!win) {
      createWindow();
      setTimeout(() => {
        win.show();
      }, 200);
      return;
    }

    if (win.isVisible()) win.hide();
    else win.show();
  });

  /* Tray Menu */
  const menu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: () => {
        if (!win) {
          createWindow();
          setTimeout(() => win.show(), 200);
        } else {
          win.show();
        }
      }
    },

    {
      label: "Settings",
      submenu: [
        {
          label: "Start on Boot",
          type: "checkbox",
          checked: store.get("openOnBoot", false),
          click: (item) => {
            store.set("openOnBoot", item.checked);
            app.setLoginItemSettings({ openAtLogin: item.checked });
          }
        }
      ]
    },

    { type: "separator" },

    {
      label: "Exit",
      click: () => app.quit()
    }
  ]);

  tray.setToolTip("Internet Speed Meter");
  tray.setContextMenu(menu);
}

/* ---------------------------------
   SPEED FORMAT
----------------------------------- */
function formatSpeed(kb) {
  if (kb < 1024) return `${kb.toFixed(1)} KB/s`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB/s`;
  return `${(mb / 1024).toFixed(2)} GB/s`;
}

/* ---------------------------------
   SEND SPEED
----------------------------------- */
function sendSpeed() {
  si.networkStats().then(stats => {
    const active = stats.find(n => n.operstate === "up") || stats[0];
    if (!active || !win) return;

    win.webContents.send("speed-data", {
      down: formatSpeed(active.rx_sec / 1024),
      up: formatSpeed(active.tx_sec / 1024)
    });
  });
}

app.on("window-all-closed", (e) => e.preventDefault());

/* ---------------------------------
   APP READY
----------------------------------- */
app.whenReady().then(() => {
  createWindow();
  createTray();

  if (store.get("openOnBoot", false)) {
    app.setLoginItemSettings({ openAtLogin: true });
  }

  setInterval(sendSpeed, 1000);
});
