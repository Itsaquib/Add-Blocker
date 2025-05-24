document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle-ext');
  const statusText = document.getElementById('status-text');

  // Initialize extension state if not set
  chrome.storage.local.get('extensionEnabled', (data) => {
    if (data.extensionEnabled === undefined) {
      // Set initial state to enabled
      chrome.storage.local.set({ extensionEnabled: true }, () => {
        toggle.checked = true;
        updateStatusText(true);
        // Trigger initial ad blocking on all tabs
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { action: 'toggleExtension', isEnabled: true });
          });
        });
      });
    } else {
      toggle.checked = data.extensionEnabled;
      updateStatusText(data.extensionEnabled);
    }
  });

  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.local.set({ extensionEnabled: isEnabled });
    updateStatusText(isEnabled);
    
    // Send message to all tabs to update content script
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { action: 'toggleExtension', isEnabled });
      });
    });
  });

  function updateStatusText(isEnabled) {
    statusText.textContent = isEnabled ? "Ads are being blocked" : "Ad blocking is disabled";
    statusText.className = isEnabled ? 'status-on' : 'status-off';
  }
});
