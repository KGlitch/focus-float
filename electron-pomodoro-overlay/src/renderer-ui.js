window.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('close-btn');
  const minBtn = document.getElementById('min-btn');
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  const resetBtn = document.getElementById('reset');
  const timerDisplay = document.getElementById('timer');

  function updateDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  if (closeBtn) closeBtn.addEventListener('click', () => window.electronAPI.closeApp());
  if (minBtn) minBtn.addEventListener('click', () => window.electronAPI.minimizeApp());
  if (startBtn) startBtn.addEventListener('click', () => window.electronAPI.startTimer());
  if (pauseBtn) pauseBtn.addEventListener('click', () => window.electronAPI.pauseTimer());
  if (resetBtn) resetBtn.addEventListener('click', () => window.electronAPI.resetTimer());

  window.electronAPI.onTimerUpdate(updateDisplay);
  window.electronAPI.onTimerFinished(() => {
    // Optional: show notification or visual feedback
    updateDisplay(25 * 60); // Reset display to 25:00
  });

  // Initialize display
  updateDisplay(25 * 60);
});