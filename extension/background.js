function updateIcon(unitType, autoConvertEnabled) {
  chrome.action.setIcon({
    path: {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
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
