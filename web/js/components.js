/**
 * Components - Reusable Header and Footer
 * Uses inline templates so it works with file:// protocol (no fetch needed)
 */

(function () {
    'use strict';

    // =========================================================================
    // HEADER TEMPLATE
    // =========================================================================

    const headerHTML = `
    <nav class="navbar">
        <div class="navbar-container">
            <a href="index.html" class="navbar-brand">
                <img src="logo.svg" alt="ItoMcovertor Logo" class="navbar-logo">
                <span class="navbar-title">ItoMcovertor</span>
            </a>
            
            <ul class="navbar-nav">
                <li><a href="index.html#converter" class="nav-link" data-page="index">Converter</a></li>
                <li><a href="index.html#faq" class="nav-link" data-page="faq">FAQ</a></li>
                <li><a href="changelog.html" class="nav-link" data-page="changelog">Changelog</a></li>
                <li><a href="support.html" class="nav-link" data-page="support">Support</a></li>
                <li><a href="https://chrome.google.com/webstore" target="_blank" rel="noopener" class="nav-link nav-extension">Extension</a></li>
            </ul>
            
            <div class="navbar-actions">
                <button class="theme-toggle" id="themeToggle" title="Toggle theme">
                    <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                    <svg class="moon-icon" style="display:none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                </button>
                <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle mobile menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
            </div>
        </div>
    </nav>`;

    // =========================================================================
    // FOOTER TEMPLATE
    // =========================================================================

    const footerHTML = `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="index.html" class="footer-brand-link">
                        <img src="logo.svg" alt="ItoMcovertor" class="footer-logo">
                        <span class="footer-title">ItoMcovertor</span>
                    </a>
                    <p class="footer-description">Fast, accurate, and free unit conversions between Imperial and Metric systems. Built for developers, students, and professionals.</p>
                </div>
                <div class="footer-column">
                    <h4>Product</h4>
                    <ul class="footer-links">
                        <li><a href="index.html#converter">Web Converter</a></li>
                        <li><a href="https://chrome.google.com/webstore" target="_blank" rel="noopener">Chrome Extension</a></li>
                        <li><a href="index.html#faq">FAQ</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Resources</h4>
                    <ul class="footer-links">
                        <li><a href="changelog.html">Changelog</a></li>
                        <li><a href="support.html">Support</a></li>
                        <li><a href="privacy.html">Privacy Policy</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Connect</h4>
                    <ul class="footer-links">
                        <li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>
                        <li><a href="support.html">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p class="footer-copyright">&copy;2026 ItoMcovertor. All rights reserved.</p>
            </div>
        </div>
    </footer>`;

    // =========================================================================
    // COOKIE BANNER TEMPLATE
    // =========================================================================

    const cookieBannerHTML = `
    <div class="cookie-banner" id="cookieBanner" role="dialog" aria-labelledby="cookieTitle" aria-describedby="cookieText">
        <div class="cookie-container">
            <div class="cookie-content">
                <div class="cookie-title" id="cookieTitle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        aria-hidden="true">
                        <path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-4-4 3 3 0 0 1-3-3 2 2 0 0 1-2-2"/>
                        <circle cx="9.6" cy="11.3" r="0.8" fill="currentColor" stroke="none"/>
                        <circle cx="12.0" cy="14.4" r="0.8" fill="currentColor" stroke="none"/>
                        <circle cx="13.9" cy="11.9" r="0.8" fill="currentColor" stroke="none"/>
                    </svg>
                    We use cookies
                </div>
                <p class="cookie-text" id="cookieText">
                    We use cookies to save your preferences and conversion history locally.
                    No data is sent to our servers. <a href="privacy.html">Learn more</a>
                </p>
            </div>
            <div class="cookie-actions">
                <button class="cookie-btn cookie-btn-decline" id="cookieDecline">Decline</button>
                <button class="cookie-btn cookie-btn-accept" id="cookieAccept">Accept</button>
            </div>
        </div>
    </div>`;

    // =========================================================================
    // COOKIE UTILITIES
    // =========================================================================

    const COOKIE_KEY = 'unitConverter_cookieConsent';

    const CookieManager = {
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
        set(name, value, days) {
            const expires = new Date();
            expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        },
        hasConsented() {
            return this.get(COOKIE_KEY) === 'accepted';
        },
        hasDeclined() {
            return this.get(COOKIE_KEY) === 'declined';
        },
        needsConsent() {
            return this.get(COOKIE_KEY) === null;
        }
    };

    function initCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (!banner) return;

        // Show if no consent choice made yet
        if (CookieManager.needsConsent()) {
            setTimeout(() => {
                banner.classList.add('show');
            }, 500);
        }

        // Accept button
        const acceptBtn = document.getElementById('cookieAccept');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                CookieManager.set(COOKIE_KEY, 'accepted', 365);
                hideCookieBanner();
            });
        }

        // Decline button
        const declineBtn = document.getElementById('cookieDecline');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                CookieManager.set(COOKIE_KEY, 'declined', 365);
                hideCookieBanner();
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
    // HELPER FUNCTIONS
    // =========================================================================

    // Detect current page for active nav highlighting
    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

        if (filename === 'index.html' || filename === '') return 'index';
        if (filename === 'changelog.html') return 'changelog';
        if (filename === 'support.html') return 'support';
        if (filename === 'privacy.html') return 'privacy';
        return 'index';
    }

    // Set active nav link based on current page
    function setActiveNavLink() {
        const currentPage = getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-link[data-page]');

        navLinks.forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Initialize theme from localStorage
    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Check if theme was already set by early script
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let isDark = currentTheme === 'dark';

        // If not set, check saved settings or system preference
        if (!currentTheme) {
            const savedSettings = localStorage.getItem('unitConverter_settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                if (typeof settings.darkMode === 'boolean') {
                    isDark = settings.darkMode;
                } else {
                    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                }
            } else {
                isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            if (isDark) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }

        // Sync toggle icons with current theme
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        if (sunIcon) sunIcon.style.display = isDark ? 'none' : 'block';
        if (moonIcon) moonIcon.style.display = isDark ? 'block' : 'none';

        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');

            const sunIcon = themeToggle.querySelector('.sun-icon');
            const moonIcon = themeToggle.querySelector('.moon-icon');
            if (sunIcon) sunIcon.style.display = isDark ? 'block' : 'none';
            if (moonIcon) moonIcon.style.display = isDark ? 'none' : 'block';

            const settings = JSON.parse(localStorage.getItem('unitConverter_settings') || '{}');
            settings.darkMode = !isDark;
            localStorage.setItem('unitConverter_settings', JSON.stringify(settings));
        });
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    function init() {
        // Insert header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.outerHTML = headerHTML;
        }

        // Insert footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = footerHTML;
        }

        // Insert cookie banner (append to body)
        const existingBanner = document.getElementById('cookieBanner');
        if (!existingBanner) {
            document.body.insertAdjacentHTML('beforeend', cookieBannerHTML);
        }

        // Initialize after components are inserted
        setActiveNavLink();
        initTheme();
        initCookieBanner();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
