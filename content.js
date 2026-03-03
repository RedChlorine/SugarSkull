function updateTheme(isEnabled) {
    let link = document.getElementById('sugar-skull-stylesheet');

    if (isEnabled) {
        if (!link) {
            link = document.createElement('link');
            link.id = 'sugar-skull-stylesheet';
            link.rel = 'stylesheet';
            link.href = chrome.runtime.getURL('sugar-styles.css');
            document.head.appendChild(link);
        }
        document.body.classList.add('sugar-skull-active');
    } else {
        if (link) link.remove();
        document.body.classList.remove('sugar-skull-active');
    }
}

chrome.storage.local.get('enabled', (data) => {
    updateTheme(data.enabled !== false);
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) {
        updateTheme(changes.enabled.newValue);
    }
});