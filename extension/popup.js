const CONVERSIONS = {
  // Length
  'small-distance': {
    'metric-to-imperial': { factor: 1 / 2.54, from: 'cm', to: 'in', label: 'cm → in' },
    'imperial-to-metric': { factor: 2.54, from: 'in', to: 'cm', label: 'in → cm' }
  },
  'medium-distance': {
    'metric-to-imperial': { factor: 1 / 0.3048, from: 'm', to: 'ft', label: 'm → ft' },
    'imperial-to-metric': { factor: 0.3048, from: 'ft', to: 'm', label: 'ft → m' }
  },
  'yards': {
    'metric-to-imperial': { factor: 1 / 0.9144, from: 'm', to: 'yd', label: 'm → yd' },
    'imperial-to-metric': { factor: 0.9144, from: 'yd', to: 'm', label: 'yd → m' }
  },
  'far-distance': {
    'metric-to-imperial': { factor: 1 / 1.60934, from: 'km', to: 'mi', label: 'km → mi' },
    'imperial-to-metric': { factor: 1.60934, from: 'mi', to: 'km', label: 'mi → km' }
  },
  'mm': {
    'metric-to-imperial': { factor: 1 / 25.4, from: 'mm', to: 'in', label: 'mm → in' },
    'imperial-to-metric': { factor: 25.4, from: 'in', to: 'mm', label: 'in → mm' }
  },
  // Area
  'area-sqin': {
    'metric-to-imperial': { factor: 1 / 6.4516, from: 'cm²', to: 'sq in', label: 'cm² → sq in' },
    'imperial-to-metric': { factor: 6.4516, from: 'sq in', to: 'cm²', label: 'sq in → cm²' }
  },
  'area-sqft': {
    'metric-to-imperial': { factor: 1 / 0.092903, from: 'm²', to: 'sq ft', label: 'm² → sq ft' },
    'imperial-to-metric': { factor: 0.092903, from: 'sq ft', to: 'm²', label: 'sq ft → m²' }
  },
  'area-acres': {
    'metric-to-imperial': { factor: 1 / 0.404686, from: 'ha', to: 'acres', label: 'ha → acres' },
    'imperial-to-metric': { factor: 0.404686, from: 'acres', to: 'ha', label: 'acres → ha' }
  },
  // Volume
  'floz': {
    'metric-to-imperial': { factor: 1 / 29.5735, from: 'mL', to: 'fl oz', label: 'mL → fl oz' },
    'imperial-to-metric': { factor: 29.5735, from: 'fl oz', to: 'mL', label: 'fl oz → mL' }
  },
  'cups': {
    'metric-to-imperial': { factor: 1 / 236.588, from: 'mL', to: 'cups', label: 'mL → cups' },
    'imperial-to-metric': { factor: 236.588, from: 'cups', to: 'mL', label: 'cups → mL' }
  },
  'pints': {
    'metric-to-imperial': { factor: 1 / 0.473176, from: 'L', to: 'pt', label: 'L → pt' },
    'imperial-to-metric': { factor: 0.473176, from: 'pt', to: 'L', label: 'pt → L' }
  },
  'volume': {
    'metric-to-imperial': { factor: 1 / 3.78541, from: 'L', to: 'gal', label: 'L → gal' },
    'imperial-to-metric': { factor: 3.78541, from: 'gal', to: 'L', label: 'gal → L' }
  },
  // Weight
  'oz': {
    'metric-to-imperial': { factor: 1 / 28.3495, from: 'g', to: 'oz', label: 'g → oz' },
    'imperial-to-metric': { factor: 28.3495, from: 'oz', to: 'g', label: 'oz → g' }
  },
  'weight': {
    'metric-to-imperial': { factor: 1 / 0.453592, from: 'kg', to: 'lbs', label: 'kg → lbs' },
    'imperial-to-metric': { factor: 0.453592, from: 'lbs', to: 'kg', label: 'lbs → kg' }
  },
  'stone': {
    'metric-to-imperial': { factor: 1 / 6.35029, from: 'kg', to: 'st', label: 'kg → st' },
    'imperial-to-metric': { factor: 6.35029, from: 'st', to: 'kg', label: 'st → kg' }
  },
  // Speed
  'speed': {
    'metric-to-imperial': { factor: 1 / 1.60934, from: 'km/h', to: 'mph', label: 'km/h → mph' },
    'imperial-to-metric': { factor: 1.60934, from: 'mph', to: 'km/h', label: 'mph → km/h' }
  },
  'knots': {
    'metric-to-imperial': { factor: 1 / 1.852, from: 'km/h', to: 'kn', label: 'km/h → kn' },
    'imperial-to-metric': { factor: 1.852, from: 'kn', to: 'km/h', label: 'kn → km/h' }
  },
  // Pressure
  'pressure': {
    'metric-to-imperial': { factor: 1 / 6.89476, from: 'kPa', to: 'psi', label: 'kPa → psi' },
    'imperial-to-metric': { factor: 6.89476, from: 'psi', to: 'kPa', label: 'psi → kPa' }
  },
  // Temperature
  'temperature': {
    'metric-to-imperial': { convert: (c) => c * 9 / 5 + 32, from: '°C', to: '°F', label: '°C → °F' },
    'imperial-to-metric': { convert: (f) => (f - 32) * 5 / 9, from: '°F', to: '°C', label: '°F → °C' }
  },
  'kelvin': {
    'metric-to-imperial': { convert: (c) => c + 273.15, from: '°C', to: 'K', label: '°C → K' },
    'imperial-to-metric': { convert: (k) => k - 273.15, from: 'K', to: '°C', label: 'K → °C' }
  }
};

