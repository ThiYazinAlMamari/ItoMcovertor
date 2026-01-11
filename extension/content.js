// Shared building blocks for regex patterns
const NUM = String.raw`-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?`; // 1,234.56 or 1234.56
const WS = String.raw`\s*`;

// Common unit token sets
const FT_TOKENS = String.raw`feet|foot|ft|'|′`;
const IN_TOKENS = String.raw`inches|inch|in|"|″`;
const DEG_F_TOKENS = String.raw`°?\s*F`;  // allows: F, °F, ° F
const DEG_C_TOKENS = String.raw`°?\s*C`;
const DEG_K_TOKENS = String.raw`°?\s*K|kelvin`;  // allows: K, °K, ° K, kelvin

// Unit patterns to detect on pages - more specific patterns to avoid false positives
// IMPORTANT: Order matters! Match longer/more-specific units first (mm before m, fl oz before oz, etc.)
const UNIT_PATTERNS = {
  'imperial-to-metric': {
    // === LENGTH ===
    // Matches: 5'11", 5 ft 11 in, 5′ 11″ (inches optional)
    'length-feet-inch': {
      regex: new RegExp(
        String.raw`(?:^|[^\w])(\d{1,2})${WS}(?:${FT_TOKENS})${WS}(?:(\d{1,2})${WS}(?:${IN_TOKENS}))?(?=$|[^\w])`,
        'giu'
      ),
      type: 'feet-inch'
    },

    'length-inch': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:${IN_TOKENS})\b`, 'giu'),
      factor: 2.54,
      to: 'cm'
    },

    'length-feet': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:feet|foot|ft)\b`, 'giu'),
      factor: 0.3048,
      to: 'm'
    },

    'length-yards': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:yards?|yd)\b`, 'giu'),
      factor: 0.9144,
      to: 'm'
    },

    'length-miles': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:miles|mile|mi)\b`, 'giu'),
      factor: 1.60934,
      to: 'km'
    },

    'length-nmi': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:nautical${WS}miles?|nmi?|nm)\b`, 'giu'),
      factor: 1.852,
      to: 'km'
    },

    // === AREA ===
    'area-sqin': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:square${WS}inches?|sq\.?${WS}in\.?|in²|in2)\b`,
        'giu'
      ),
      factor: 6.4516,
      to: 'cm²'
    },

    'area-sqft': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:square${WS}feet|square${WS}foot|sq\.?${WS}ft\.?|ft²|ft2)\b`,
        'giu'
      ),
      factor: 0.092903,
      to: 'm²'
    },

    'area-sqyd': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:square${WS}yards?|sq\.?${WS}yd\.?|yd²|yd2)\b`,
        'giu'
      ),
      factor: 0.836127,
      to: 'm²'
    },

    'area-sqmi': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:square${WS}miles?|sq\.?${WS}mi\.?|mi²|mi2)\b`,
        'giu'
      ),
      factor: 2.58999,
      to: 'km²'
    },

    'area-acres': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:acres?|ac)\b`, 'giu'),
      factor: 0.404686,
      to: 'ha'
    },

    // === VOLUME ===
    // Match cubic units first (more specific)
    'volume-cuin': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:cubic${WS}inches?|cu\.?${WS}in\.?|in³|in3)\b`,
        'giu'
      ),
      factor: 16.3871,
      to: 'cm³'
    },

    'volume-cuft': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:cubic${WS}feet|cubic${WS}foot|cu\.?${WS}ft\.?|ft³|ft3)\b`,
        'giu'
      ),
      factor: 0.0283168,
      to: 'm³'
    },

    'volume-cuyd': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:cubic${WS}yards?|cu\.?${WS}yd\.?|yd³|yd3)\b`,
        'giu'
      ),
      factor: 0.764555,
      to: 'm³'
    },

    // Match fl oz BEFORE oz (more specific first)
    'volume-floz': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:fluid${WS}ounces?|fl\.?${WS}oz\.?|fl${WS}oz)\b`, 'giu'),
      factor: 29.5735,
      to: 'mL'
    },

    'volume-tsp': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:teaspoons?|tsp)\b`, 'giu'),
      factor: 4.92892,
      to: 'mL'
    },

    'volume-tbsp': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:tablespoons?|tbsp)\b`, 'giu'),
      factor: 14.7868,
      to: 'mL'
    },

    'volume-cups': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:cups?)\b`, 'giu'),
      factor: 236.588,
      to: 'mL'
    },

    'volume-pints': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:pints?|pt)\b`, 'giu'),
      factor: 0.473176,  // US pint
      to: 'L'
    },

    'volume-quarts': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:quarts?|qt)\b`, 'giu'),
      factor: 0.946353,  // US quart
      to: 'L'
    },

    'volume-gallons': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:gallons?|gal)\b`, 'giu'),
      factor: 3.78541,  // US gallon
      to: 'L'
    },

    // === WEIGHT / MASS ===
    // Match oz AFTER fl oz (less specific)
    'weight-oz': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:ounces?|oz)\b(?!${WS}fl)`, 'giu'),
      factor: 28.3495,
      to: 'g'
    },

    'weight-lbs': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:pounds?|lbs?)\b`, 'giu'),
      factor: 0.453592,
      to: 'kg'
    },

    'weight-stone': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:stones?|st)\b`, 'giu'),
      factor: 6.35029,
      to: 'kg'
    },

    // Long tons (UK/Imperial) MUST come before short tons (more specific first)
    'weight-long-tons': {
      regex: new RegExp(
        String.raw`\b(${NUM})[\s-]*(?:long[\s-]*tons?)\b`,
        'giu'
      ),
      factor: 1.01605,
      to: 'tonnes'
    },

    'weight-tons': {
      regex: new RegExp(
        String.raw`\b(${NUM})[\s-]*(?:short[\s-]*tons?|tons?)\b`,
        'giu'
      ),
      factor: 0.907185,
      to: 'tonnes'
    },

    // === SPEED ===
    'speed-mph': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:miles?${WS}per${WS}hour|mph|mi\/h)\b`, 'giu'),
      factor: 1.60934,
      to: 'km/h'
    },

    'speed-knots': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:knots?|kn|kt)\b`, 'giu'),
      factor: 1.852,
      to: 'km/h'
    },

    // === PRESSURE ===
    'pressure-psi': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:psi|pounds?${WS}per${WS}square${WS}inch)\b`, 'giu'),
      factor: 6.89476,
      to: 'kPa'
    },

    // === TEMPERATURE ===
    'temperature': {
      regex: new RegExp(String.raw`(${NUM})${WS}(?:${DEG_F_TOKENS})\b`, 'giu'),
      type: 'temp-f'
    }
  },

  'metric-to-imperial': {
    // === LENGTH ===
    // Match mm BEFORE m (more specific first)
    'length-mm': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:millimeters?|millimetres?|mm)\b`, 'giu'),
      factor: 1 / 25.4,
      to: 'in'
    },

    'length-cm': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:centimeters?|centimetres?|cm)\b`, 'giu'),
      factor: 1 / 2.54,
      to: 'in'
    },

    'length-m': {
      // Match meters/metres/m - word boundary handles most cases, lookahead avoids m², m³
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:meters?|metres?|m)\b(?![²³/])`, 'giu'),
      factor: 1 / 0.3048,
      to: 'ft'
    },

    'length-km': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:kilometers?|kilometres?|km)\b(?![a-zA-Z/])`, 'giu'),
      factor: 1 / 1.60934,
      to: 'mi'
    },

    'length-nmi': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:nautical${WS}miles?|nmi?)\b`, 'giu'),
      factor: 1 / 1.852,
      to: 'mi'
    },

    // === AREA ===
    'area-sqcm': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:square${WS}centimeters?|square${WS}centimetres?|sq\.?${WS}cm\.?|cm²|cm2)\b`,
        'giu'
      ),
      factor: 1 / 6.4516,
      to: 'sq in'
    },

    'area-sqm': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:square${WS}meters?|square${WS}metres?|sq\.?${WS}m\.?|m²|m2)\b`,
        'giu'
      ),
      factor: 1 / 0.092903,
      to: 'sq ft'
    },

    'area-sqkm': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:square${WS}kilometers?|square${WS}kilometres?|sq\.?${WS}km\.?|km²|km2)\b`,
        'giu'
      ),
      factor: 1 / 2.58999,
      to: 'sq mi'
    },

    'area-ha': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:hectares?|ha)\b`, 'giu'),
      factor: 1 / 0.404686,
      to: 'acres'
    },

    // === VOLUME ===
    'volume-cucm': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:cubic${WS}centimeters?|cubic${WS}centimetres?|cu\.?${WS}cm\.?|cm³|cm3|cc)\b`,
        'giu'
      ),
      factor: 1 / 16.3871,
      to: 'cu in'
    },

    'volume-cum': {
      regex: new RegExp(
        String.raw`\b(${NUM})${WS}(?:cubic${WS}meters?|cubic${WS}metres?|cu\.?${WS}m\.?|m³|m3)\b`,
        'giu'
      ),
      factor: 1 / 0.764555,
      to: 'cu yd'
    },

    'volume-ml': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:milliliters?|millilitres?|mL|ml)\b`, 'giu'),
      factor: 1 / 29.5735,
      to: 'fl oz'
    },

    'volume-l': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:liters?|litres?|L)\b(?![a-zA-Z])`, 'giu'),
      factor: 1 / 3.78541,
      to: 'gal'
    },

    // === WEIGHT / MASS ===
    'weight-g': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:grams?|g)\b(?![a-zA-Z])`, 'giu'),
      factor: 1 / 28.3495,
      to: 'oz'
    },

    'weight-kg': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:kilograms?|kg)\b`, 'giu'),
      factor: 1 / 0.453592,
      to: 'lbs'
    },

    'weight-tonnes': {
      regex: new RegExp(
        String.raw`\b(${NUM})[\s-]*(?:tonnes?|metric${WS}tons?)\b`,
        'giu'
      ),
      factor: 1 / 0.907185,
      to: 'tons'
    },

    // === SPEED ===
    'speed-kmh': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:kilometers?${WS}per${WS}hour|kilometres?${WS}per${WS}hour|km\/h|kmh|kph)\b`, 'giu'),
      factor: 1 / 1.60934,
      to: 'mph'
    },

    // === PRESSURE ===
    'pressure-kpa': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:kilopascals?|kPa)\b`, 'giu'),
      factor: 1 / 6.89476,
      to: 'psi'
    },

    'pressure-bar': {
      regex: new RegExp(String.raw`\b(${NUM})${WS}(?:bars?)\b(?![a-zA-Z])`, 'giu'),
      factor: 14.5038,
      to: 'psi'
    },

    // === TEMPERATURE ===
    'temperature': {
      regex: new RegExp(String.raw`(${NUM})${WS}(?:${DEG_C_TOKENS})\b`, 'giu'),
      type: 'temp-c'
    },

    'temperature-k': {
      regex: new RegExp(String.raw`(${NUM})${WS}(?:${DEG_K_TOKENS})\b`, 'giu'),
      type: 'temp-k'
    }
  }
};

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
  if (str == null) return 0;  // Handle undefined/null
  return parseFloat(String(str).replace(/,/g, ''));
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
  // First pass: collect parent elements that might contain split number+unit patterns
  const processedParents = new Set();

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

  // Process text nodes - but also check if we should process parent for linked units
  textNodes.forEach(textNode => {
    const parent = textNode.parentElement;

    // Check if this text node ends with a number (might have unit in sibling)
    const endsWithNumber = /[\d,]+\s*$/.test(textNode.textContent);

    // If number at end, try to find a good container to process
    if (endsWithNumber && parent) {
      // Find a suitable container (paragraph, div, span, td, etc.)
      const container = parent.closest('p, div, td, th, li, span, dd, dt') || parent.parentElement;

      if (container && !processedParents.has(container) && !container.closest('.unit-wrapper')) {
        // Check if the container's full text matches any pattern
        const containerText = container.textContent;
        let hasMatch = false;
        for (const pattern of Object.values(enabledPatterns)) {
          const testRegex = new RegExp(pattern.regex.source, pattern.regex.flags);
          if (testRegex.test(containerText)) {
            hasMatch = true;
            break;
          }
        }

        if (hasMatch) {
          processedParents.add(container);
          processElementWithLinks(container, enabledPatterns);
          return; // Skip individual text node processing
        }
      }
    }

    // Standard text node processing if not handled above
    if (parent && !parent.closest('.unit-wrapper')) {
      processTextNode(textNode, enabledPatterns);
    }
  });
}

