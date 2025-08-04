const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.send('close-app'),
  minimizeApp: () => ipcRenderer.send('minimize-app'),
  startTimer: () => ipcRenderer.send('start-timer'),
  pauseTimer: () => ipcRenderer.send('pause-timer'),
  resetTimer: () => ipcRenderer.send('reset-timer'),
  onTimerUpdate: (callback) => ipcRenderer.on('timer-update', (_, time) => callback(time)),
  onTimerFinished: (callback) => ipcRenderer.on('timer-finished', callback),
  // Settings
  openSettings: () => ipcRenderer.send('open-settings'),
  closeSettings: () => ipcRenderer.send('close-settings'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings),
});
