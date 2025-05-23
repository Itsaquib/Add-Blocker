let observer = null;

function initializeAdBlocker() {
  class ViewElement {
    constructor() {
      this.element = document.querySelectorAll(
        "[data-google-query-id], iframe"
      );
      this.body = document.body;
    }
  }

  // Remove Add's Element Function
  function removeAddElement() {
    const viewElement = new ViewElement();
    if (viewElement.element) {
      console.log(viewElement.element, "Element");
      viewElement.element.forEach((element) => {
        element.remove();
      });
    }
  }

  // Adding an mutation Observer
  function onMutationObserver() {
    if (!document.body) return;
    let isSelfMutating = false;

    observer = new MutationObserver((mutationsList) => {
      if (isSelfMutating) return;

      isSelfMutating = true;
      removeAddElement(); // Safely apply our logic
      isSelfMutating = false;
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Main Entry of Script where everything starts
  function onReady() {
    console.log("Add's Blocker script is starting...");
    // Remove the Element That contains Add's
    removeAddElement();

    // Mutation Observer for remove add continuously
    onMutationObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
}

function stopAdBlocker() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Listen for toggle messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleExtension') {
    if (message.isEnabled) {
      initializeAdBlocker();
    } else {
      stopAdBlocker();
    }
  }
});

// Initial check and setup - start enabled by default
chrome.storage.local.get("extensionEnabled", (data) => {
  // Initialize if enabled or not set (default to enabled)
  if (data.extensionEnabled !== false) {
    initializeAdBlocker();
  }
});
