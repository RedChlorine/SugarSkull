// @ts-check
'use strict';
//==========================================================
// The Engine: Service Worker Logic (background.js)
//==========================================================
// The background script is the brain of the operation. It needs to handle two primary events:
// - Page Loads: When a user navigates to a UNISA page, check if the theme should be active and inject it.
// - State Changes: When the user clicks the toggle in your popup, immediately apply or remove the CSS on the active tab without requiring a page refresh.
//==========================================================

// Injection Targets
/**
 * @typedef  {Object} ThemeTarget
 * @property {string} pattern
 * @property {string} file
 */

/** * @type {Object<string, ThemeTarget>} 
 */
const CSS_MAP = {
    landing: {
        pattern: '/myunisa',
        file: 'Themes/SugarSkullTheme/SugarSkullThemeLandingPage.css'
    },
    login: {
        pattern: '/login',
        file: 'Themes/SugarSkullTheme/SugarSkullThemeLoginPage.css'
    }
};

// Helper function to inject or remove CSS
/**
 * @param {number} tabID
 * @param {string} url
 * @param {boolean} enableTheme
 */
async function toggleCSS(tabID, url, enableTheme) {
    let filesToInject = [];

    // Dynamically iterate through the CSS_MAP to determine which files to inject based on the URL
    for (const key in CSS_MAP) {
        const target = CSS_MAP[key];

        if (url.includes(target.pattern)) {
            filesToInject.push(target.file);
            break; // Assuming one theme per page, break after finding the first match - performance optimization
        }
    }

    // If the loop finished and the arrar is empty -> exit early + log
    if (filesToInject.length === 0) {
        console.log(`[SugarSkull]: No matching CSS target for this URL: ${url}`);
        return;
    }

    const injectionOptions = {
        target: { tabId: tabID },
        files: filesToInject
    };

    // Inject or Remove CSS based on the enableTheme flag + log
    try {
        if (enableTheme) {
            await chrome.scripting.insertCSS(injectionOptions);
            console.log(`[SugarSkull]: Injected CSS for ${url}`);
        } else {
            await chrome.scripting.removeCSS(injectionOptions);
            console.log(`[SugarSkull]: Removed CSS for ${url}`);
        }
    } catch (error) {
        console.error(`[SugarSkull]: Error while toggling CSS for ${url} - ${error}`);
    }
}
// Listen for Page Navigation/ Refreshes
chrome.tabs.onUpdated.addListener(async (tabID, changeInfo, tab) => {
    // Ensure the page is fully loaded and matches the target doamain
    if (changeInfo.status === 'complete' && tab.url?.includes('unisa.ac.za')) {
        const { isThemeEnabled } = await chrome.storage.local.get('isThemeEnabled');

        if (isThemeEnabled) {
            toggleCSS(tabID, tab.url, true);
        }
    }
});

// Listen for User Toggling the theme on/off from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'TOGGLE_THEME') {
        // Query the active tab to apply or remove the CSS immediately
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab && typeof activeTab.id === 'number' && activeTab.url?.includes('unisa.ac.za')) {
                toggleCSS(activeTab.id, activeTab.url, message.isThemeEnabled);
            }
        });

        // Save the new state
        chrome.storage.local.set({ isThemeEnabled: message.isThemeEnabled });
        sendResponse({ status: 'sucess' });
    }
    return true; // Keep the message channel open for async response
});