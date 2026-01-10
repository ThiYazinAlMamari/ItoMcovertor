const CONVERSIONS = {
  'small-distance': {
    'metric-to-imperial': { factor: 1/2.54, from: 'cm', to: 'in', label: 'cm → in' },
    'imperial-to-metric': { factor: 2.54, from: 'in', to: 'cm', label: 'in → cm' }
  },
  'medium-distance': {
    'metric-to-imperial': { factor: 1/0.3048, from: 'm', to: 'ft', label: 'm → ft' },
    'imperial-to-metric': { factor: 0.3048, from: 'ft', to: 'm', label: 'ft → m' }
  },
  'far-distance': {
    'metric-to-imperial': { factor: 1/1.60934, from: 'km', to: 'mi', label: 'km → mi' },
    'imperial-to-metric': { factor: 1.60934, from: 'mi', to: 'km', label: 'mi → km' }
  },
  'weight': {
    'metric-to-imperial': { factor: 1/0.453592, from: 'kg', to: 'lbs', label: 'kg → lbs' },
    'imperial-to-metric': { factor: 0.453592, from: 'lbs', to: 'kg', label: 'lbs → kg' }
  },
  'volume': {
    'metric-to-imperial': { factor: 1/3.78541, from: 'L', to: 'gal', label: 'L → gal' },
    'imperial-to-metric': { factor: 3.78541, from: 'gal', to: 'L', label: 'gal → L' }
  },
  'temperature': {
    'metric-to-imperial': { convert: (c) => c * 9/5 + 32, from: '°C', to: '°F', label: '°C → °F' },
    'imperial-to-metric': { convert: (f) => (f - 32) * 5/9, from: '°F', to: '°C', label: '°F → °C' }
  }
};

let selectedUnit = 'small-distance';
let direction = 'metric-to-imperial';

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
      }).catch(() => {});
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
        }).catch(() => {});
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
  
  resultValue.textContent = `${result.toFixed(2)} ${conv.to}`;
}

updateButtonLabels();
updatePlaceholder();
