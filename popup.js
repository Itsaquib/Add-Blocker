document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle-ext');
  const statusText = document.getElementById('status-text');

  chrome.storage.local.get('extensionEnabled', (data) => {
    console.log('extensionEnabled')
    const isEnabled = data.extensionEnabled ?? true;
    toggle.checked = isEnabled;
    statusText.textContent = isEnabled ? "Extension is ON" : "Extension is OFF";
  });

  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.local.set({ extensionEnabled: isEnabled });
    statusText.textContent = isEnabled ? "Extension is ON" : "Extension is OFF";
  });
});