// Process an element that may contain linked units (number in text, unit in <a>)
function processElementWithLinks(element, patterns) {
  const text = element.textContent;

  // Check if any pattern matches the full text
  let hasMatch = false;
  for (const pattern of Object.values(patterns)) {
    const testRegex = new RegExp(pattern.regex.source, pattern.regex.flags);
    if (testRegex.test(text)) {
      hasMatch = true;
      break;
    }
  }

  if (!hasMatch) return;

  // Use innerHTML replacement but preserve structure
  let newHTML = element.innerHTML;
  const displayMode = settings.displayMode || 'badge';
  const precision = settings.precision ?? 2;
  const badgeColor = settings.badgeColor || '#4a90d9';
  const showTooltip = settings.showTooltip ?? true;

  // Sort patterns so combined patterns process first
  const sortedPatterns = Object.entries(patterns).sort(([keyA], [keyB]) => {
    if (keyA.includes('feet-inch')) return -1;
    if (keyB.includes('feet-inch')) return 1;
    // Process long tons before short tons
    if (keyA.includes('long-tons')) return -1;
    if (keyB.includes('long-tons')) return 1;
    return 0;
  });

  // Create a text-based version for matching (strip HTML tags)
  const textContent = element.textContent;

  for (const [, pattern] of sortedPatterns) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match;

    // Find matches in text content
    while ((match = regex.exec(textContent)) !== null) {
      const fullMatch = match[0];
      const value = match[1];
      const value2 = match[2];

      let converted;
      let toUnit;

      if (pattern.type === 'feet-inch') {
        const feet = parseNumber(value);
        const inches = value2 ? parseNumber(value2) : 0;
        if (isNaN(feet)) continue;
        const totalMeters = (feet * 0.3048) + (inches * 0.0254);
        converted = formatNumber(totalMeters, precision);
        toUnit = 'm';
      } else {
        const numValue = parseNumber(value);
        if (isNaN(numValue)) continue;

        if (pattern.type === 'temp-f') {
          converted = formatNumber((numValue - 32) * 5 / 9, precision);
          toUnit = '°C';
        } else if (pattern.type === 'temp-c') {
          converted = formatNumber(numValue * 9 / 5 + 32, precision);
          toUnit = '°F';
        } else if (pattern.type === 'temp-k') {
          converted = formatNumber(numValue - 273.15, precision);
          toUnit = '°C';
        } else {
          converted = formatNumber(numValue * pattern.factor, precision);
          toUnit = pattern.to;
        }
      }

      // Create regex to find this match in HTML (accounting for possible tags in between)
      // Escape special regex chars in the match
      const escapedMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Allow HTML tags between parts
      const htmlAwarePattern = escapedMatch.replace(/\s+/g, '(?:\\s|<[^>]*>)*');
      const htmlRegex = new RegExp(htmlAwarePattern, 'gi');

      if (displayMode === 'replace') {
        newHTML = newHTML.replace(htmlRegex,
          `<span class="unit-converted unit-wrapper" title="Original: ${fullMatch}">${converted} ${toUnit}</span>`);
      } else {
        const tooltipAttr = showTooltip ? `title="${converted} ${toUnit}"` : '';
        newHTML = newHTML.replace(htmlRegex, (m) =>
          `<span class="unit-converted unit-wrapper" ${tooltipAttr}>${m} <sup class="unit-badge" style="background:${badgeColor}">(${converted} ${toUnit})</sup></span>`);
      }
    }
  }

  if (newHTML !== element.innerHTML) {
    element.innerHTML = newHTML;
  }
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
        const inches = value2 ? parseNumber(value2) : 0;  // Inches are optional
        if (isNaN(feet)) return match;
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
        } else if (pattern.type === 'temp-k') {
          // Kelvin to Celsius: K - 273.15
          converted = formatNumber(numValue - 273.15, precision);
          toUnit = '°C';
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
