window.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('close-btn');
  const minBtn = document.getElementById('min-btn');
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  const resetBtn = document.getElementById('reset');

  const settingsBtn = document.getElementById('btn-settings');
  const settingsModal = document.getElementById('settings-modal');
  const inputWork = document.getElementById('cfg-work');
  const inputShort = document.getElementById('cfg-short');
  const inputLong = document.getElementById('cfg-long');
  const inputCycles = document.getElementById('cfg-cycles');
  const cancelBtn = document.getElementById('cfg-cancel');
  const saveBtn = document.getElementById('cfg-save');

  const timerDisplay = document.getElementById('timer');

  function updateDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function openModal() {
    if (settingsModal) settingsModal.style.display = 'block';
  }

  function closeModal() {
    if (settingsModal) settingsModal.style.display = 'none';
  }

  function loadConfig() {
    const defaults = { work: 25, short: 5, long: 15, cycles: 4 };
    let cfg = { ...defaults };
    const stored = localStorage.getItem('pomodoroCfg');
    if (stored) {
      try {
        cfg = { ...cfg, ...JSON.parse(stored) };
      } catch {}
    }
    if (inputWork) inputWork.value = cfg.work;
    if (inputShort) inputShort.value = cfg.short;
    if (inputLong) inputLong.value = cfg.long;
    if (inputCycles) inputCycles.value = cfg.cycles;
    return cfg;
  }

  function saveConfig() {
    const cfg = {
      work: parseInt(inputWork.value, 10) || 0,
      short: parseInt(inputShort.value, 10) || 0,
      long: parseInt(inputLong.value, 10) || 0,
      cycles: parseInt(inputCycles.value, 10) || 0,
    };
    localStorage.setItem('pomodoroCfg', JSON.stringify(cfg));
    if (typeof applyConfig === 'function') {
      applyConfig(cfg);
    } else if (window.applyConfig) {
      window.applyConfig(cfg);
    }
    closeModal();
  }

  if (settingsBtn) settingsBtn.addEventListener('click', openModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (saveBtn) saveBtn.addEventListener('click', saveConfig);

  if (closeBtn) closeBtn.addEventListener('click', () => window.electronAPI.closeApp());
  if (minBtn) minBtn.addEventListener('click', () => window.electronAPI.minimizeApp());
  if (startBtn) startBtn.addEventListener('click', () => window.electronAPI.startTimer());
  if (pauseBtn) pauseBtn.addEventListener('click', () => window.electronAPI.pauseTimer());
  if (resetBtn) resetBtn.addEventListener('click', () => window.electronAPI.resetTimer());

  window.electronAPI.onTimerUpdate(updateDisplay);
  window.electronAPI.onTimerFinished(() => {
    updateDisplay(25 * 60);
  });

  const cfg = loadConfig();
  if (typeof applyConfig === 'function') {
    applyConfig(cfg);
  } else if (window.applyConfig) {
    window.applyConfig(cfg);
  }

  updateDisplay(25 * 60);
});
