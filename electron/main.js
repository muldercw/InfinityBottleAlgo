const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    title: "Infinity Bottle",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.setMenuBarVisibility(false);

  // Load the static Next.js export
  const indexPath = path.join(__dirname, "..", "out", "index.html");
  win.loadFile(indexPath);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
