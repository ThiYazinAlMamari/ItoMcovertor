/**
 * ItoMcovertor Extension - Background Service Worker
 * Handles extension lifecycle, icon updates, and context menus
 * Compatible with Chrome, Edge, and Firefox (Manifest V3)
 */

// Cross-browser compatibility: Firefox uses 'browser', Chrome uses 'chrome'
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Default settings
const DEFAULT_SETTINGS = {
  autoConvert: false,
  direction: 'metric-to-imperial',
  selectedUnit: 'small-distance',
  // Conversion settings
  precision: 4,
  numberGrouping: true,
  scientificNotation: true,
  rounding: 'round',
  // Site rules
  siteRuleMode: 'all',
  siteRules: '',
  // Display
  badgeStyle: 'badge',
  showTooltip: true,
  showSelectionPopup: true,
  // Advanced
  scanMode: 'full',
  maxConversions: 100,
  // Privacy
  syncEnabled: true
};

// Context menu IDs
const MENU_CONVERT_METRIC = 'convert-to-metric';
const MENU_CONVERT_IMPERIAL = 'convert-to-imperial';

// Initialize on install
browserAPI.runtime.onInstalled.addListener(() => {
  // Set default settings
  browserAPI.storage.sync.get(Object.keys(DEFAULT_SETTINGS)).then((result) => {
    const settings = { ...DEFAULT_SETTINGS, ...result };
    browserAPI.storage.sync.set(settings);
    updateBadge(settings.autoConvert);
  }).catch(() => {
    // Fallback for callback-based API (older Chrome)
    browserAPI.storage.sync.set(DEFAULT_SETTINGS);
    updateBadge(DEFAULT_SETTINGS.autoConvert);
  });

  // Create context menus
  createContextMenus();
});

// Create right-click context menus
function createContextMenus() {
  // Remove existing menus first
  browserAPI.contextMenus.removeAll(() => {
    // Parent menu
    browserAPI.contextMenus.create({
      id: 'itomcovertor-parent',
      title: 'ItoMcovertor',
      contexts: ['selection']
    });

    // Convert to Metric
    browserAPI.contextMenus.create({
      id: MENU_CONVERT_METRIC,
      parentId: 'itomcovertor-parent',
      title: 'Convert to Metric',
      contexts: ['selection']
    });

    // Convert to Imperial
    browserAPI.contextMenus.create({
      id: MENU_CONVERT_IMPERIAL,
      parentId: 'itomcovertor-parent',
      title: 'Convert to Imperial',
      contexts: ['selection']
    });
  });
}

// Handle context menu clicks
browserAPI.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;

  const selectedText = info.selectionText;
  if (!selectedText) return;

  let direction;
  if (info.menuItemId === MENU_CONVERT_METRIC) {
    direction = 'imperial-to-metric';
  } else if (info.menuItemId === MENU_CONVERT_IMPERIAL) {
    direction = 'metric-to-imperial';
  } else {
    return;
  }

  // Send to content script
  browserAPI.tabs.sendMessage(tab.id, {
    type: 'CONVERT_SELECTION',
    text: selectedText,
    direction: direction
  }).catch(() => {
    // Ignore errors on restricted pages
  });
});

// Listen for storage changes to update badge
browserAPI.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.autoConvert) {
    updateBadge(changes.autoConvert.newValue);
  }
});

// Update extension badge and icon based on auto-convert state
function updateBadge(isEnabled) {
  if (isEnabled) {
    // Active state: colored icons
    browserAPI.action.setIcon({
      path: {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      }
    });
    browserAPI.action.setBadgeText({ text: '' });
    browserAPI.action.setTitle({ title: 'ItoMcovertor - Auto-Convert ON' });
  } else {
    // Inactive state: grayscale icons
    browserAPI.action.setIcon({
      path: {
        "16": "icons/icon16_inactive.png",
        "48": "icons/icon48_inactive.png",
        "128": "icons/icon128_inactive.png"
      }
    });
    browserAPI.action.setBadgeText({ text: '' });
    browserAPI.action.setTitle({ title: 'ItoMcovertor - Click to convert units' });
  }
}

// Handle messages from content scripts
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    browserAPI.storage.sync.get(['autoConvert', 'direction']).then((result) => {
      sendResponse(result);
    }).catch(() => {
      sendResponse({});
    });
    return true; // Keep channel open for async response
  }
});
