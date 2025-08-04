const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// --- Persist Settings ---
const settingsPath = path.join(app.getPath('userData'), 'settings.json');
let settings;

function loadSettings() {
  const defaults = { work: 25, short: 5, long: 15, cycles: 4 };
  try {
    if (fs.existsSync(settingsPath)) {
      const rawData = fs.readFileSync(settingsPath);
      settings = { ...defaults, ...JSON.parse(rawData) };
    } else {
      settings = defaults;
    }
  } catch (error) {
    console.error('Failed to load settings, using defaults', error);
    settings = defaults;
  }
}

function saveSettings() {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Failed to save settings', error);
  }
}

// --- Window Management ---
let mainWindow;
let settingsWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 260,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('src/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }
  settingsWindow = new BrowserWindow({
    width: 380,
    height: 480,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    resizable: false,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  settingsWindow.loadFile('src/settings.html');
  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

// --- Timer State ---
let timer;
let isRunning = false;
let timeLeft = 0;
let currentCycle = 0;
let isWorkSession = true;

function startNextTimer() {
  isWorkSession = !isWorkSession;
  if (!isWorkSession) { // It's a break
    currentCycle++;
    if (currentCycle % settings.cycles === 0) {
      timeLeft = settings.long * 60; // Long break
    } else {
      timeLeft = settings.short * 60; // Short break
    }
  } else { // It's a work session
    timeLeft = settings.work * 60;
  }
  if (mainWindow) {
    mainWindow.webContents.send('timer-update', timeLeft);
  }
}

function resetTimer(shouldStartNext = false) {
  clearInterval(timer);
  isRunning = false;
  if (shouldStartNext) {
    startNextTimer();
  } else {
    isWorkSession = true;
    currentCycle = 0;
    timeLeft = settings.work * 60;
    if (mainWindow) {
      mainWindow.webContents.send('timer-update', timeLeft);
    }
  }
}

app.on('ready', () => {
  loadSettings();
  createMainWindow();
  app.whenReady().then(() => {
    timeLeft = settings.work * 60;
    if (mainWindow) {
      mainWindow.webContents.send('timer-update', timeLeft);
    }
  });
});

// --- IPC Handlers ---
ipcMain.on('start-timer', () => {
  if (!isRunning && timeLeft > 0) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        if (mainWindow) {
          mainWindow.webContents.send('timer-update', timeLeft);
        }
      } else {
        if (mainWindow) {
          mainWindow.webContents.send('timer-finished');
        }
        resetTimer(true);
      }
    }, 1000);
  }
});

ipcMain.on('pause-timer', () => {
  clearInterval(timer);
  isRunning = false;
});

ipcMain.on('reset-timer', () => {
  resetTimer(false);
});

ipcMain.on('close-app', () => app.quit());
ipcMain.on('minimize-app', () => {
  if (mainWindow) mainWindow.minimize();
});
ipcMain.on('open-settings', createSettingsWindow);
ipcMain.on('close-settings', () => {
  if (settingsWindow) settingsWindow.close();
});

ipcMain.handle('get-settings', () => {
  return settings;
});

ipcMain.on('save-settings', (_, newSettings) => {
  settings = newSettings;
  saveSettings();
  resetTimer(false);
  if (settingsWindow) settingsWindow.close();
});