// Unit patterns to detect on pages - more specific patterns to avoid false positives
const UNIT_PATTERNS = {
  'imperial-to-metric': {
    'length-feet-inch': { regex: /\b(\d{1,2})\s*(?:feet|foot|ft|')\s*(\d{1,2})\s*(?:inches|inch|in|")\b/gi, type: 'feet-inch' },
    'length-inch': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:inches|inch|in)\b/gi, factor: 2.54, to: 'cm' },
    'length-feet': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:feet|foot|ft)\b/gi, factor: 0.3048, to: 'm' },
    'length-miles': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:miles|mile|mi)\b/gi, factor: 1.60934, to: 'km' },
    'area-sqin': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:square\s*inches?|sq\.?\s*in\.?|in²)\b/gi, factor: 6.4516, to: 'cm²' },
    'area-sqft': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:square\s*feet|square\s*foot|sq\.?\s*ft\.?|ft²)\b/gi, factor: 0.092903, to: 'm²' },
    'area-acres': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:acres?|ac)\b/gi, factor: 0.404686, to: 'ha' },
    'volume-cuyd': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:cubic\s*yards?|cu\.?\s*yd\.?|yd³)\b/gi, factor: 0.764555, to: 'm³' },
    'weight': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:pounds|pound|lbs|lb)\b/gi, factor: 0.453592, to: 'kg' },
    'weight-tons': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)[\s-]*(?:short[\s-]*tons?|tons?)\b/gi, factor: 0.907185, to: 'tonnes' },
    'volume': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:gallons|gallon|gal)\b/gi, factor: 3.78541, to: 'L' },
    'temperature': { regex: /(-?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*°\s*F\b/gi, type: 'temp-f' }
  },
  'metric-to-imperial': {
    'length-inch': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:centimeters|centimeter|cm)\b/gi, factor: 1 / 2.54, to: 'in' },
    'length-feet': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:meters|meter|m)\b(?!\w)/gi, factor: 1 / 0.3048, to: 'ft' },
    'length-miles': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:kilometers|kilometer|km)\b/gi, factor: 1 / 1.60934, to: 'mi' },
    'area-sqin': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:square\s*centimeters?|sq\.?\s*cm\.?|cm²)\b/gi, factor: 1 / 6.4516, to: 'sq in' },
    'area-sqft': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:square\s*meters?|sq\.?\s*m\.?|m²)\b/gi, factor: 1 / 0.092903, to: 'sq ft' },
    'area-acres': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:hectares?|ha)\b/gi, factor: 1 / 0.404686, to: 'acres' },
    'volume-cuyd': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:cubic\s*meters?|cu\.?\s*m\.?|m³|m3)\b/gi, factor: 1 / 0.764555, to: 'cu yd' },
    'weight': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:kilograms|kilogram|kg)\b/gi, factor: 1 / 0.453592, to: 'lbs' },
    'weight-tons': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)[\s-]*(?:tonnes?|metric\s*tons?)\b/gi, factor: 1 / 0.907185, to: 'tons' },
    'volume': { regex: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:liters|liter|L)\b/gi, factor: 1 / 3.78541, to: 'gal' },
    'temperature': { regex: /(-?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*°\s*C\b/gi, type: 'temp-c' }
  }
};

// Default settings
const DEFAULT_SETTINGS = {
  enabledUnits: {
    'length-feet-inch': true,
    'length-inch': true,
    'length-feet': true,
    'length-miles': true,
    'area-sqin': true,
    'area-sqft': true,
    'area-acres': true,
    'volume-cuyd': true,
    'weight': true,
    'weight-tons': true,
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

// Format number with commas
function formatNumber(num, precision) {
  const fixed = parseFloat(num).toFixed(precision);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
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

  // Skip if text already contains both °F and °C (conversion already shown)
  const hasBothTempUnits = /°\s*F/i.test(text) && /°\s*C/i.test(text);

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

  // Sort patterns so combined patterns (feet-inch) process first
  const sortedPatterns = Object.entries(patterns).sort(([keyA], [keyB]) => {
    if (keyA.includes('feet-inch')) return -1;
    if (keyB.includes('feet-inch')) return 1;
    return 0;
  });

  for (const [, pattern] of sortedPatterns) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    newHTML = newHTML.replace(regex, (match, value, value2) => {
      let converted;
      let toUnit;

      // Handle combined feet + inches pattern
      if (pattern.type === 'feet-inch') {
        const feet = parseNumber(value);
        const inches = parseNumber(value2);
        if (isNaN(feet) || isNaN(inches)) return match;
        // Convert to meters: (feet * 0.3048) + (inches * 0.0254)
        const totalMeters = (feet * 0.3048) + (inches * 0.0254);
        converted = formatNumber(totalMeters, precision);
        toUnit = 'm';
      } else {
        const numValue = parseNumber(value);
        if (isNaN(numValue)) return match;

        if (pattern.type === 'temp-f') {
          converted = formatNumber((numValue - 32) * 5 / 9, precision);
          toUnit = '°C';
        } else if (pattern.type === 'temp-c') {
          converted = formatNumber(numValue * 9 / 5 + 32, precision);
          toUnit = '°F';
        } else {
          converted = formatNumber(numValue * pattern.factor, precision);
          toUnit = pattern.to;
        }
      }

      // Display mode: badge (addition) or replace (overwrite)
      if (displayMode === 'replace') {
        return `<span class="unit-converted unit-wrapper" title="Original: ${match}">${converted} ${toUnit}</span>`;
      } else {
        const tooltipAttr = showTooltip ? `title="${converted} ${toUnit}"` : '';
        // For combined patterns, add zero-width space to prevent individual patterns from matching
        const displayMatch = pattern.type === 'feet-inch'
          ? match.replace(/\b(ft|feet|foot|in|inch|inches)\b/gi, '$1\u200B')
          : match;
        return `<span class="unit-converted unit-wrapper" ${tooltipAttr}>${displayMatch} <sup class="unit-badge" style="background:${badgeColor}">(${converted} ${toUnit})</sup></span>`;
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
