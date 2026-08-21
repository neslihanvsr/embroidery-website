/**
 * main.js
 *
 * Core application script responsible for rendering the shared site header,
 * navigation links, language switcher, mobile drawer navigation, active link state,
 * and copyright year.
 */

import {
    getStoredLanguage,
    getCurrentLanguage,
    loadTranslations,
    getTranslation,
    changeLanguage
} from './utils.js';

// Function to render the header
function renderHeader() {
    const currentLang = getCurrentLanguage() || getStoredLanguage();

    const homeText = getTranslation('navbar.home', 'Home');
    const shopText = getTranslation('navbar.shop', 'Shop');
    const galleryText = getTranslation('navbar.gallery', 'Gallery');
    const aboutText = getTranslation('navbar.about', 'About');
    const customOrdersText = getTranslation('navbar.customOrders', 'Custom Orders');
    const contactText = getTranslation('navbar.contact', 'Contact');

    const headerHtml = `
        <header class="site-header">
            <div class="container">
                <div class="header-content">
                    <a href="index.html" class="site-logo">
                        <img src="assets/images/branding/1.jpg" alt="HoyThreads Embroidery Logo - Stylized Animal Figures" width="150" height="40">
                    </a>
                    <!-- Desktop Navigation -->
                    <nav class="nav--desktop">
                        <ul class="nav__list">
                            <li class="nav__item"><a href="index.html">${homeText}</a></li>
                            <li class="nav__item"><a href="products.html">${shopText}</a></li>
                            <li class="nav__item"><a href="gallery.html">${galleryText}</a></li>
                            <li class="nav__item"><a href="about.html">${aboutText}</a></li>
                            <li class="nav__item"><a href="custom-orders.html">${customOrdersText}</a></li>
                            <li class="nav__item"><a href="contact.html">${contactText}</a></li>
                        </ul>
                    </nav>
                    <!-- Header Actions (Language Switcher & Mobile Toggle) -->
                    <div class="header-actions">
                        <div class="lang-switcher" role="group" aria-label="Language selection">
                            <button type="button" class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" aria-label="English" aria-pressed="${currentLang === 'en'}">EN</button>
                            <span class="lang-separator" aria-hidden="true">|</span>
                            <button type="button" class="lang-btn ${currentLang === 'tr' ? 'active' : ''}" data-lang="tr" aria-label="Türkçe" aria-pressed="${currentLang === 'tr'}">TR</button>
                        </div>
                        <!-- Mobile Navigation Toggle (Hamburger) -->
                        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
                            <span class="hamburger-icon"></span>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Mobile Navigation (hidden by default, toggled by JS) -->
            <nav class="nav--mobile" aria-label="Mobile navigation">
                <ul class="nav__list">
                    <li class="nav__item"><a href="index.html">${homeText}</a></li>
                    <li class="nav__item"><a href="products.html">${shopText}</a></li>
                    <li class="nav__item"><a href="gallery.html">${galleryText}</a></li>
                    <li class="nav__item"><a href="about.html">${aboutText}</a></li>
                    <li class="nav__item"><a href="custom-orders.html">${customOrdersText}</a></li>
                    <li class="nav__item"><a href="contact.html">${contactText}</a></li>
                </ul>
            </nav>
        </header>
    `;

    const headerRoot = document.getElementById('header-root');
    if (headerRoot) {
        headerRoot.innerHTML = headerHtml;
        setActiveNavLink(); // Set active class after header is rendered
        setupMobileNavToggle(); // Setup toggle after header is rendered
        setupLanguageSwitcher(); // Setup language switch buttons
    }
}

// Function to set the active navigation link
function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop(); // Get filename (e.g., "index.html")
    const navLinks = document.querySelectorAll('.nav__list a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop(); // Get filename from href
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) { // Handle index.html for root path
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active'); // Ensure only one is active
            link.removeAttribute('aria-current');
        }
    });
}

// Function to set up mobile navigation toggle
function setupMobileNavToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.nav--mobile');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNav.classList.toggle('is-open');
        });

        // Close mobile nav when a link is clicked (optional, but good UX)
        mobileNav.querySelectorAll('.nav__item a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('is-open');
            });
        });
    }
}

// Function to set up language switcher buttons
function setupLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const selectedLang = e.currentTarget.getAttribute('data-lang');
            const activeLang = getCurrentLanguage() || getStoredLanguage();

            if (selectedLang && selectedLang !== activeLang) {
                await changeLanguage(selectedLang);
                renderHeader();
            }
        });
    });
}

// Global Escape key listener for mobile nav
document.addEventListener('keydown', (event) => {
    const mobileNav = document.querySelector('.nav--mobile');
    const navToggle = document.querySelector('.nav-toggle');
    if (event.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
        navToggle.focus(); // Return focus to the toggle button
    }
});

// Function to dynamically update the copyright year
function updateCopyrightYear() {
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        const currentYear = new Date().getFullYear();
        currentYearSpan.textContent = currentYear;
    }
}

// Initialize application
async function init() {
    const initialLang = getStoredLanguage();
    await loadTranslations(initialLang);
    if (document.documentElement) {
        document.documentElement.lang = initialLang;
    }

    renderHeader();
    updateCopyrightYear();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

           