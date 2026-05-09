'use strict';
// Extension popup
document.addEventListener('DOMContentLoaded', async () => {
    const toggleSwitch = document.getElementById('themeToggle');

    // Load initial state when the popup opens
    const { isThemeEnabled } = await chrome.storage.local.get('isThemeEnabled');
    toggleSwitch.checked = isThemeEnabled || false;

    // Listen for clicks
    toggleSwitch.addEventListener('change', (event) => {
        const newState = event.target.checked;

        // Tell the background script to toggle the theme
        chrome.runtime.sendMessage({
            action: 'TOGGLE_THEME',
            isThemeEnabled: newState
        });
    });
});