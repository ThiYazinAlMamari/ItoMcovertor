const UNIT_ICONS = {
  'small-distance': 'icon_length',
  'medium-distance': 'icon_length', 
  'far-distance': 'icon_distance',
  'weight': 'icon_weight',
  'volume': 'icon_volume',
  'temperature': 'icon_temperature'
};

function updateIcon(unitType, autoConvertEnabled) {
  const baseIcon = UNIT_ICONS[unitType] || 'icon_temperature';
  const iconPrefix = autoConvertEnabled ? baseIcon : `${baseIcon}_off`;
  
  chrome.action.setIcon({
    path: {
      "16": `icons/${iconPrefix}_16.png`,
      "48": `icons/${iconPrefix}_48.png`,
      "128": `icons/${iconPrefix}_128.png`
    }
  });
  
  const unitLabels = {
    'small-distance': 'cm ↔ Inches',
    'medium-distance': 'm ↔ Feet',
    'far-distance': 'km ↔ Miles',
    'weight': 'kg ↔ lbs',
    'volume': 'L ↔ Gallons',
    'temperature': '°C ↔ °F'
  };
  
  const unitLabel = unitLabels[unitType] || 'Unit Converter';
  const status = autoConvertEnabled ? 'ON' : 'OFF';
  
  chrome.action.setTitle({
    title: `${unitLabel} (Auto-Convert ${status})`
  });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    chrome.storage.sync.get(['autoConvert', 'selectedUnit'], (result) => {
      updateIcon(result.selectedUnit || 'temperature', result.autoConvert || false);
    });
  }
});

chrome.storage.sync.get(['autoConvert', 'selectedUnit'], (result) => {
  updateIcon(result.selectedUnit || 'temperature', result.autoConvert || false);
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['autoConvert', 'selectedUnit'], (result) => {
    updateIcon(result.selectedUnit || 'temperature', result.autoConvert || false);
  });
});
