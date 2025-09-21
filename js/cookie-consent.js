/**
 * GDPR Cookie Consent System
 * Controls Google Analytics and other tracking scripts
 */

(function() {
    'use strict';

    const GA_TRACKING_ID = 'G-7MGBF86EHE';
    const CONSENT_COOKIE_NAME = 'cookie_consent';
    const CONSENT_EXPIRY_DAYS = 365;

    class CookieConsent {
        constructor() {
            this.consentState = this.getConsentState();
            this.init();
        }

        init() {
            // Block GA by default until consent is given
            this.blockGoogleAnalytics();

            // Check consent state
            if (this.consentState === null) {
                // First visit - show banner
                this.showBanner();
            } else if (this.consentState === 'accepted') {
                // Consent given - enable GA
                this.enableGoogleAnalytics();
            }

            // Set up event listeners for footer links
            this.setupEventListeners();
        }

        getConsentState() {
            const cookie = this.getCookie(CONSENT_COOKIE_NAME);
            return cookie ? JSON.parse(cookie).consent : null;
        }

        setConsentState(state) {
            const data = {
                consent: state,
                timestamp: new Date().toISOString()
            };
            this.setCookie(CONSENT_COOKIE_NAME, JSON.stringify(data), CONSENT_EXPIRY_DAYS);
            this.consentState = state;
        }

        getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        setCookie(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Strict";
        }

        deleteCookie(name) {
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
        }

        deleteAllGoogleCookies() {
            // Delete all Google Analytics cookies
            const gaCookies = ['_ga', '_gid', '_gat', '_ga_' + GA_TRACKING_ID.replace('G-', '')];
            gaCookies.forEach(cookieName => {
                // Delete for current domain
                this.deleteCookie(cookieName);
                // Delete for all subdomains
                document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=." + window.location.hostname + ";";
                document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=" + window.location.hostname + ";";
            });
        }

        blockGoogleAnalytics() {
            // Prevent GA from setting cookies
            window['ga-disable-' + GA_TRACKING_ID] = true;

            // Remove any existing GA scripts
            const gaScripts = document.querySelectorAll('script[src*="googletagmanager.com/gtag"]');
            gaScripts.forEach(script => script.remove());

            // Clear dataLayer
            window.dataLayer = [];

            // Delete existing GA cookies
            this.deleteAllGoogleCookies();
        }

        enableGoogleAnalytics() {
            // Enable GA
            window['ga-disable-' + GA_TRACKING_ID] = false;

            // Check if gtag is already loaded
            if (typeof gtag === 'undefined') {
                // Load GA script
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_TRACKING_ID;
                document.head.appendChild(script);

                // Initialize gtag
                window.dataLayer = window.dataLayer || [];
                window.gtag = function() { window.dataLayer.push(arguments); };
                window.gtag('js', new Date());
                window.gtag('config', GA_TRACKING_ID, {
                    'anonymize_ip': true,
                    'storage': 'cookies'
                });
            }
        }

        showBanner() {
            const banner = document.createElement('div');
            banner.id = 'cookie-consent-banner';
            banner.className = 'cookie-consent-banner';
            banner.innerHTML = `
                <div class="cookie-consent-content">
                    <div class="cookie-consent-text">
                        <h3>Cookie Consent</h3>
                        <p>We use cookies to analyze website traffic and optimize your experience. By accepting, you consent to our use of analytics cookies.</p>
                    </div>
                    <div class="cookie-consent-actions">
                        <button id="cookie-consent-accept" class="cookie-btn cookie-btn-accept">Accept</button>
                        <button id="cookie-consent-reject" class="cookie-btn cookie-btn-reject">Reject</button>
                        <button id="cookie-consent-settings" class="cookie-btn cookie-btn-settings">Settings</button>
                    </div>
                </div>
            `;
            document.body.appendChild(banner);

            // Add event listeners
            document.getElementById('cookie-consent-accept').addEventListener('click', () => this.acceptCookies());
            document.getElementById('cookie-consent-reject').addEventListener('click', () => this.rejectCookies());
            document.getElementById('cookie-consent-settings').addEventListener('click', () => this.showSettings());

            // Animate banner entrance
            setTimeout(() => banner.classList.add('show'), 100);
        }

        hideBanner() {
            const banner = document.getElementById('cookie-consent-banner');
            if (banner) {
                banner.classList.remove('show');
                setTimeout(() => banner.remove(), 300);
            }
        }

        acceptCookies() {
            this.setConsentState('accepted');
            this.enableGoogleAnalytics();
            this.hideBanner();
            this.hideSettings();
        }

        rejectCookies() {
            this.setConsentState('rejected');
            this.blockGoogleAnalytics();
            this.hideBanner();
            this.hideSettings();
        }

        resetConsent() {
            this.deleteCookie(CONSENT_COOKIE_NAME);
            this.consentState = null;
            this.blockGoogleAnalytics();
            this.showBanner();
        }

        showSettings() {
            // Hide banner if visible
            this.hideBanner();

            // Create or show settings modal
            let modal = document.getElementById('cookie-settings-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'cookie-settings-modal';
                modal.className = 'cookie-settings-modal';
                modal.innerHTML = `
                    <div class="cookie-settings-content">
                        <div class="cookie-settings-header">
                            <h2>Cookie Preferences</h2>
                            <button class="cookie-settings-close" id="cookie-settings-close">&times;</button>
                        </div>
                        <div class="cookie-settings-body">
                            <div class="cookie-category">
                                <div class="cookie-category-header">
                                    <h3>Necessary Cookies</h3>
                                    <label class="cookie-switch">
                                        <input type="checkbox" checked disabled>
                                        <span class="cookie-slider"></span>
                                    </label>
                                </div>
                                <p>These cookies are essential for the website to function properly.</p>
                            </div>
                            <div class="cookie-category">
                                <div class="cookie-category-header">
                                    <h3>Analytics Cookies</h3>
                                    <label class="cookie-switch">
                                        <input type="checkbox" id="analytics-toggle" ${this.consentState === 'accepted' ? 'checked' : ''}>
                                        <span class="cookie-slider"></span>
                                    </label>
                                </div>
                                <p>These cookies help us understand how visitors interact with our website.</p>
                            </div>
                        </div>
                        <div class="cookie-settings-footer">
                            <button id="cookie-settings-save" class="cookie-btn cookie-btn-accept">Save Preferences</button>
                            <button id="cookie-settings-reject-all" class="cookie-btn cookie-btn-reject">Reject All</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                // Add event listeners
                document.getElementById('cookie-settings-close').addEventListener('click', () => this.hideSettings());
                document.getElementById('cookie-settings-save').addEventListener('click', () => this.saveSettings());
                document.getElementById('cookie-settings-reject-all').addEventListener('click', () => this.rejectCookies());
            }

            modal.classList.add('show');
        }

        hideSettings() {
            const modal = document.getElementById('cookie-settings-modal');
            if (modal) {
                modal.classList.remove('show');
            }
        }

        saveSettings() {
            const analyticsToggle = document.getElementById('analytics-toggle');
            if (analyticsToggle && analyticsToggle.checked) {
                this.acceptCookies();
            } else {
                this.rejectCookies();
            }
        }

        setupEventListeners() {
            // Listen for clicks on cookie preference links
            document.addEventListener('click', (e) => {
                if (e.target.matches('[data-cookie-preferences]')) {
                    e.preventDefault();
                    this.showSettings();
                }
                if (e.target.matches('[data-cookie-reset]')) {
                    e.preventDefault();
                    this.resetConsent();
                }
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new CookieConsent());
    } else {
        new CookieConsent();
    }

    // Expose to global scope for external access
    window.CookieConsent = CookieConsent;
})();