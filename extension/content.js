// Unit patterns to detect on pages - more specific patterns to avoid false positives
const UNIT_PATTERNS = {
  'imperial-to-metric': {
    'length-inch': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:inches|inch|in)\b/gi, factor: 2.54, to: 'cm' },
    'length-feet': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:feet|foot|ft)\b/gi, factor: 0.3048, to: 'm' },
    'length-miles': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:miles|mile|mi)\b/gi, factor: 1.60934, to: 'km' },
    'weight': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:pounds|pound|lbs|lb)\b/gi, factor: 0.453592, to: 'kg' },
    'volume': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:gallons|gallon|gal)\b/gi, factor: 3.78541, to: 'L' },
    'temperature': { regex: /\b(\d{1,3}(?:\.\d+)?)\s*°F\b/gi, type: 'temp-f' }
  },
  'metric-to-imperial': {
    'length-inch': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:centimeters|centimeter|cm)\b/gi, factor: 1/2.54, to: 'in' },
    'length-feet': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:meters|meter|m)\b(?!\w)/gi, factor: 1/0.3048, to: 'ft' },
    'length-miles': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:kilometers|kilometer|km)\b/gi, factor: 1/1.60934, to: 'mi' },
    'weight': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:kilograms|kilogram|kg)\b/gi, factor: 1/0.453592, to: 'lbs' },
    'volume': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:liters|liter|L)\b/gi, factor: 1/3.78541, to: 'gal' },
    'temperature': { regex: /\b(\d{1,3}(?:\.\d+)?)\s*°C\b/gi, type: 'temp-c' }
  }
};

// Default settings
const DEFAULT_SETTINGS = {
  enabledUnits: {
    'length-inch': true,
    'length-feet': true,
    'length-miles': true,
    'weight': true,
    'volume': true,
    'temperature': true
  },
  displayMode: 'replace',
  precision: 2,
  badgeColor: '#4a90d9',
  showTooltip: true
};

let isEnabled = false;
let currentDirection = 'imperial-to-metric';
let settings = DEFAULT_SETTINGS;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleAutoConvert') {
    isEnabled = message.enabled;
    currentDirection = message.direction || currentDirection;
    if (isEnabled) {
      removeConversions();
      scanAndConvert();
    } else {
      removeConversions();
    }
  } else if (message.action === 'updateDirection') {
    currentDirection = message.direction;
    if (isEnabled) {
      removeConversions();
      scanAndConvert();
    }
  } else if (message.action === 'settingsUpdated') {
    settings = message.settings;
    if (isEnabled) {
      removeConversions();
      scanAndConvert();
    }
  }
});

// Check initial state on load
chrome.storage.sync.get(['autoConvert', 'direction', 'settings'], (result) => {
  isEnabled = result.autoConvert || false;
  currentDirection = result.direction || 'imperial-to-metric';
  settings = result.settings || DEFAULT_SETTINGS;
  if (isEnabled) {
    // Small delay to let page render
    setTimeout(() => scanAndConvert(), 500);
  }
});

// Parse number with commas
function parseNumber(str) {
  return parseFloat(str.replace(/,/g, ''));
}

// Scan page and add conversions
function scanAndConvert() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    const parent = node.parentElement;
    if (parent && 
        !parent.closest('script') && 
        !parent.closest('style') && 
        !parent.closest('.unit-converted') &&
        !parent.closest('.unit-wrapper') &&
        !parent.closest('input') &&
        !parent.closest('textarea') &&
        !parent.closest('code') &&
        !parent.closest('pre') &&
        node.textContent.trim().length > 0) {
      textNodes.push(node);
    }
  }

  // Get only enabled patterns
  const allPatterns = UNIT_PATTERNS[currentDirection];
  const enabledPatterns = {};
  for (const [unitType, pattern] of Object.entries(allPatterns)) {
    if (settings.enabledUnits?.[unitType] !== false) {
      enabledPatterns[unitType] = { ...pattern, regex: new RegExp(pattern.regex.source, pattern.regex.flags) };
    }
  }
  
  textNodes.forEach(textNode => {
    processTextNode(textNode, enabledPatterns);
  });
}

// Process a text node and wrap matched units
function processTextNode(textNode, patterns) {
  const text = textNode.textContent;
  const parent = textNode.parentElement;
  
  if (!parent) return;
  
  // Check if any pattern matches
  let hasMatch = false;
  for (const pattern of Object.values(patterns)) {
    const testRegex = new RegExp(pattern.regex.source, pattern.regex.flags);
    if (testRegex.test(text)) {
      hasMatch = true;
      break;
    }
  }
  
  if (!hasMatch) return;
  
  let newHTML = text;
  const displayMode = settings.displayMode || 'badge';
  const precision = settings.precision ?? 2;
  const badgeColor = settings.badgeColor || '#4a90d9';
  const showTooltip = settings.showTooltip ?? true;
  
  for (const pattern of Object.values(patterns)) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    newHTML = newHTML.replace(regex, (match, value) => {
      const numValue = parseNumber(value);
      if (isNaN(numValue)) return match;
      
      let converted;
      let toUnit;
      
      if (pattern.type === 'temp-f') {
        converted = ((numValue - 32) * 5/9).toFixed(precision);
        toUnit = '°C';
      } else if (pattern.type === 'temp-c') {
        converted = (numValue * 9/5 + 32).toFixed(precision);
        toUnit = '°F';
      } else {
        converted = (numValue * pattern.factor).toFixed(precision);
        toUnit = pattern.to;
      }
      
      // Display mode: badge (addition) or replace (overwrite)
      if (displayMode === 'replace') {
        return `<span class="unit-converted unit-wrapper" title="Original: ${match}">${converted} ${toUnit}</span>`;
      } else {
        const tooltipAttr = showTooltip ? `title="${converted} ${toUnit}"` : '';
        return `<span class="unit-converted unit-wrapper" ${tooltipAttr}>${match}<sup class="unit-badge" style="background:${badgeColor}">${converted} ${toUnit}</sup></span>`;
      }
    });
  }
  
  if (newHTML !== text) {
    const wrapper = document.createElement('span');
    wrapper.className = 'unit-wrapper';
    wrapper.innerHTML = newHTML;
    parent.replaceChild(wrapper, textNode);
  }
}

// Remove all conversions
function removeConversions() {
  document.querySelectorAll('.unit-wrapper').forEach(el => {
    // Get the original text without badges
    const badges = el.querySelectorAll('.unit-badge');
    badges.forEach(b => b.remove());
    
    // Remove converted spans
    el.querySelectorAll('.unit-converted').forEach(span => {
      span.outerHTML = span.textContent;
    });
    
    // Replace wrapper with text content
    const textContent = el.textContent;
    el.outerHTML = textContent;
  });
}
