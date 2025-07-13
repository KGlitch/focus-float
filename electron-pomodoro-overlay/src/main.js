const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;
let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: __dirname + '/renderer.js'
    }
  });

  mainWindow.loadFile('src/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

ipcMain.on('start-timer', () => {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        mainWindow.webContents.send('timer-update', timeLeft);
      } else {
        clearInterval(timer);
        isRunning = false;
        timeLeft = 25 * 60; // Reset to 25 minutes
        mainWindow.webContents.send('timer-finished');
      }
    }, 1000);
  }
});

ipcMain.on('pause-timer', () => {
  clearInterval(timer);
  isRunning = false;
});

ipcMain.on('reset-timer', () => {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60; // Reset to 25 minutes
  mainWindow.webContents.send('timer-update', timeLeft);
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('minimize-app', () => {
  if (mainWindow) mainWindow.minimize();
});