let selectedUnit = 'small-distance';
let direction = 'imperial-to-metric';

const autoConvertToggle = document.getElementById('autoConvertToggle');
const unitButtons = document.querySelectorAll('.unit-btn');
const directionInputs = document.querySelectorAll('input[name="direction"]');
const inputValue = document.getElementById('inputValue');
const convertBtn = document.getElementById('convertBtn');
const resultValue = document.getElementById('resultValue');

chrome.storage.sync.get(['autoConvert', 'direction', 'selectedUnit'], (result) => {
  autoConvertToggle.checked = result.autoConvert || false;
  if (result.direction) {
    direction = result.direction;
    document.querySelector(`input[value="${direction}"]`).checked = true;
    updateButtonLabels();
  }
  if (result.selectedUnit) {
    selectedUnit = result.selectedUnit;
    unitButtons.forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-unit="${selectedUnit}"]`)?.classList.add('active');
  }
  updatePlaceholder();
});

autoConvertToggle.addEventListener('change', () => {
  const enabled = autoConvertToggle.checked;
  chrome.storage.sync.set({ autoConvert: enabled });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleAutoConvert',
        enabled: enabled,
        direction: direction
      }).catch(() => { });
    }
  });
});

directionInputs.forEach(input => {
  input.addEventListener('change', (e) => {
    direction = e.target.value;
    chrome.storage.sync.set({ direction: direction });
    updateButtonLabels();
    updatePlaceholder();

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id && autoConvertToggle.checked) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateDirection',
          direction: direction
        }).catch(() => { });
      }
    });
  });
});

unitButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    unitButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedUnit = btn.dataset.unit;
    chrome.storage.sync.set({ selectedUnit: selectedUnit });
    updatePlaceholder();
  });
});

function updateButtonLabels() {
  unitButtons.forEach(btn => {
    const unitKey = btn.dataset.unit;
    const conv = CONVERSIONS[unitKey][direction];
    btn.textContent = conv.label;
  });
}

function updatePlaceholder() {
  const conv = CONVERSIONS[selectedUnit][direction];
  inputValue.placeholder = `Enter ${conv.from}...`;
}

convertBtn.addEventListener('click', convert);

inputValue.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') convert();
});

// Format number with commas
function formatNumber(num, precision) {
  const fixed = parseFloat(num).toFixed(precision);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function convert() {
  const value = parseFloat(inputValue.value);

  if (isNaN(value)) {
    resultValue.textContent = 'Enter a number';
    return;
  }

  const conv = CONVERSIONS[selectedUnit][direction];
  let result;

  if (conv.convert) {
    result = conv.convert(value);
  } else {
    result = value * conv.factor;
  }

  resultValue.textContent = `${formatNumber(result, 2)} ${conv.to}`;
}

updateButtonLabels();
updatePlaceholder();
