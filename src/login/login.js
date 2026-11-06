(() => {
    document.documentElement.setAttribute("data-sugarskull", "calavera");

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

    const buildCalaveraLogin = () => {
        document
            .querySelectorAll('style, link[rel*="stylesheet"], [style]')
            .forEach(stripNodeStyle);

        // 1. Check for the myModules Microsoft SSO button first
        const ssoAnchor =
            document.querySelector(".login-identityproviders a, a.login-identityprovider-btn, a[href*='oauth2'], a[href*='oidc']") ||
            Array.from(document.querySelectorAll("a")).find(
                (a) => a.textContent.includes("myLife") || a.textContent.includes("Staff/Marker")
            );

        // 2. Fallback to standard login form for CAS / myAdmin pages
        const loginForm =
            document.querySelector("form#login") ||
            document.querySelector("form#fm1") ||
            document.querySelector(".login-form") ||
            document.querySelector("form[action*='login']");

        if ((!ssoAnchor && !loginForm) || document.querySelector(".ss-outer-card")) return;

        // Stop stripping style attributes so our CSS variables on <html> persist
        observer.disconnect();

        const forgotStudentUrl = "https://myadmin.unisa.ac.za/unisa-studentnumber/default.do";
        const forgotPassUrl = "https://my.unisa.ac.za/portal/pda/__forgot-password";

        // Set background & skull watermark variables
        const bgUrl = chrome.runtime.getURL("assets/bg-pattern.jpg");
        const skullUrl = chrome.runtime.getURL("assets/calavera.png");
        document.documentElement.style.setProperty("--ss-bg-image", `url("${bgUrl}")`);
        document.documentElement.style.setProperty("--ss-skull-image", `url("${skullUrl}")`);

        const outerCard = document.createElement("main");
        outerCard.className = "ss-outer-card";
        outerCard.innerHTML = `
      <header class="ss-card-header">
        <p class="ss-uni-subtitle">UNIVERSITY OF SOUTH AFRICA</p>
        <h1 class="ss-myunisa-title"><span class="ss-my">my</span><span class="ss-unisa">UNISA</span></h1>
        <div class="ss-floral-divider">
          <span class="ss-divider-line"></span>
          <span class="ss-marigold-badge">🏵️</span>
          <span class="ss-divider-line"></span>
        </div>
      </header>
      <section class="ss-inner-frame"></section>
    `;

        const innerFrame = outerCard.querySelector(".ss-inner-frame");

        if (ssoAnchor) {
            // --- MYMODULES SSO MODE ---
            innerFrame.classList.add("ss-sso-mode");

            const ssoContainer = document.createElement("div");
            ssoContainer.className = "ss-form ss-sso-container";
            ssoContainer.innerHTML = `
        <p class="ss-sso-Caption">SIGN IN TO MYMODULES WITH</p>
        <a href="${ssoAnchor.href}" class="ss-login-btn ss-sso-btn">
          <svg class="ss-ms-icon" viewBox="0 0 23 23" fill="none">
            <path fill="#f25022" d="M1 1h10v10H1z"/>
            <path fill="#00a4ef" d="M1 12h10v10H1z"/>
            <path fill="#7fba00" d="M12 1h10v10H12z"/>
            <path fill="#ffb900" d="M12 12h10v10H12z"/>
          </svg>
          <span>Student myLife or Staff Email</span>
        </a>
        <div class="ss-footer-links">
          <span class="ss-flourish">❀❯❯</span>
          <a href="${forgotStudentUrl}" target="_blank" rel="noopener">Forgot Student Number?</a>
          <a href="${forgotPassUrl}" target="_blank" rel="noopener">Forgot Password?</a>
          <span class="ss-flourish">❮❮❀</span>
        </div>
      `;
            innerFrame.appendChild(ssoContainer);
        } else if (loginForm) {
            // --- CAS / MYADMIN USERNAME & PASSWORD MODE ---
            const userField = loginForm.querySelector('input[name="username"], input[type="text"]');
            const passField = loginForm.querySelector('input[name="password"], input[type="password"]');
            const submitBtn = loginForm.querySelector('button[type="submit"], input[type="submit"], #loginbtn');
            const hiddenInputs = Array.from(loginForm.querySelectorAll('input[type="hidden"]'));

            if (userField) userField.placeholder = "e.g., 12345678";
            if (passField) passField.placeholder = "••••••••";
            if (submitBtn) {
                if (submitBtn.tagName.toLowerCase() === "input") submitBtn.value = "LOGIN";
                else submitBtn.textContent = "LOGIN";
                submitBtn.className = "ss-login-btn";
            }

            loginForm.innerHTML = "";
            loginForm.className = "ss-form";
            hiddenInputs.forEach((input) => loginForm.appendChild(input));

            const userGroup = document.createElement("div");
            userGroup.className = "ss-field-group";
            userGroup.innerHTML = `<label class="ss-label">STUDENT NUMBER / USERNAME</label>`;
            const userWrap = document.createElement("div");
            userWrap.className = "ss-input-wrap";
            userWrap.innerHTML = `<svg class="ss-input-icon" viewBox="0 0 24 24"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/></svg>`;
            if (userField) userWrap.appendChild(userField);
            userGroup.appendChild(userWrap);
            loginForm.appendChild(userGroup);

            const passGroup = document.createElement("div");
            passGroup.className = "ss-field-group";
            passGroup.innerHTML = `<label class="ss-label">PASSWORD</label>`;
            const passWrap = document.createElement("div");
            passWrap.className = "ss-input-wrap";
            passWrap.innerHTML = `<svg class="ss-input-icon" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`;
            if (passField) passWrap.appendChild(passField);
            passGroup.appendChild(passWrap);
            loginForm.appendChild(passGroup);

            if (submitBtn) loginForm.appendChild(submitBtn);

            const footerLinks = document.createElement("div");
            footerLinks.className = "ss-footer-links";
            footerLinks.innerHTML = `
        <span class="ss-flourish">❀❯❯</span>
        <a href="${forgotStudentUrl}" target="_blank" rel="noopener">Forgot Student Number?</a>
        <a href="${forgotPassUrl}" target="_blank" rel="noopener">Forgot Password?</a>
        <span class="ss-flourish">❮❮❀</span>
      `;
            loginForm.appendChild(footerLinks);
            innerFrame.appendChild(loginForm);
        }

        document.body.innerHTML = "";
        document.body.appendChild(outerCard);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildCalaveraLogin, { once: true });
    } else {
        buildCalaveraLogin();
    }
})();