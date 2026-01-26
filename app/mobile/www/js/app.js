/**
 * ItoMcovertor Mobile App - Application Logic
 */

(function () {
    'use strict';

    // =========================================================================
    // DOM ELEMENTS
    // =========================================================================

    const elements = {
        categorySelect: document.getElementById('categorySelect'),
        fromValue: document.getElementById('fromValue'),
        fromUnit: document.getElementById('fromUnit'),
        toValue: document.getElementById('toValue'),
        toUnit: document.getElementById('toUnit'),
        swapBtn: document.getElementById('swapBtn'),
        copyBtn: document.getElementById('copyBtn'),
        themeToggle: document.getElementById('themeToggle'),
        historyList: document.getElementById('historyList'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn'),
        quickReference: document.getElementById('quickReference'),
        toastContainer: document.getElementById('toastContainer')
    };

    // =========================================================================
    // STATE
    // =========================================================================

    let state = {
        currentCategory: 'length',
        history: [],
        settings: {
            darkMode: null,
            precision: 4,
            autoSave: true,
            numberGrouping: true,
            scientificNotation: true,
            rounding: 'round'
        }
    };
    const MAX_HISTORY = 20;
    const STORAGE_KEY = 'itom_mobile_settings';
    const HISTORY_KEY = 'itom_mobile_history';

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    function init() {
        loadSettings();
        loadHistory();
        applyTheme();
        setupEventListeners();
        loadCategory(state.currentCategory);

        // Focus input after a short delay (better for mobile)
        setTimeout(() => elements.fromValue.focus(), 300);
    }

    // =========================================================================
    // THEME MANAGEMENT
    // =========================================================================

    function applyTheme() {
        const isDark = state.settings.darkMode === true ||
            (state.settings.darkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateStatusBar('dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            updateStatusBar('light');
        }
    }

    function toggleTheme() {
        state.settings.darkMode = !document.documentElement.hasAttribute('data-theme');
        applyTheme();
        saveSettings();
        triggerHaptic();
    }

    async function updateStatusBar(style) {
        // Capacitor StatusBar plugin
        if (window.Capacitor && window.Capacitor.Plugins.StatusBar) {
            try {
                const { StatusBar } = window.Capacitor.Plugins;
                if (style === 'dark') {
                    await StatusBar.setStyle({ style: 'DARK' });
                    await StatusBar.setBackgroundColor({ color: '#0f172a' });
                } else {
                    await StatusBar.setStyle({ style: 'LIGHT' });
                    await StatusBar.setBackgroundColor({ color: '#0891b2' });
                }
            } catch (e) {
                // StatusBar not available
            }
        }
    }

    async function triggerHaptic() {
        // Capacitor Haptics plugin
        if (window.Capacitor && window.Capacitor.Plugins.Haptics) {
            try {
                const { Haptics } = window.Capacitor.Plugins;
                await Haptics.impact({ style: 'LIGHT' });
            } catch (e) {
                // Haptics not available
            }
        }
    }

    // =========================================================================
    // SETTINGS MANAGEMENT
    // =========================================================================

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                state.settings = { ...state.settings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }

    function loadHistory() {
        try {
            const saved = localStorage.getItem(HISTORY_KEY);
            if (saved) {
                state.history = JSON.parse(saved);
                renderHistory();
            }
        } catch (e) {
            console.error('Error loading history:', e);
        }
    }

    function saveHistory() {
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
        } catch (e) {
            console.error('Error saving history:', e);
        }
    }

    // =========================================================================
    // EVENT LISTENERS
    // =========================================================================

    function setupEventListeners() {
        // Category dropdown
        elements.categorySelect.addEventListener('change', (e) => {
            loadCategory(e.target.value);
            triggerHaptic();
        });

        // Input handling
        elements.fromValue.addEventListener('input', performConversion);
        elements.fromUnit.addEventListener('change', performConversion);
        elements.toUnit.addEventListener('change', performConversion);

        // Swap button
        elements.swapBtn.addEventListener('click', () => {
            swapUnits();
            triggerHaptic();
        });

        // Copy button
        elements.copyBtn.addEventListener('click', () => {
            copyResult();
            triggerHaptic();
        });

        // Theme toggle
        elements.themeToggle.addEventListener('click', toggleTheme);

        // Clear history
        elements.clearHistoryBtn.addEventListener('click', () => {
            clearHistory();
            triggerHaptic();
        });

        // Handle keyboard dismiss on mobile
        elements.fromValue.addEventListener('blur', () => {
            window.scrollTo(0, 0);
        });
    }

    // =========================================================================
    // CATEGORY MANAGEMENT
    // =========================================================================

    function loadCategory(category) {
        state.currentCategory = category;
        elements.categorySelect.value = category;

        const units = UnitConverter.units[category];
        if (!units) return;

        populateSelect(elements.fromUnit, units);
        populateSelect(elements.toUnit, units);

        // Set default selections (imperial -> metric)
        const imperialUnit = units.find(u => u.system === 'imperial');
        const metricUnit = units.find(u => u.system === 'metric');

        if (imperialUnit) elements.fromUnit.value = imperialUnit.id;
        if (metricUnit) elements.toUnit.value = metricUnit.id;

        // Clear and convert
        elements.fromValue.value = '';
        elements.toValue.value = '';
        updateQuickReference();
    }

    function populateSelect(select, units) {
        select.innerHTML = '';

        // Group by system
        const imperial = units.filter(u => u.system === 'imperial');
        const metric = units.filter(u => u.system === 'metric');

        if (imperial.length > 0) {
            const group = document.createElement('optgroup');
            group.label = 'Imperial';
            imperial.forEach(unit => {
                const opt = document.createElement('option');
                opt.value = unit.id;
                opt.textContent = unit.name;
                group.appendChild(opt);
            });
            select.appendChild(group);
        }

        if (metric.length > 0) {
            const group = document.createElement('optgroup');
            group.label = 'Metric';
            metric.forEach(unit => {
                const opt = document.createElement('option');
                opt.value = unit.id;
                opt.textContent = unit.name;
                group.appendChild(opt);
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

        if (isNaN(value) || !fromUnit || !toUnit) {
            elements.toValue.value = '';
            return;
        }

        const result = UnitConverter.convert(value, fromUnit, toUnit, state.currentCategory);

        if (result.error) {
            elements.toValue.value = '';
            showToast(result.error, 'error');
        } else {
            const formatted = UnitConverter.formatResult(result.value, state.settings);
            elements.toValue.value = formatted;

            // Add to history if auto-save enabled
            if (state.settings.autoSave && value !== 0) {
                addToHistory(value, fromUnit, toUnit, formatted);
            }
        }

        updateQuickReference();
    }

    function swapUnits() {
        const tempUnit = elements.fromUnit.value;
        elements.fromUnit.value = elements.toUnit.value;
        elements.toUnit.value = tempUnit;

        // Swap values too
        const tempValue = elements.fromValue.value;
        elements.fromValue.value = elements.toValue.value.replace(/,/g, '');
        elements.toValue.value = tempValue;

        performConversion();
    }

    // =========================================================================
    // COPY FUNCTIONALITY
    // =========================================================================

    function copyResult() {
        const result = elements.toValue.value;
        if (!result) return;

        navigator.clipboard.writeText(result).then(() => {
            showToast('Copied', 'success');
        }).catch(() => {
            // Fallback for older devices
            const textarea = document.createElement('textarea');
            textarea.value = result;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showToast('Copied', 'success');
            } catch (e) {
                showToast('Failed to copy', 'error');
            }
            document.body.removeChild(textarea);
        });
    }

    // =========================================================================
    // HISTORY MANAGEMENT
    // =========================================================================

    function addToHistory(value, fromUnit, toUnit, result) {
        const entry = {
            value,
            fromUnit: UnitConverter.getUnitSymbol(fromUnit),
            toUnit: UnitConverter.getUnitSymbol(toUnit),
            result,
            category: state.currentCategory,
            timestamp: Date.now()
        };

        // Avoid duplicate entries
        const isDuplicate = state.history.length > 0 &&
            state.history[0].value === value &&
            state.history[0].fromUnit === entry.fromUnit &&
            state.history[0].toUnit === entry.toUnit;

        if (!isDuplicate) {
            state.history.unshift(entry);
            if (state.history.length > MAX_HISTORY) {
                state.history.pop();
            }
            saveHistory();
            renderHistory();
        }
    }

    function renderHistory() {
        if (state.history.length === 0) {
            elements.historyList.innerHTML = '<li class="history-empty">No conversions yet</li>';
            return;
        }

        elements.historyList.innerHTML = state.history.map(entry => `
            <li class="history-item">
                <span class="history-from">${entry.value} ${entry.fromUnit}</span>
                <span class="history-arrow">=</span>
                <span class="history-to">${entry.result} ${entry.toUnit}</span>
            </li>
        `).join('');
    }

    function clearHistory() {
        state.history = [];
        saveHistory();
        renderHistory();
        showToast('History cleared', 'success');
    }

    // =========================================================================
    // QUICK REFERENCE
    // =========================================================================

    function updateQuickReference() {
        const fromUnit = elements.fromUnit.value;
        const toUnit = elements.toUnit.value;

        if (!fromUnit || !toUnit) {
            elements.quickReference.innerHTML = '';
            return;
        }

        const result = UnitConverter.convert(1, fromUnit, toUnit, state.currentCategory);
        if (result.error) {
            elements.quickReference.innerHTML = '';
            return;
        }

        const fromSymbol = UnitConverter.getUnitSymbol(fromUnit);
        const toSymbol = UnitConverter.getUnitSymbol(toUnit);
        const formatted = UnitConverter.formatResult(result.value, { precision: 6 });

        elements.quickReference.innerHTML = `
            <span class="ref-text">1 ${fromSymbol} = ${formatted} ${toSymbol}</span>
        `;
    }

    // =========================================================================
    // TOAST NOTIFICATIONS
    // =========================================================================

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        elements.toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 1500);
    }

    // =========================================================================
    // START
    // =========================================================================

    // Wait for Capacitor if available
    if (window.Capacitor) {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
