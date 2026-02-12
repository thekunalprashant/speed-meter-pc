# 🚀 Speed Meter (Windows)

A lightweight, always-on-top Internet speed monitor for Windows.
Built with Electron, optimized for minimal CPU usage, and designed to run silently in the system tray.

> ⚡ Real-time speed.
> 🪶 Minimal resource usage.
> 🔒 Fully offline.

---

## ✨ Features

* 📡 **Real-Time Monitoring** – Live download & upload speed
* 🖥 **Always-On-Top Floating Widget** – Compact 200×80 window
* 📍 **Position Memory** – Remembers window location
* 🧭 **System Tray Integration** – Toggle visibility instantly
* 🚀 **Start on Boot Option**
* 🔒 **100% Offline** – No data sent anywhere
* 🪶 **Low CPU Usage** – Optimized architecture

---

## 🖼 Interface

Displays:

* ⬇ Download speed
* ⬆ Upload speed
* Minimal floating UI
* Drag to reposition

Designed to stay out of your way.

---

## 🧠 Architecture Decision (Important)

### ⚠️ Initial Problem

During development, the app used the `systeminformation` package to fetch network stats.

On Windows, this internally triggers PowerShell commands like:

```
Get-NetAdapterStatistics
```

When polled frequently (1–3 seconds), this caused:

* Multiple `powershell.exe` processes spawning
* CPU usage between 12%–30%
* Occasional CPU spikes
* Unnecessary overhead for a tray utility

This made the approach unsuitable for continuous background monitoring.

---

### ✅ Final Solution

The application was redesigned to use:

```
netstat -e
```

Instead of PowerShell-based calls.

The optimized approach:

* Executes a lightweight native Windows command
* Reads total bytes sent/received
* Calculates speed using delta over time
* Avoids PowerShell completely
* Prevents process accumulation
* Reduces CPU usage to ~0.3–3%

---

### 📊 Performance Comparison

| Implementation    | CPU Usage | PowerShell Spawn |
| ----------------- | --------- | ---------------- |
| systeminformation | 12–30%    | Yes              |
| netstat (final)   | 0.3–3%    | No               |

This change made the app production-ready and efficient for long-term background usage.

---

## 📦 Installation

### 🔹 From Release

Download the latest `.exe` from the **Releases** page and run the installer.

### 🔹 Development Setup

```bash
git clone https://github.com/theKunalPrashant/speed-meter-pc.git
cd speed-meter
npm install
npm start
```

---

## 🏗 Build Installer

To create a Windows installer:

```bash
npm run build
```

The installer will be generated inside the `dist/` folder.

---

## 📁 Project Structure

```
speed-meter/
├── main.js
├── preload.js
├── package.json
├── renderer/
│   ├── index.html
│   ├── app.js
│   └── style.css
└── icon.ico
```

---

## 🛠 Technologies Used

* **Electron** – Desktop application framework
* **electron-store** – Persistent local storage
* **electron-builder** – Packaging & distribution
* **Node.js child_process** – Lightweight `netstat` execution

---

## 📋 Requirements

* Node.js (v14+ recommended)
* Windows 10/11

---

## 📜 Available Scripts

| Command         | Description             |
| --------------- | ----------------------- |
| `npm start`     | Run development version |
| `npm run build` | Build Windows installer |

---

## 🛣 Roadmap

* [ ] macOS support
* [ ] Linux support
* [ ] Speed history graph
* [ ] Custom themes
* [ ] Notification alerts
* [ ] Advanced settings panel

---

## 🤝 Contributing

Pull requests are welcome.
For major changes, please open an issue first to discuss improvements.

---

## 🧑‍💻 Author

Built by **Kunal Prashant**
GitHub: [https://github.com/theKunalPrashant](https://github.com/theKunalPrashant)

---

## 📄 License

This project is licensed under the MIT License.

--