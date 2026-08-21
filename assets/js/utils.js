/**
 * utils.js
 *
 * Contains shared utility functions used across different JavaScript modules.
 */

/**
 * Fetches JSON data from a given path.
 * @param {string} path - The path to the JSON file.
 * @returns {Promise<any>} A promise that resolves with the JSON data.
 */
export async function fetchData(path) {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${path}:`, error);
        return [];
    }
}


// --------------------------------------------------
// Localization
// --------------------------------------------------

let translations = {};
let currentLanguage = 'en';


/**
 * Retrieves the stored language preference from localStorage.
 * Defaults to 'en' if no preference is found.
 *
 * @returns {string} The stored or default language.
 */
export function getStoredLanguage() {
    return localStorage.getItem('language') || 'en';
}


/**
 * Retrieves the currently active in-memory language code.
 *
 * @returns {string} The current language code ('en' or 'tr').
 */
export function getCurrentLanguage() {
    return currentLanguage;
}


/**
 * Sets the language preference in localStorage.
 *
 * @param {string} lang - The language code ('en' or 'tr').
 */
export function setStoredLanguage(lang) {
    localStorage.setItem('language', lang);
    currentLanguage = lang;
}


/**
 * Loads translation data for the specified language.
 *
 * If the requested language cannot be loaded,
 * English is used as a fallback.
 *
 * @param {string} lang - The language code ('en' or 'tr').
 * @returns {Promise<void>}
 */
export async function loadTranslations(lang) {
    try {
        const response = await fetch(`content/locales/${lang}.json`);

        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status} for ${lang} translations.`
            );
        }

        translations = await response.json();
        currentLanguage = lang;

    } catch (error) {
        console.warn(
            `Could not load translations for "${lang}". Attempting English fallback.`,
            error
        );

        // Don't try English again if English itself failed
        if (lang !== 'en') {
            try {
                const enResponse = await fetch('content/locales/en.json');

                if (!enResponse.ok) {
                    throw new Error(
                        `HTTP error! status: ${enResponse.status} for English translations.`
                    );
                }

                translations = await enResponse.json();
                currentLanguage = 'en';

            } catch (fallbackError) {
                console.error(
                    'Could not load English translations either:',
                    fallbackError
                );

                translations = {};
                currentLanguage = 'en';
            }
        } else {
            translations = {};
            currentLanguage = 'en';
        }
    }

    applyTranslations();
}


/**
 * Applies translations to all DOM elements bearing data-i18n attributes.
 */
export function applyTranslations() {
    if (typeof document === 'undefined') return;

    // 1. Text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (key) {
            const translation = getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        }
    });

    // 2. Attribute bindings
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria-label');
        if (key) {
            const translation = getTranslation(key);
            if (translation) {
                element.setAttribute('aria-label', translation);
            }
        }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        if (key) {
            const translation = getTranslation(key);
            if (translation) {
                element.setAttribute('alt', translation);
            }
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (key) {
            const translation = getTranslation(key);
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (key) {
            const translation = getTranslation(key);
            if (translation) {
                element.setAttribute('title', translation);
            }
        }
    });

    document.querySelectorAll('[data-i18n-content]').forEach(element => {
        const key = element.getAttribute('data-i18n-content');
        if (key) {
            const translation = getTranslation(key);
            if (translation) {
                element.setAttribute('content', translation);
            }
        }
    });
}


/**
 * Changes the active language, loads translation data, updates the <html> lang
 * attribute, and dispatches a 'languageChanged' custom event.
 *
 * @param {string} lang - The language code ('en' or 'tr').
 * @returns {Promise<void>}
 */
export async function changeLanguage(lang) {
    setStoredLanguage(lang);
    await loadTranslations(lang);
    if (document.documentElement) {
        document.documentElement.lang = lang;
    }
    applyTranslations();
    document.dispatchEvent(
        new CustomEvent('languageChanged', {
            detail: { language: lang }
        })
    );
}


/**
 * Retrieves a translated string for a given key.
 *
 * Example:
 * getTranslation('navbar.home', 'Home')
 *
 * @param {string} key - Dot-separated translation key.
 * @param {string} fallbackText - Text to use if the key does not exist.
 * @returns {string}
 */
export function getTranslation(key, fallbackText = '') {
    let value = translations;

    const parts = key.split('.');

    for (const part of parts) {
        if (
            value &&
            typeof value === 'object' &&
            Object.prototype.hasOwnProperty.call(value, part)
        ) {
            value = value[part];
        } else {
            return fallbackText;
        }
    }

    return typeof value === 'string' ? value : fallbackText;
}


// Initialize language from localStorage
currentLanguage = getStoredLanguage();

// Automatically listen for language changes and apply translations to DOM
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyTranslations();
        });
    } else {
        applyTranslations();
    }

    document.addEventListener('languageChanged', () => {
        applyTranslations();
    });
}