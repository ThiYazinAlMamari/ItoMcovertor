/**
 * ItoMcovertor Extension - Compact Popup Logic
 * Top 10 most used conversions with dynamic labels
 */

// Conversion definitions - bidirectional (first unit to second and vice versa)
const CONVERSIONS = {
  'in-cm': {
    imperial: 'in', metric: 'cm',
    forward: { factor: 2.54, from: 'in', to: 'cm' },
    reverse: { factor: 1 / 2.54, from: 'cm', to: 'in' }
  },
  'ft-m': {
    imperial: 'ft', metric: 'm',
    forward: { factor: 0.3048, from: 'ft', to: 'm' },
    reverse: { factor: 1 / 0.3048, from: 'm', to: 'ft' }
  },
  'mi-km': {
    imperial: 'mi', metric: 'km',
    forward: { factor: 1.60934, from: 'mi', to: 'km' },
    reverse: { factor: 1 / 1.60934, from: 'km', to: 'mi' }
  },
  'lbs-kg': {
    imperial: 'lbs', metric: 'kg',
    forward: { factor: 0.453592, from: 'lbs', to: 'kg' },
    reverse: { factor: 2.20462, from: 'kg', to: 'lbs' }
  },
  'oz-g': {
    imperial: 'oz', metric: 'g',
    forward: { factor: 28.3495, from: 'oz', to: 'g' },
    reverse: { factor: 1 / 28.3495, from: 'g', to: 'oz' }
  },
  'gal-L': {
    imperial: 'gal', metric: 'L',
    forward: { factor: 3.78541, from: 'gal', to: 'L' },
    reverse: { factor: 0.264172, from: 'L', to: 'gal' }
  },
  'F-C': {
    imperial: 'F', metric: 'C',
    forward: { convert: (f) => (f - 32) * 5 / 9, from: 'F', to: 'C' },
    reverse: { convert: (c) => c * 9 / 5 + 32, from: 'C', to: 'F' }
  },
  'sqft-sqm': {
    imperial: 'sq ft', metric: 'm2',
    forward: { factor: 0.092903, from: 'sq ft', to: 'm2' },
    reverse: { factor: 1 / 0.092903, from: 'm2', to: 'sq ft' }
  },
  'mph-kmh': {
    imperial: 'mph', metric: 'km/h',
    forward: { factor: 1.60934, from: 'mph', to: 'km/h' },
    reverse: { factor: 1 / 1.60934, from: 'km/h', to: 'mph' }
  },
  'fl oz-ml': {
    imperial: 'fl oz', metric: 'ml',
    forward: { factor: 29.5735, from: 'fl oz', to: 'ml' },
    reverse: { factor: 1 / 29.5735, from: 'ml', to: 'fl oz' }
  }
};

// State
let selectedUnit = 'in-cm';
let direction = 'forward';
let autoConvert = false;
let settings = {
  precision: 4,
  numberGrouping: true,
  scientificNotation: true,
  rounding: 'round',
  selectionPopup: true,
  badgeStyle: 'badge'
};

// DOM Elements - Main View
const autoConvertToggle = document.getElementById('autoConvertToggle');
const directionSelect = document.getElementById('directionSelect');
const convertPageBtn = document.getElementById('convertPageBtn');
const clearBadgesBtn = document.getElementById('clearBadgesBtn');
const inputValue = document.getElementById('inputValue');
const unitSelect = document.getElementById('unitSelect');
const resultValue = document.getElementById('resultValue');
const resultUnit = document.getElementById('resultUnit');
const settingsBtn = document.getElementById('settingsBtn');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Load saved state
  const stored = await chrome.storage.sync.get([
    'autoConvert', 'direction', 'selectedUnit',
    'precision', 'numberGrouping', 'scientificNotation', 'rounding', 'selectionPopup', 'badgeStyle'
  ]);
  
  if (stored.autoConvert !== undefined) {
    autoConvert = stored.autoConvert;
    autoConvertToggle.checked = autoConvert;
  }
  
  if (stored.direction) {
    if (stored.direction === 'imperial-to-metric') {
      direction = 'forward';
      directionSelect.value = 'imperial-to-metric';
    } else {
      direction = 'reverse';
      directionSelect.value = 'metric-to-imperial';
    }
  }
  
  if (stored.selectedUnit && CONVERSIONS[stored.selectedUnit]) {
    selectedUnit = stored.selectedUnit;
  }
  
  // Load settings
  if (stored.precision !== undefined) settings.precision = stored.precision;
  if (stored.numberGrouping !== undefined) settings.numberGrouping = stored.numberGrouping;
  if (stored.scientificNotation !== undefined) settings.scientificNotation = stored.scientificNotation;
  if (stored.rounding !== undefined) settings.rounding = stored.rounding;
  
  updateUnitLabels();
  unitSelect.value = selectedUnit;
  setupEventListeners();
  performConversion();
}

