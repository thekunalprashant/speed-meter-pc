const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    onSpeedData: (callback) => ipcRenderer.on("speed-data", callback),
});

contextBridge.exposeInMainWorld("closeWidget", () => {
    ipcRenderer.send("hide-window");
});
