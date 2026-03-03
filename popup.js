const toggleSugarSkull = document.getElementById('toggleSugarSkullMode');

// Load current saved theme data
chrome.storage.local.get('enabled', (data)=>{
    toggleSugarSkull.checked = data.enabled !== false; //default to true if not set
});

// Save when the state is clicked
toggleSugarSkull.addEventListener('change', ()=>{
    chrome.storage.local.set({enabled: toggleSugarSkull.checked});
});