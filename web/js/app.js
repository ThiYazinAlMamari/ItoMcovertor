/**
 * Unit Converter - Application Logic
 * Handles UI interactions, history, theme, settings, toasts, and URL state
 */

(function () {
    'use strict';

    // =========================================================================
    // DOM ELEMENTS
    // =========================================================================

    const elements = {
        categoryTabs: document.getElementById('categoryTabs'),
        fromValue: document.getElementById('fromValue'),
        fromUnit: document.getElementById('fromUnit'),
        toValue: document.getElementById('toValue'),
        toUnit: document.getElementById('toUnit'),
        swapBtn: document.getElementById('swapBtn'),
        copyBtn: document.getElementById('copyBtn'),
        validationMessage: document.getElementById('validationMessage'),
        quickReference: document.getElementById('quickReference'),
        historyList: document.getElementById('historyList'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn'),
        themeToggle: document.getElementById('themeToggle'),
        settingsBtn: document.getElementById('settingsBtn'),
        settingsOverlay: document.getElementById('settingsOverlay'),
        settingsClose: document.getElementById('settingsClose'),
        darkModeToggle: document.getElementById('darkModeToggle'),
        autoSaveToggle: document.getElementById('autoSaveToggle'),
        precisionSelect: document.getElementById('precisionSelect'),
        numberGroupingToggle: document.getElementById('numberGroupingToggle'),
        scientificNotationToggle: document.getElementById('scientificNotationToggle'),
        roundingSelect: document.getElementById('roundingSelect'),
        toastContainer: document.getElementById('toastContainer')
    };

    // =========================================================================
    // STATE
    // =========================================================================

    let state = {
        currentCategory: 'length',
        history: [],
        settings: {
            darkMode: false,
            autoSave: true,
            precision: 4,
            numberGrouping: true,
            scientificNotation: true,
            rounding: 'round'
        }
    };

    const STORAGE_KEYS = {
        history: 'unitConverter_history',
        settings: 'unitConverter_settings',
        cookieConsent: 'unitConverter_cookieConsent'
    };
    const MAX_HISTORY = 10;

    // =========================================================================
    // COOKIE UTILITIES
    // =========================================================================

    const CookieManager = {
        // Set a cookie with expiration in days
        set(name, value, days = 365) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        },

        // Get a cookie value by name
        get(name) {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [cookieName, cookieValue] = cookie.trim().split('=');
                if (cookieName === name) {
                    return decodeURIComponent(cookieValue);
                }
            }
            return null;
        },

        // Delete a cookie
        delete(name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        },

        // Check if user has given consent
        hasConsent() {
            return this.get(STORAGE_KEYS.cookieConsent) === 'accepted';
        },

        // Check if user has explicitly declined
        hasDeclined() {
            return this.get(STORAGE_KEYS.cookieConsent) === 'declined';
        },

        // Check if user needs to make a choice
        needsConsent() {
            return this.get(STORAGE_KEYS.cookieConsent) === null;
        },

        // Accept cookies
        accept() {
            this.set(STORAGE_KEYS.cookieConsent, 'accepted', 365);
        },

        // Decline cookies
        decline() {
            this.set(STORAGE_KEYS.cookieConsent, 'declined', 365);
            // Clear any existing stored data
            try {
                localStorage.removeItem(STORAGE_KEYS.history);
                localStorage.removeItem(STORAGE_KEYS.settings);
            } catch (e) {
                // Storage might be disabled
            }
        }
    };

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    function init() {
        initCookieBanner();
        loadSettings();
        loadHistory();
        applyTheme();
        setupEventListeners();
        loadFromURL();
        renderHistory();
        initFAQ();
    }

    // =========================================================================
    // COOKIE CONSENT BANNER
    // =========================================================================

    function initCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        const acceptBtn = document.getElementById('cookieAccept');
        const declineBtn = document.getElementById('cookieDecline');

        if (!banner) return;

        // Show banner if user hasn't made a choice
        if (CookieManager.needsConsent()) {
            setTimeout(() => {
                banner.classList.add('show');
            }, 1000); // Delay for better UX
        }

        // Accept button handler
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                CookieManager.accept();
                hideCookieBanner();
                showToast('Preferences saved!', 'success');
                // Save current settings now that consent is given
                saveSettings();
                saveHistory();
            });
        }

        // Decline button handler
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                CookieManager.decline();
                hideCookieBanner();
                showToast('Cookies declined. Settings won\'t be saved.', 'info');
            });
        }
    }

    function hideCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
            banner.classList.add('hide');
        }
    }

    // =========================================================================
    // THEME MANAGEMENT
    // =========================================================================

    function applyTheme() {
        const isDark = state.settings.darkMode;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

        // Update theme toggle icons
        const sunIcon = elements.themeToggle.querySelector('.sun-icon');
        const moonIcon = elements.themeToggle.querySelector('.moon-icon');

        if (sunIcon && moonIcon) {
            sunIcon.style.display = isDark ? 'none' : 'block';
            moonIcon.style.display = isDark ? 'block' : 'none';
        }

        // Update dark mode toggle in settings
        if (elements.darkModeToggle) {
            elements.darkModeToggle.classList.toggle('active', isDark);
            elements.darkModeToggle.setAttribute('aria-checked', isDark);
        }
    }

    function toggleTheme() {
        state.settings.darkMode = !state.settings.darkMode;
        applyTheme();
        saveSettings();
    }

    // =========================================================================
    // SETTINGS MANAGEMENT
    // =========================================================================

    function loadSettings() {
        // Always load darkMode regardless of consent - it's a basic UX preference
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.settings);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Always apply darkMode if explicitly set
                if (typeof parsed.darkMode === 'boolean') {
                    state.settings.darkMode = parsed.darkMode;
                } else {
                    // Check system preference as default
                    state.settings.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                }
                // Only load other settings if user has consented
                if (CookieManager.hasConsent()) {
                    state.settings = { ...state.settings, ...parsed };
                }
            } else {
                // No saved settings - check system preference
                state.settings.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
        } catch (e) {
            // Check system preference as fallback
            state.settings.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        // Apply precision setting
        if (elements.precisionSelect) {
            elements.precisionSelect.value = state.settings.precision;
        }

        // Apply auto-save setting
        if (elements.autoSaveToggle) {
            elements.autoSaveToggle.classList.toggle('active', state.settings.autoSave);
            elements.autoSaveToggle.setAttribute('aria-checked', state.settings.autoSave);
        }

        // Apply number grouping setting
        if (elements.numberGroupingToggle) {
            elements.numberGroupingToggle.classList.toggle('active', state.settings.numberGrouping);
            elements.numberGroupingToggle.setAttribute('aria-checked', state.settings.numberGrouping);
        }

        // Apply scientific notation setting
        if (elements.scientificNotationToggle) {
            elements.scientificNotationToggle.classList.toggle('active', state.settings.scientificNotation);
            elements.scientificNotationToggle.setAttribute('aria-checked', state.settings.scientificNotation);
        }

        // Apply rounding setting
        if (elements.roundingSelect) {
            elements.roundingSelect.value = state.settings.rounding;
        }
    }

    function saveSettings() {
        try {
            // Always save darkMode - it's a basic UX preference
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}');
            existing.darkMode = state.settings.darkMode;

            // Only save other settings if user has consented
            if (CookieManager.hasConsent()) {
                localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
            } else {
                // Just save darkMode
                localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(existing));
            }
        } catch (e) {
            // Storage might be full or disabled
        }
    }

    function openSettings() {
        elements.settingsOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeSettings() {
        elements.settingsOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // =========================================================================
    // EVENT LISTENERS
    // =========================================================================

    function setupEventListeners() {
        // Category tabs
        elements.categoryTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const category = e.target.dataset.category;
                setActiveTab(e.target);
                loadCategory(category);
                updateURL();
            }
        });

        // Real-time conversion on input
        elements.fromValue.addEventListener('input', () => {
            performConversion();
            updateURL();
        });
        elements.fromUnit.addEventListener('change', () => {
            performConversion();
            updateURL();
        });
        elements.toUnit.addEventListener('change', () => {
            performConversion();
            updateURL();
        });

        // Swap button
        elements.swapBtn.addEventListener('click', () => {
            swapUnits();
            updateURL();
        });

        // Copy button
        if (elements.copyBtn) {
            elements.copyBtn.addEventListener('click', copyResult);
        }

        // Clear history
        elements.clearHistoryBtn.addEventListener('click', clearHistory);

        // Enter key to add to history
        elements.fromValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && elements.toValue.value) {
                addToHistory();
            }
        });

        // Theme toggle
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }

        // Settings
        if (elements.settingsBtn) {
            elements.settingsBtn.addEventListener('click', openSettings);
        }
        if (elements.settingsClose) {
            elements.settingsClose.addEventListener('click', closeSettings);
        }
        if (elements.settingsOverlay) {
            elements.settingsOverlay.addEventListener('click', (e) => {
                if (e.target === elements.settingsOverlay) {
                    closeSettings();
                }
            });
        }

        // Dark mode toggle in settings
        if (elements.darkModeToggle) {
            elements.darkModeToggle.addEventListener('click', toggleTheme);
            elements.darkModeToggle.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }

        // Auto-save toggle
        if (elements.autoSaveToggle) {
            elements.autoSaveToggle.addEventListener('click', () => {
                state.settings.autoSave = !state.settings.autoSave;
                elements.autoSaveToggle.classList.toggle('active', state.settings.autoSave);
                elements.autoSaveToggle.setAttribute('aria-checked', state.settings.autoSave);
                saveSettings();
            });
        }

        // Precision select
        if (elements.precisionSelect) {
            elements.precisionSelect.addEventListener('change', (e) => {
                state.settings.precision = parseInt(e.target.value, 10);
                saveSettings();
                performConversion();
            });
        }

        // Number grouping toggle
        if (elements.numberGroupingToggle) {
            elements.numberGroupingToggle.addEventListener('click', () => {
                state.settings.numberGrouping = !state.settings.numberGrouping;
                elements.numberGroupingToggle.classList.toggle('active', state.settings.numberGrouping);
                elements.numberGroupingToggle.setAttribute('aria-checked', state.settings.numberGrouping);
                saveSettings();
                performConversion();
            });
        }

        // Scientific notation toggle
        if (elements.scientificNotationToggle) {
            elements.scientificNotationToggle.addEventListener('click', () => {
                state.settings.scientificNotation = !state.settings.scientificNotation;
                elements.scientificNotationToggle.classList.toggle('active', state.settings.scientificNotation);
                elements.scientificNotationToggle.setAttribute('aria-checked', state.settings.scientificNotation);
                saveSettings();
                performConversion();
            });
        }

        // Rounding select
        if (elements.roundingSelect) {
            elements.roundingSelect.addEventListener('change', (e) => {
                state.settings.rounding = e.target.value;
                saveSettings();
                performConversion();
            });
        }

        // Escape key to close settings
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.settingsOverlay.classList.contains('open')) {
                closeSettings();
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', loadFromURL);
    }

    // =========================================================================
    // CATEGORY MANAGEMENT
    // =========================================================================

    function setActiveTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        tab.classList.add('active');
    }

    function loadCategory(category) {
        state.currentCategory = category;
        const units = UnitConverter.units[category];

        if (!units) return;

        // Populate dropdowns
        populateSelect(elements.fromUnit, units);
        populateSelect(elements.toUnit, units);

        // Set default selections (first imperial to first metric)
        const imperialUnits = units.filter(u => u.system === 'imperial');
        const metricUnits = units.filter(u => u.system === 'metric');

        if (imperialUnits.length && metricUnits.length) {
            elements.fromUnit.value = imperialUnits[0].id;
            elements.toUnit.value = metricUnits[0].id;
        } else if (units.length >= 2) {
            elements.fromUnit.value = units[0].id;
            elements.toUnit.value = units[1].id;
        }

        // Clear values and perform conversion if there's a value
        clearValidation();
        if (elements.fromValue.value) {
            performConversion();
        } else {
            elements.toValue.value = '';
            updateQuickReference();
        }
    }

    function populateSelect(select, units) {
        select.innerHTML = '';

        // Group by system
        const imperial = units.filter(u => u.system === 'imperial');
        const metric = units.filter(u => u.system === 'metric');

        if (imperial.length) {
            const group = document.createElement('optgroup');
            group.label = 'Imperial';
            imperial.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit.id;
                option.textContent = unit.name;
                group.appendChild(option);
            });
            select.appendChild(group);
        }

        if (metric.length) {
            const group = document.createElement('optgroup');
            group.label = 'Metric';
            metric.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit.id;
                option.textContent = unit.name;
                group.appendChild(option);
            });
            select.appendChild(group);
        }
    }

    // =========================================================================
    // CONVERSION
    // =========================================================================

    function performConversion() {
        const value = parseFloat(elements.fromValue.value);
        const fromUnit = elements.fromUnit.value;
        const toUnit = elements.toUnit.value;

        clearValidation();

        if (elements.fromValue.value === '' || isNaN(value)) {
            elements.toValue.value = '';
            updateQuickReference();
            return;
        }

        const result = UnitConverter.convert(value, fromUnit, toUnit, state.currentCategory);

        if (result.error) {
            showValidation(result.error, 'error');
            elements.toValue.value = '';
        } else {
            elements.toValue.value = UnitConverter.formatResult(result.value, state.settings);
            updateQuickReference();
        }
    }

    function swapUnits() {
        const tempUnit = elements.fromUnit.value;
        const tempValue = elements.toValue.value;

        elements.fromUnit.value = elements.toUnit.value;
        elements.toUnit.value = tempUnit;

        if (tempValue) {
            // Parse the formatted number back
            elements.fromValue.value = tempValue.replace(/,/g, '');
        }

        performConversion();

        // Add swap animation
        elements.swapBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            elements.swapBtn.style.transform = '';
        }, 300);
    }

    // =========================================================================
    // COPY FUNCTIONALITY
    // =========================================================================

    function copyResult() {
        const result = elements.toValue.value;
        if (!result) {
            showToast('No result to copy', 'error');
            return;
        }

        const fromSymbol = UnitConverter.getUnitSymbol(elements.fromUnit.value);
        const toSymbol = UnitConverter.getUnitSymbol(elements.toUnit.value);
        const fromValue = elements.fromValue.value;

        const textToCopy = `${fromValue} ${fromSymbol} = ${result} ${toSymbol}`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Copied to clipboard!', 'success');

            // Visual feedback on button
            elements.copyBtn.classList.add('copied');
            setTimeout(() => {
                elements.copyBtn.classList.remove('copied');
            }, 1500);
        }).catch(() => {
            showToast('Failed to copy', 'error');
        });
    }

    // =========================================================================
    // TOAST NOTIFICATIONS
    // =========================================================================

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>',
            error: '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6"/><path d="M15 9l-6 6"/></svg>',
            info: '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><path d="M12 16h.01"/></svg>'
        };

        toast.innerHTML = `
            ${icons[type] || icons.info}
            <span class="toast-message">${message}</span>
        `;

        elements.toastContainer.appendChild(toast);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // =========================================================================
    // URL STATE MANAGEMENT (Shareable Links)
    // =========================================================================

    function updateURL() {
        const params = new URLSearchParams();

        if (state.currentCategory !== 'length') {
            params.set('cat', state.currentCategory);
        }
        if (elements.fromValue.value) {
            params.set('v', elements.fromValue.value);
        }
        if (elements.fromUnit.value) {
            params.set('from', elements.fromUnit.value);
        }
        if (elements.toUnit.value) {
            params.set('to', elements.toUnit.value);
        }

        const queryString = params.toString();
        const newURL = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

        window.history.replaceState({}, '', newURL);
    }

    function loadFromURL() {
        const params = new URLSearchParams(window.location.search);

        const category = params.get('cat') || 'length';
        const value = params.get('v') || '';
        const fromUnit = params.get('from');
        const toUnit = params.get('to');

        // Set category
        state.currentCategory = category;
        const tabBtn = document.querySelector(`[data-category="${category}"]`);
        if (tabBtn) {
            setActiveTab(tabBtn);
        }

        // Load category units
        const units = UnitConverter.units[category];
        if (units) {
            populateSelect(elements.fromUnit, units);
            populateSelect(elements.toUnit, units);
        }

        // Set units if provided
        if (fromUnit && elements.fromUnit.querySelector(`option[value="${fromUnit}"]`)) {
            elements.fromUnit.value = fromUnit;
        }
        if (toUnit && elements.toUnit.querySelector(`option[value="${toUnit}"]`)) {
            elements.toUnit.value = toUnit;
        }

        // Set value and convert
        elements.fromValue.value = value;
        if (value) {
            performConversion();
        } else {
            updateQuickReference();
        }
    }

    // =========================================================================
    // VALIDATION & UI FEEDBACK
    // =========================================================================

    function showValidation(message, type) {
        elements.validationMessage.textContent = message;
        elements.validationMessage.className = `validation-message ${type}`;
    }

    function clearValidation() {
        elements.validationMessage.textContent = '';
        elements.validationMessage.className = 'validation-message';
    }

    function updateQuickReference() {
        const fromUnit = elements.fromUnit.value;
        const toUnit = elements.toUnit.value;

        if (!fromUnit || !toUnit || fromUnit === toUnit) {
            elements.quickReference.textContent = '';
            return;
        }

        // Show reference conversion for 1 unit
        const result = UnitConverter.convert(1, fromUnit, toUnit, state.currentCategory);
        if (result.error) return;

        const fromSymbol = UnitConverter.getUnitSymbol(fromUnit);
        const toSymbol = UnitConverter.getUnitSymbol(toUnit);

        elements.quickReference.textContent =
            `1 ${fromSymbol} = ${UnitConverter.formatResult(result.value, state.settings)} ${toSymbol}`;
    }

    // =========================================================================
    // HISTORY MANAGEMENT
    // =========================================================================

    function addToHistory() {
        if (!state.settings.autoSave) return;

        const fromValue = elements.fromValue.value;
        const toValue = elements.toValue.value;
        const fromSymbol = UnitConverter.getUnitSymbol(elements.fromUnit.value);
        const toSymbol = UnitConverter.getUnitSymbol(elements.toUnit.value);

        if (!fromValue || !toValue) return;

        const entry = `${fromValue} ${fromSymbol} = ${toValue} ${toSymbol}`;

        // Avoid duplicates
        if (state.history[0] === entry) return;

        state.history.unshift(entry);
        if (state.history.length > MAX_HISTORY) {
            state.history.pop();
        }

        saveHistory();
        renderHistory();
    }

    function renderHistory() {
        if (state.history.length === 0) {
            elements.historyList.innerHTML = '<li class="history-empty">No conversions yet</li>';
            return;
        }

        elements.historyList.innerHTML = state.history
            .map(entry => `<li>${entry}</li>`)
            .join('');
    }

    function clearHistory() {
        state.history = [];
        saveHistory();
        renderHistory();
        showToast('History cleared', 'info');
    }

    function saveHistory() {
        // Only save if user has consented to cookies
        if (!CookieManager.hasConsent()) return;

        try {
            localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
        } catch (e) {
            // localStorage might be disabled
        }
    }

    function loadHistory() {
        // Only load if user has consented to cookies
        if (!CookieManager.hasConsent()) {
            state.history = [];
            return;
        }

        try {
            const saved = localStorage.getItem(STORAGE_KEYS.history);
            if (saved) {
                state.history = JSON.parse(saved);
            }
        } catch (e) {
            state.history = [];
        }
    }

    // =========================================================================
    // FAQ ACCORDION
    // =========================================================================

    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    // Close other items
                    faqItems.forEach(other => {
                        if (other !== item) {
                            other.classList.remove('open');
                        }
                    });
                    // Toggle current item
                    item.classList.toggle('open');
                });
            }
        });
    }

    // =========================================================================
    // AUTO-SAVE TO HISTORY ON VALID CONVERSION
    // =========================================================================

    // Debounce to auto-add to history after user stops typing
    let historyTimeout;
    elements.fromValue.addEventListener('input', () => {
        clearTimeout(historyTimeout);
        historyTimeout = setTimeout(() => {
            if (elements.toValue.value && !elements.validationMessage.classList.contains('error')) {
                addToHistory();
            }
        }, 1500);
    });

    // =========================================================================
    // START
    // =========================================================================

    document.addEventListener('DOMContentLoaded', init);

})();