function setupEventListeners() {
  // Settings - open in new tab
  settingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
  
  // Auto-convert toggle
  autoConvertToggle.addEventListener('change', async () => {
    autoConvert = autoConvertToggle.checked;
    await chrome.storage.sync.set({ autoConvert });
    const dir = directionSelect.value;
    sendMessage({ type: 'UPDATE_SETTINGS', autoConvert, direction: dir });
  });
  
  // Direction change
  directionSelect.addEventListener('change', async () => {
    const dir = directionSelect.value;
    direction = dir === 'imperial-to-metric' ? 'forward' : 'reverse';
    await chrome.storage.sync.set({ direction: dir });
    updateUnitLabels();
    sendMessage({ type: 'UPDATE_SETTINGS', autoConvert, direction: dir });
    performConversion();
  });
  
  // Convert This Page
  convertPageBtn.addEventListener('click', () => {
    const dir = directionSelect.value;
    sendMessage({ type: 'CONVERT_PAGE', direction: dir });
  });
  
  // Clear Badges
  clearBadgesBtn.addEventListener('click', () => {
    sendMessage({ type: 'CLEAR_BADGES' });
  });
  
  // Unit selection
  unitSelect.addEventListener('change', async () => {
    selectedUnit = unitSelect.value;
    await chrome.storage.sync.set({ selectedUnit });
    performConversion();
  });
  
  // Live conversion on input
  inputValue.addEventListener('input', performConversion);
}

function updateUnitLabels() {
  const options = unitSelect.querySelectorAll('option');
  
  options.forEach(option => {
    const unitKey = option.value;
    const conv = CONVERSIONS[unitKey];
    if (conv) {
      if (direction === 'forward') {
        option.textContent = `${conv.imperial} \u2192 ${conv.metric}`;
      } else {
        option.textContent = `${conv.metric} \u2192 ${conv.imperial}`;
      }
    }
  });
}

function performConversion() {
  const value = parseFloat(inputValue.value);
  
  if (isNaN(value) || inputValue.value === '') {
    resultValue.textContent = '-';
    resultValue.classList.add('placeholder');
    resultUnit.textContent = '';
    return;
  }
  
  resultValue.classList.remove('placeholder');
  
  const convSet = CONVERSIONS[selectedUnit];
  if (!convSet) return;
  
  const conv = convSet[direction];
  let result;
  
  if (conv.convert) {
    result = conv.convert(value);
  } else {
    result = value * conv.factor;
  }
  
  resultValue.textContent = formatNumber(result);
  resultUnit.textContent = conv.to;
}

function formatNumber(value) {
  const decimals = settings.precision;
  const multiplier = Math.pow(10, decimals);
  
  // Apply rounding mode
  let rounded;
  switch (settings.rounding) {
    case 'floor':
      rounded = Math.floor(value * multiplier) / multiplier;
      break;
    case 'ceiling':
      rounded = Math.ceil(value * multiplier) / multiplier;
      break;
    default:
      rounded = Math.round(value * multiplier) / multiplier;
  }
  
  // Scientific notation for very small/large numbers
  if (settings.scientificNotation && rounded !== 0 && (Math.abs(rounded) < 0.0001 || Math.abs(rounded) > 999999999)) {
    return rounded.toExponential(decimals);
  }
  
  if (settings.numberGrouping) {
    return rounded.toLocaleString('en-US', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: 0
    });
  } else {
    return String(rounded);
  }
}

async function sendMessage(message) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    }
  } catch (e) {
    // Ignore
  }
}
