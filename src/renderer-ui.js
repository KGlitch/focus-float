window.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const timerDisplay = document.getElementById('timer');
  const closeBtn = document.getElementById('close-btn');
  const minBtn = document.getElementById('min-btn');
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  const resetBtn = document.getElementById('reset');
  const settingsBtn = document.getElementById('btn-settings');

  let currentWorkDuration = 25 * 60;

  // --- Functions ---
  function updateDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  async function applyCurrentSettings() {
    const cfg = await window.electronAPI.getSettings();
    currentWorkDuration = (cfg.work || 25) * 60;
    // The main process now dictates the time, so we just need to get the initial value
    // and the main process will send updates.
  }

  // --- Event Listeners ---
  if (closeBtn) closeBtn.addEventListener('click', () => window.electronAPI.closeApp());
  if (minBtn) minBtn.addEventListener('click', () => window.electronAPI.minimizeApp());
  if (startBtn) startBtn.addEventListener('click', () => window.electronAPI.startTimer());
  if (pauseBtn) pauseBtn.addEventListener('click', () => window.electronAPI.pauseTimer());
  if (resetBtn) resetBtn.addEventListener('click', () => window.electronAPI.resetTimer());
  if (settingsBtn) settingsBtn.addEventListener('click', () => window.electronAPI.openSettings());

  // --- IPC Listeners ---
  window.electronAPI.onTimerUpdate(updateDisplay);
  window.electronAPI.onTimerFinished(() => {
    new Notification('Pomodoro', { body: 'Zeit für eine Pause!' });
  });

  // --- Initialisation ---
  applyCurrentSettings();
});