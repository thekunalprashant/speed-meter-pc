
window.electronAPI.onSpeedData((event, data) => {
  document.getElementById("down").innerText = `⬇ ${data.down}`;
  document.getElementById("up").innerText = `⬆ ${data.up}`;
});

document.getElementById("closeBtn").addEventListener("click", () => {
    window.closeWidget();
});

