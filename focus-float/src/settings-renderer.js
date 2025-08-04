window.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const inputWork = document.getElementById('cfg-work');
  const inputShort = document.getElementById('cfg-short');
  const inputLong = document.getElementById('cfg-long');
  const inputCycles = document.getElementById('cfg-cycles');
  const cancelBtn = document.getElementById('cfg-cancel');
  const saveBtn = document.getElementById('cfg-save');

  // --- Functions ---
  async function loadSettings() {
    const cfg = await window.electronAPI.getSettings();
    if (inputWork) inputWork.value = cfg.work;
    if (inputShort) inputShort.value = cfg.short;
    if (inputLong) inputLong.value = cfg.long;
    if (inputCycles) inputCycles.value = cfg.cycles;
  }

  function saveSettings() {
    const cfg = {
      work: parseInt(inputWork.value, 10) || 25,
      short: parseInt(inputShort.value, 10) || 5,
      long: parseInt(inputLong.value, 10) || 15,
      cycles: parseInt(inputCycles.value, 10) || 4,
    };
    window.electronAPI.saveSettings(cfg);
  }

  // --- Event Listeners ---
  if (cancelBtn) cancelBtn.addEventListener('click', () => window.electronAPI.closeSettings());
  if (saveBtn) saveBtn.addEventListener('click', saveSettings);

  // --- Initialisation ---
  loadSettings();
});
