// This file contains the renderer process logic for the Electron Pomodoro overlay application.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.send('close-app'),
  minimizeApp: () => ipcRenderer.send('minimize-app'),
  startTimer: () => ipcRenderer.send('start-timer'),
  pauseTimer: () => ipcRenderer.send('pause-timer'),
  resetTimer: () => ipcRenderer.send('reset-timer'),
  onTimerUpdate: (callback) => ipcRenderer.on('timer-update', (_, time) => callback(time)),
  onTimerFinished: (callback) => ipcRenderer.on('timer-finished', callback),
});

let timer;
let isRunning = false;
let timeLeft = 25 * 60; // 25 minutes in seconds

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                // Optionally, you can trigger a sound or notification here
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 25 * 60; // Reset to 25 minutes
    updateDisplay();
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Listen for IPC messages from the main process
ipcRenderer.on('update-timer', (event, time) => {
    timeLeft = time;
    updateDisplay();
});

// Close the application when the close button is clicked
ipcRenderer.on('close-app', () => {
    ipcRenderer.send('close-app');
});

document.getElementById('close-btn').addEventListener('click', () => {
  window.electronAPI.closeApp();
});
document.getElementById('min-btn').addEventListener('click', () => {
  window.electronAPI.minimizeApp();
});