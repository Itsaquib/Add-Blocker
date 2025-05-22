chrome.storage.local.get("extensionEnabled", (data) => {
  if (!data.extensionEnabled) {
    console.log("Extension is OFF");
    return;
  }

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

  // Adding an mutataion Observer

  function onMutationObserver() {
    if (!document.body) return;
    let isSelfMutating = false;

    const observer = new MutationObserver((mutationsList) => {
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
  (async function () {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onReady);
    } else {
      onReady();
    }

    function onReady() {
      console.log("Add's Blocker script is starting...");
      // Remove the Element That contains Add's
      removeAddElement();

      // Mutation Observer for remove add continuously
      onMutationObserver();
    }
  })();
});
