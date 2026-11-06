(() => {
    document.documentElement.setAttribute("data-sugarskull", "calavera");

    // Remove a stylesheet node or inline style attribute
    const stripNodeStyle = (node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        const tag = node.tagName.toLowerCase();
        if (tag === "style" || (tag === "link" && node.rel?.toLowerCase().includes("stylesheet"))) {
            node.disabled = true;
            node.remove();
            return;
        }

        if (node.hasAttribute("style")) {
            node.removeAttribute("style");
        }
    };

    // Sweep any existing nodes and watch the DOM as it parses
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "attributes" && mutation.attributeName === "style") {
                mutation.target.removeAttribute("style");
            }
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    stripNodeStyle(addedNode);
                    addedNode
                        .querySelectorAll?.('style, link[rel*="stylesheet"], [style]')
                        .forEach(stripNodeStyle);
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style"],
    });

    const initCalaveraDOM = () => {
        // Final sweep once the initial DOM finishes parsing
        document
            .querySelectorAll('style, link[rel*="stylesheet"], [style]')
            .forEach(stripNodeStyle);

        const loginForm =
            document.querySelector("form#fm1") ||
            document.querySelector(".login-form") ||
            document.querySelector("form[action*='login']");

        if (!loginForm || loginForm.querySelector(".ss-calavera-header")) return;

        const header = document.createElement("div");
        header.className = "ss-calavera-header";
        const skullUrl = chrome.runtime.getURL("assets/SSCalavera.png");

        header.innerHTML = `
      <img class="ss-calavera-logo" src="${skullUrl}" alt="SugarSkull" />
      <h2 class="ss-calavera-title">SugarSkull</h2>
    `;

        loginForm.prepend(header);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCalaveraDOM, { once: true });
    } else {
        initCalaveraDOM();
    }
})();