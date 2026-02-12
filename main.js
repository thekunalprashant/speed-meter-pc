const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");
const Store = require("electron-store");
const { exec } = require("child_process");

let win = null;
let tray = null;
let isQuitting = false;

let previousRx = 0;
let previousTx = 0;

const store = new Store();

/* ---------------------------------
   CREATE WINDOW
----------------------------------- */
function createWindow() {
  const { x, y } = store.get("windowPosition", { x: null, y: null });

  win = new BrowserWindow({
    width: 200,
    height: 80,
    x: x ?? undefined,
    y: y ?? undefined,
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

  win.on("move", () => {
    const [newX, newY] = win.getPosition();
    store.set("windowPosition", { x: newX, y: newY });
  });

  win.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      win.hide();
    }
  });
}

/* ---------------------------------
   TRAY
----------------------------------- */
function createTray() {
  tray = new Tray(path.join(__dirname, "icon.png"));

  tray.on("click", () => {
    if (!win) {
      createWindow();
      setTimeout(() => win.show(), 200);
      return;
    }
    win.isVisible() ? win.hide() : win.show();
  });

  const menu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: () => win.show()
    },
    {
      label: "Start on Boot",
      type: "checkbox",
      checked: store.get("openOnBoot", false),
      click: (item) => {
        store.set("openOnBoot", item.checked);
        app.setLoginItemSettings({ openAtLogin: item.checked });
      }
    },
    { type: "separator" },
    {
      label: "Exit",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(menu);
  tray.setToolTip("Internet Speed Meter");
}

/* ---------------------------------
   FORMAT SPEED
----------------------------------- */
function formatSpeed(bytesPerSec) {
  const kb = bytesPerSec / 1024;

  if (kb < 1024) return `${kb.toFixed(1)} KB/s`;

  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB/s`;

  return `${(mb / 1024).toFixed(2)} GB/s`;
}

/* ---------------------------------
   FETCH SPEED USING NETSTAT
----------------------------------- */
function updateSpeed() {
  exec("netstat -e", (err, stdout) => {
    if (err || !stdout || !win) return;

    const lines = stdout.split("\n");
    const dataLine = lines.find(line => line.trim().startsWith("Bytes"));

    if (!dataLine) return;

    const parts = dataLine.trim().split(/\s+/);
    const rx = parseInt(parts[1], 10);
    const tx = parseInt(parts[2], 10);

    if (previousRx === 0) {
      previousRx = rx;
      previousTx = tx;
      return;
    }

    const down = rx - previousRx;
    const up = tx - previousTx;

    previousRx = rx;
    previousTx = tx;

    win.webContents.send("speed-data", {
      down: formatSpeed(down / 2),
      up: formatSpeed(up / 2)
    });
  });
}

/* ---------------------------------
   LOOP
----------------------------------- */
function startLoop() {
  function loop() {
    if (isQuitting) return;

    updateSpeed();
    setTimeout(loop, 2000);
  }

  loop();
}

/* ---------------------------------
   APP START
----------------------------------- */
app.whenReady().then(() => {
  createWindow();
  createTray();

  if (store.get("openOnBoot", false)) {
    app.setLoginItemSettings({ openAtLogin: true });
  }

  startLoop();
});

app.on("window-all-closed", (e) => e.preventDefault());
