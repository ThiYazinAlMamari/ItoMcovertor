/**
 * ItoMcovertor Desktop - Application Logic
 */

(function () {
    'use strict';

    const el = {
        categoryNav: document.getElementById('categoryNav'),
        fromValue: document.getElementById('fromValue'),
        fromUnit: document.getElementById('fromUnit'),
        toValue: document.getElementById('toValue'),
        toUnit: document.getElementById('toUnit'),
        swapBtn: document.getElementById('swapBtn'),
        themeToggle: document.getElementById('themeToggle'),
        historyList: document.getElementById('historyList'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn'),
        quickReference: document.getElementById('quickReference'),
        toastContainer: document.getElementById('toastContainer'),
        contextMenu: document.getElementById('contextMenu')
    };

    let state = {
        currentCategory: 'length',
        history: [],
        settings: { darkMode: true, precision: 4, autoSave: true },
        contextTarget: null
    };

    const MAX_HISTORY = 20;
    const STORAGE_KEY = 'itom_desktop_settings';
    const HISTORY_KEY = 'itom_desktop_history';

    function init() {
        loadSettings();
        loadHistory();
        applyTheme();
        setupEventListeners();
        loadCategory(state.currentCategory);
        el.fromValue.focus();
    }

    function applyTheme() {
        if (state.settings.darkMode !== false) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    function toggleTheme() {
        state.settings.darkMode = !state.settings.darkMode;
        applyTheme();
        saveSettings();
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) state.settings = { ...state.settings, ...JSON.parse(saved) };
        } catch (e) { }
    }

    function saveSettings() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings)); } catch (e) { }
    }

    function loadHistory() {
        try {
            const saved = localStorage.getItem(HISTORY_KEY);
            if (saved) { state.history = JSON.parse(saved); renderHistory(); }
        } catch (e) { }
    }

    function saveHistory() {
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history)); } catch (e) { }
    }

    function setupEventListeners() {
        // Category navigation
        el.categoryNav.addEventListener('click', (e) => {
            const row = e.target.closest('.nav-row');
            if (row && row.dataset.category) {
                setActiveCategory(row);
                loadCategory(row.dataset.category);
            }
        });

        // Input handling
        el.fromValue.addEventListener('input', performConversion);
        el.fromUnit.addEventListener('change', performConversion);
        el.toUnit.addEventListener('change', performConversion);

        // Swap
        el.swapBtn.addEventListener('click', swapUnits);

        // Theme
        el.themeToggle.addEventListener('click', toggleTheme);

        // Copy result
        el.toValue.addEventListener('click', copyResult);

        // Clear history
        el.clearHistoryBtn.addEventListener('click', clearHistory);

        // History context menu
        el.historyList.addEventListener('contextmenu', (e) => {
            const item = e.target.closest('.history-item');
            if (item) {
                e.preventDefault();
                state.contextTarget = parseInt(item.dataset.index);
                showContextMenu(e.clientX, e.clientY);
            }
        });

        // Context menu actions
        el.contextMenu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action && state.contextTarget !== null) {
                handleContextAction(action, state.contextTarget);
            }
            hideContextMenu();
        });

        // Hide context menu on click elsewhere
        document.addEventListener('click', hideContextMenu);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); swapUnits(); }
            if (e.key === 'Enter' && document.activeElement === el.fromValue) { el.toValue.focus(); }
            if (e.key === 'Escape') hideContextMenu();
        });
    }

    function setActiveCategory(row) {
        el.categoryNav.querySelectorAll('.nav-row').forEach(r => r.classList.remove('active'));
        row.classList.add('active');
    }

    function loadCategory(category) {
        state.currentCategory = category;
        const units = UnitConverter.units[category];
        if (!units) return;

        populateSelect(el.fromUnit, units);
        populateSelect(el.toUnit, units);

        const imperial = units.find(u => u.system === 'imperial');
        const metric = units.find(u => u.system === 'metric');
        if (imperial) el.fromUnit.value = imperial.id;
        if (metric) el.toUnit.value = metric.id;

        el.fromValue.value = '';
        el.toValue.value = '';
        updateQuickReference();
    }

    function populateSelect(select, units) {
        select.innerHTML = '';
        const imperial = units.filter(u => u.system === 'imperial');
        const metric = units.filter(u => u.system === 'metric');

        if (imperial.length) {
            const g = document.createElement('optgroup'); g.label = 'Imperial';
            imperial.forEach(u => { const o = document.createElement('option'); o.value = u.id; o.textContent = u.name; g.appendChild(o); });
            select.appendChild(g);
        }
        if (metric.length) {
            const g = document.createElement('optgroup'); g.label = 'Metric';
            metric.forEach(u => { const o = document.createElement('option'); o.value = u.id; o.textContent = u.name; g.appendChild(o); });
            select.appendChild(g);
        }
    }

    function performConversion() {
        const value = parseFloat(el.fromValue.value);
        const from = el.fromUnit.value, to = el.toUnit.value;

        if (isNaN(value) || !from || !to) { el.toValue.value = ''; updateQuickReference(); return; }

        const result = UnitConverter.convert(value, from, to, state.currentCategory);
        if (result.error) { el.toValue.value = ''; showToast(result.error, 'error'); }
        else {
            const formatted = UnitConverter.formatResult(result.value, state.settings);
            el.toValue.value = formatted;
            if (state.settings.autoSave && value !== 0) addToHistory(value, from, to, formatted);
        }
        updateQuickReference();
    }

    function swapUnits() {
        const tmpUnit = el.fromUnit.value;
        el.fromUnit.value = el.toUnit.value;
        el.toUnit.value = tmpUnit;
        const tmpVal = el.fromValue.value;
        el.fromValue.value = el.toValue.value.replace(/,/g, '');
        el.toValue.value = tmpVal;
        performConversion();
    }

    function copyResult() {
        const r = el.toValue.value;
        if (!r) return;
        navigator.clipboard.writeText(r).then(() => showToast('Copied', 'success')).catch(() => showToast('Failed', 'error'));
    }

    function addToHistory(value, from, to, result) {
        const entry = {
            value, fromUnit: UnitConverter.getUnitSymbol(from),
            toUnit: UnitConverter.getUnitSymbol(to), result,
            category: state.currentCategory, timestamp: Date.now()
        };
        const dup = state.history.length && state.history[0].value === value &&
            state.history[0].fromUnit === entry.fromUnit && state.history[0].toUnit === entry.toUnit;
        if (!dup) {
            state.history.unshift(entry);
            if (state.history.length > MAX_HISTORY) state.history.pop();
            saveHistory(); renderHistory();
        }
    }

    function renderHistory() {
        if (!state.history.length) {
            el.historyList.innerHTML = '<li class="history-empty">No conversions</li>';
            return;
        }
        el.historyList.innerHTML = state.history.map((e, i) =>
            `<li class="history-item" data-index="${i}"><span class="history-from">${e.value} ${e.fromUnit}</span><span class="history-arrow">→</span><span class="history-to">${e.result} ${e.toUnit}</span></li>`
        ).join('');

        // Click to copy
        el.historyList.querySelectorAll('.history-item').forEach((item) => {
            item.addEventListener('click', (ev) => {
                if (ev.button !== 0) return; // Left click only
                const idx = parseInt(item.dataset.index);
                const e = state.history[idx];
                navigator.clipboard.writeText(`${e.value} ${e.fromUnit} = ${e.result} ${e.toUnit}`);
                showToast('Copied', 'success');
            });
        });
    }

    function clearHistory() {
        state.history = [];
        saveHistory();
        renderHistory();
        showToast('Cleared', 'success');
    }

    // Context menu
    function showContextMenu(x, y) {
        el.contextMenu.style.left = x + 'px';
        el.contextMenu.style.top = y + 'px';
        el.contextMenu.classList.add('visible');
    }

    function hideContextMenu() {
        el.contextMenu.classList.remove('visible');
        state.contextTarget = null;
    }

    function handleContextAction(action, index) {
        const entry = state.history[index];
        if (!entry) return;

        if (action === 'copy') {
            navigator.clipboard.writeText(`${entry.value} ${entry.fromUnit} = ${entry.result} ${entry.toUnit}`);
            showToast('Copied', 'success');
        } else if (action === 'delete') {
            state.history.splice(index, 1);
            saveHistory();
            renderHistory();
            showToast('Deleted', 'success');
        }
    }

    function updateQuickReference() {
        const from = el.fromUnit.value, to = el.toUnit.value;
        if (!from || !to) { el.quickReference.textContent = ''; return; }
        const r = UnitConverter.convert(1, from, to, state.currentCategory);
        if (r.error) { el.quickReference.textContent = ''; return; }
        el.quickReference.textContent = `1 ${UnitConverter.getUnitSymbol(from)} = ${UnitConverter.formatResult(r.value, { precision: 6 })} ${UnitConverter.getUnitSymbol(to)}`;
    }

    function showToast(msg, type = 'info') {
        const t = document.createElement('div');
        t.className = `toast toast-${type}`; t.textContent = msg;
        el.toastContainer.appendChild(t);
        setTimeout(() => t.classList.add('show'), 10);
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 150); }, 1200);
    }

    init();
})();
