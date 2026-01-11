// Default settings
const DEFAULT_SETTINGS = {
  enabledUnits: {
    // Length
    'length-feet-inch': true,
    'length-inch': true,
    'length-feet': true,
    'length-yards': true,
    'length-miles': true,
    'length-nmi': true,
    'length-mm': true,
    'length-cm': true,
    'length-m': true,
    'length-km': true,
    // Area
    'area-sqin': true,
    'area-sqft': true,
    'area-sqyd': true,
    'area-sqmi': true,
    'area-acres': true,
    'area-sqcm': true,
    'area-sqm': true,
    'area-sqkm': true,
    'area-ha': true,
    // Volume
    'volume-cuin': true,
    'volume-cuft': true,
    'volume-cuyd': true,
    'volume-floz': true,
    'volume-tsp': true,
    'volume-tbsp': true,
    'volume-cups': true,
    'volume-pints': true,
    'volume-quarts': true,
    'volume-gallons': true,
    'volume-cucm': true,
    'volume-cum': true,
    'volume-ml': true,
    'volume-l': true,
    // Weight
    'weight-oz': true,
    'weight-lbs': true,
    'weight-stone': true,
    'weight-long-tons': true,
    'weight-tons': true,
    'weight-g': true,
    'weight-kg': true,
    'weight-tonnes': true,
    // Speed
    'speed-mph': true,
    'speed-knots': true,
    'speed-kmh': true,
    // Pressure
    'pressure-psi': true,
    'pressure-kpa': true,
    'pressure-bar': true,
    // Temperature
    'temperature': true,
    'temperature-k': true
  },
  displayMode: 'replace',
  precision: 2,
  badgeColor: '#4a90d9',
  showTooltip: true
};

// DOM Elements
const unitCheckboxes = document.querySelectorAll('[data-unit]');
const displayModeSelect = document.getElementById('displayMode');
const precisionSelect = document.getElementById('precision');
const badgeColorInput = document.getElementById('badgeColor');
const badgeColorRow = document.getElementById('badgeColorRow');
const showTooltipCheckbox = document.getElementById('showTooltip');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusDiv = document.getElementById('status');

// Load settings on page load
chrome.storage.sync.get(['settings'], (result) => {
  const settings = result.settings || DEFAULT_SETTINGS;
  applySettingsToUI(settings);
});

// Apply settings to UI
function applySettingsToUI(settings) {
  // Unit checkboxes
  unitCheckboxes.forEach(cb => {
    const unit = cb.dataset.unit;
    cb.checked = settings.enabledUnits?.[unit] ?? true;
  });

  // Display mode
  displayModeSelect.value = settings.displayMode || 'badge';
  updateBadgeColorVisibility();

  // Precision
  precisionSelect.value = settings.precision ?? 2;

  // Badge color
  badgeColorInput.value = settings.badgeColor || '#4a90d9';

  // Tooltip
  showTooltipCheckbox.checked = settings.showTooltip ?? true;
}

// Toggle badge color visibility based on display mode
function updateBadgeColorVisibility() {
  badgeColorRow.style.display = displayModeSelect.value === 'replace' ? 'none' : 'flex';
}

// Listen for display mode changes
displayModeSelect.addEventListener('change', updateBadgeColorVisibility);

// Save settings
saveBtn.addEventListener('click', () => {
  const settings = {
    enabledUnits: {},
    displayMode: displayModeSelect.value,
    precision: parseInt(precisionSelect.value),
    badgeColor: badgeColorInput.value,
    showTooltip: showTooltipCheckbox.checked
  };

  unitCheckboxes.forEach(cb => {
    settings.enabledUnits[cb.dataset.unit] = cb.checked;
  });

  chrome.storage.sync.set({ settings }, () => {
    showStatus('Settings saved!', 'success');

    // Notify content scripts to refresh
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated', settings }).catch(() => { });
      });
    });
  });
});

// Reset to defaults
resetBtn.addEventListener('click', () => {
  applySettingsToUI(DEFAULT_SETTINGS);
  chrome.storage.sync.set({ settings: DEFAULT_SETTINGS }, () => {
    showStatus('Reset to defaults!', 'success');
  });
});

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  setTimeout(() => {
    statusDiv.className = 'status';
  }, 2000);
}
