//==========================================================
// The Engine: Service Worker Logic (background.js)
//==========================================================
// The background script is the brain of the operation. It needs to handle two primary events:
// - Page Loads: When a user navigates to a UNISA page, check if the theme should be active and inject it.
// - State Changes: When the user clicks the toggle in your popup, immediately apply or remove the CSS on the active tab without requiring a page refresh.
//==========================================================

// Injection Targets
const CSS_MAP = {
    dashboard: {
        pattern: '/my',
        file: 'css/dashboard.css'
    }
};

// Helper function to inject or remove CSS
async function toggleCSS(tabID, URL, enableTheme) {
    // always start with the gloabl theme
    // TODO

    // Determine if a specific page CSS is needed
    if (URL.includes(CSS_MAP.dashboard.pattern)) {
        filesToInject = [CSS_MAP.dashboard.file];
    }

    const injectionOptions = {
        target: { tabId: tabID },
        files: { filesToInject }
    };

    try {
        if (enableTheme) {
            await chrome.scripting.insertCSS(injectionOptions);
            console.log(`[SugarSkull]: Injected CSS into tab ${tabID} for URL: ${URL}`);
        } else {
            await chrome.scripting.remmoveCSS(injectionOptions);
            console.log(`[SugarSkull]: Removed CSS from tab ${tabID} for URL: ${URL}`);
        }
    } catch (error) {
        console.error(`[SugarSkull]: Error toggling CSS for tab ${tabID}:`, error);
    }
}

// Listen for Page Navigation/ Refreshes
chrome.tabs.onUpdated.addListener(async (tabID, changeInfo, tab) => {
    // Ensure the page is fully loaded and matches the target doamain
    if (changeInfo.status === 'complete' && tab.URL?.includes('unisa.ac.za')) {
        const { isThemeEnabled } = await chrome.storage.local.get('isThemeEnabled');

        if (isThemeEnabled) {
            toggleCSS(tabID, tab.URL, true);
        }
    }
});

// Listen for User Toggling the theme on/off from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'TOGGLE_THEME') {
        // Query the active tab to apply or remove the CSS immediately
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab && activeTab.URL.includes('unisa.ac.za')) {
                toggleCSS(activeTab.id, activeTab.URL, message.isThemeEnabled);
            }
        });

        // Save the new state
        chrome.storage.local.set({ isThemeEnabled: message.isThemeEnabled });
        sendResponse({ status: 'sucess' });
    }
    return true; // Keep the message channel open for async response
});