// ItoMcovertor Extension - Options Page Script
// Compatible with Chrome, Edge, and Firefox (Manifest V3)

// Cross-browser compatibility: Firefox uses 'browser', Chrome uses 'chrome'
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const elements = {
    // General
    autoConvertToggle: document.getElementById('autoConvertToggle'),
    directionSelect: document.getElementById('directionSelect'),
    precisionSelect: document.getElementById('precisionSelect'),
    // Site Rules
    siteRuleModeSelect: document.getElementById('siteRuleModeSelect'),
    siteRulesTextarea: document.getElementById('siteRulesTextarea'),
    siteRulesContainer: document.getElementById('siteRulesContainer'),
    // Display
    badgeStyleSelect: document.getElementById('badgeStyleSelect'),
    showTooltipToggle: document.getElementById('showTooltipToggle'),
    selectionPopupToggle: document.getElementById('selectionPopupToggle'),
    numberGroupingToggle: document.getElementById('numberGroupingToggle'),
    // Advanced
    scanModeSelect: document.getElementById('scanModeSelect'),
    maxConversionsInput: document.getElementById('maxConversionsInput'),
    scientificNotationToggle: document.getElementById('scientificNotationToggle'),
    roundingSelect: document.getElementById('roundingSelect'),
    // Privacy
    syncEnabledToggle: document.getElementById('syncEnabledToggle'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    // UI
    statusMessage: document.getElementById('statusMessage'),
    navLinks: document.querySelectorAll('.nav-link')
  };

  // Default settings
  const DEFAULT_SETTINGS = {
    autoConvert: false,
    direction: 'metric-to-imperial',
    precision: 4,
    siteRuleMode: 'all',
    siteRules: '',
    badgeStyle: 'badge',
    showTooltip: true,
    showSelectionPopup: true,
    numberGrouping: true,
    scanMode: 'full',
    maxConversions: 100,
    scientificNotation: true,
    rounding: 'round',
    syncEnabled: true
  };

  // Load saved settings
  browserAPI.storage.sync.get(DEFAULT_SETTINGS).then((settings) => {
    // General
    elements.autoConvertToggle.checked = settings.autoConvert;
    elements.directionSelect.value = settings.direction;
    elements.precisionSelect.value = settings.precision;
    // Site Rules
    elements.siteRuleModeSelect.value = settings.siteRuleMode;
    elements.siteRulesTextarea.value = settings.siteRules;
    updateSiteRulesVisibility(settings.siteRuleMode);
    // Display
    elements.badgeStyleSelect.value = settings.badgeStyle;
    elements.showTooltipToggle.checked = settings.showTooltip;
    elements.selectionPopupToggle.checked = settings.showSelectionPopup;
    elements.numberGroupingToggle.checked = settings.numberGrouping;
    // Advanced
    elements.scanModeSelect.value = settings.scanMode;
    elements.maxConversionsInput.value = settings.maxConversions;
    elements.scientificNotationToggle.checked = settings.scientificNotation;
    elements.roundingSelect.value = settings.rounding;
    // Privacy
    elements.syncEnabledToggle.checked = settings.syncEnabled;
  }).catch(() => {
    // Fallback for callback-based API
  });

  // === General Section ===
  elements.autoConvertToggle.addEventListener('change', () => {
    saveSetting('autoConvert', elements.autoConvertToggle.checked);
  });

  elements.directionSelect.addEventListener('change', () => {
    saveSetting('direction', elements.directionSelect.value);
  });

  elements.precisionSelect.addEventListener('change', () => {
    saveSetting('precision', parseInt(elements.precisionSelect.value));
  });

  // === Site Rules Section ===
  elements.siteRuleModeSelect.addEventListener('change', () => {
    const mode = elements.siteRuleModeSelect.value;
    saveSetting('siteRuleMode', mode);
    updateSiteRulesVisibility(mode);
  });

  elements.siteRulesTextarea.addEventListener('change', () => {
    saveSetting('siteRules', elements.siteRulesTextarea.value.trim());
  });

  function updateSiteRulesVisibility(mode) {
    elements.siteRulesContainer.style.display = mode === 'all' ? 'none' : 'flex';
  }

  // === Display Section ===
  elements.badgeStyleSelect.addEventListener('change', () => {
    saveSetting('badgeStyle', elements.badgeStyleSelect.value);
  });

  elements.showTooltipToggle.addEventListener('change', () => {
    saveSetting('showTooltip', elements.showTooltipToggle.checked);
  });

  elements.selectionPopupToggle.addEventListener('change', () => {
    saveSetting('showSelectionPopup', elements.selectionPopupToggle.checked);
  });

  elements.numberGroupingToggle.addEventListener('change', () => {
    saveSetting('numberGrouping', elements.numberGroupingToggle.checked);
  });

  // === Advanced Section ===
  elements.scanModeSelect.addEventListener('change', () => {
    saveSetting('scanMode', elements.scanModeSelect.value);
  });

  elements.maxConversionsInput.addEventListener('change', () => {
    let value = parseInt(elements.maxConversionsInput.value);
    // Clamp to valid range
    value = Math.max(10, Math.min(1000, value || 100));
    elements.maxConversionsInput.value = value;
    saveSetting('maxConversions', value);
  });

  elements.scientificNotationToggle.addEventListener('change', () => {
    saveSetting('scientificNotation', elements.scientificNotationToggle.checked);
  });

  elements.roundingSelect.addEventListener('change', () => {
    saveSetting('rounding', elements.roundingSelect.value);
  });

  // === Privacy Section ===
  elements.syncEnabledToggle.addEventListener('change', () => {
    const syncEnabled = elements.syncEnabledToggle.checked;
    saveSetting('syncEnabled', syncEnabled);

    if (!syncEnabled) {
      // Migrate settings to local storage
      browserAPI.storage.sync.get(null).then((settings) => {
        browserAPI.storage.local.set(settings).then(() => {
          showStatus('Settings moved to local storage');
        });
      });
    } else {
      // Migrate settings to sync storage
      browserAPI.storage.local.get(null).then((settings) => {
        browserAPI.storage.sync.set(settings).then(() => {
          showStatus('Settings synced to account');
        });
      });
    }
  });

  elements.clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data? This will reset all settings to defaults.')) {
      browserAPI.storage.sync.clear().then(() => {
        browserAPI.storage.local.clear().then(() => {
          // Restore defaults
          browserAPI.storage.sync.set(DEFAULT_SETTINGS).then(() => {
            // Reload page to reflect defaults
            showStatus('All data cleared');
            setTimeout(() => location.reload(), 1000);
          });
        });
      });
    }
  });

  // === Navigation ===
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Update active state
      elements.navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Highlight current section on scroll
  const sections = document.querySelectorAll('.options-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        elements.navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => observer.observe(section));

  // === Utility Functions ===
  function saveSetting(key, value) {
    browserAPI.storage.sync.set({ [key]: value }).then(() => {
      showStatus('Setting saved');
    }).catch(() => {
      showStatus('Setting saved');
    });
  }

  function showStatus(message) {
    elements.statusMessage.textContent = message;
    elements.statusMessage.classList.add('visible');

    setTimeout(() => {
      elements.statusMessage.classList.remove('visible');
    }, 2000);
  }
});
