# Vanilla JS Architecture & Modal Component Analysis

## Executive Summary
This document details the architectural patterns, component structures, and CSS/DOM specifications for `getplaced.ai`, focused on establishing a clean, centered Vanilla JS error modal for server-side responses (such as 403 Forbidden prerequisite locks during `/create-order`).

---

## 1. Overall Project Structure & Architectural Patterns

### Project Layout
`getplaced.ai` is a static, zero-framework web application served directly as HTML, CSS, and Vanilla JavaScript.

- **Primary Entry Points**:
  - `index.html`: Marketing site, track catalog, payment modal (`#pay-modal`), login modal (`#login-modal`), and Razorpay checkout scripts.
  - `dashboard.html`: Student dashboard, active skill progress, settings modal (`#settings-overlay`), milestone popup (`#milestone-overlay`), toast alerts (`#toast`), and `buyTrack(slug, name)` execution.
  - `projects.html` / `projects.css` / `projects.js`: Project workspace page.
  - `dsa.html`, `portfolio.html`, `offline.html`: Supplementary pages.
  - `sw.js`: Service worker for PWA capabilities.

### Architectural Principles
- **No Heavy Frameworks**: Pure HTML5, CSS3, and ES6+ Vanilla JS. No React, Vue, Svelte, Bootstrap, or Tailwind.
- **Styling Architecture**:
  - Built on CSS custom properties (`:root` variables defined in page stylesheets).
  - Common color system: `--bg-card` (`#0c0f1d`), `--card` (`#0e111f`), `--line` / `--line-2`, `--amber` (`#f59e0b`), `--amber-dim`, `--accent`, `--muted`, `--text`.
  - Layering and animations via CSS transitions (`transition: transform .3s var(--ease)`).
- **DOM & State Control**:
  - Helper functions: `$` (`document.querySelector`), `$$` (`document.querySelectorAll`).
  - Overlay toggling via class manipulation (`.open` or `.show`).
  - Event driven: Native `addEventListener` for click, submit, keydown events.

---

## 2. Existing Popup & Overlay Architecture

### Current Modal Implementations
1. **`#settings-overlay` in `dashboard.html`**:
   - Fixed overlay with backdrop blur (`background: rgba(5,5,8,0.82); backdrop-filter: blur(8px)`).
   - Centered card `.settings-card` (`max-width: 480px`).
   - Toggled via `document.getElementById("settings-overlay").classList.add("show")` and `.remove("show")`.
2. **`#milestone-overlay` in `dashboard.html`**:
   - Celebratory popup with emoji and action button.
   - Styled with radial gradient background and box shadow.
3. **`#pay-modal` & `#login-modal` in `index.html`**:
   - Multi-state modal popups (`z-index: 12000`).
   - Has built-in internal state views (`#pay-locked`, `#pay-error`, `#pay-success`).

### Current Toast Mechanism in `dashboard.html`
- `#toast` element (`position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(120%)`).
- Triggered by `toast(msg, type)`.
- When `buyTrack` in `dashboard.html` fails on `/create-order`, it currently executes:
  `toast("Failed to initiate checkout", "err");`
- **Gap Identified**: The toast notification is brief, easily missed, and cannot display rich server error messages (like prerequisite track locks). A dedicated centered modal is required.

---

## 3. Recommended Modal DOM & CSS Specification

### Proposed DOM Structure (`#error-modal`)
```html
<!-- Server Error Modal for Buy Track / Prerequisites -->
<div id="error-modal" class="modal-backdrop" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="error-modal-title">
  <div class="error-card">
    <button type="button" class="error-card-close" id="error-modal-close" aria-label="Close modal">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
    <div class="error-card-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    </div>
    <h3 id="error-modal-title">Prerequisite Required</h3>
    <p id="error-modal-message">Please complete the required prerequisite track before enrolling.</p>
    <button type="button" class="btn btn-primary" id="error-modal-dismiss">Dismiss</button>
  </div>
</div>
```

### CSS Styling Specs (Compatible with `dashboard.html` & `index.html`)
```css
/* Modal Overlay Container */
#error-modal {
  position: fixed;
  inset: 0;
  z-index: 12000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(4, 6, 11, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

#error-modal.show {
  display: flex;
  animation: modalFadeIn 0.25s ease-out;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

/* Modal Card */
.error-card {
  position: relative;
  max-width: 440px;
  width: 100%;
  padding: 32px 28px;
  border: 1px solid var(--line-2, #232738);
  border-radius: 24px;
  background: var(--bg-card, #0c0f1d);
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
  text-align: center;
}

/* Close Button (Top Right) */
.error-card-close {
  position: absolute;
  top: 18px;
  right: 18px;
  background: var(--bg, #080a12);
  border: 1px solid var(--line-2, #232738);
  border-radius: 10px;
  width: 36px;
  height: 36px;
  color: var(--text, #f3f4f6);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.error-card-close:hover {
  border-color: var(--amber, #f59e0b);
  color: var(--amber, #f59e0b);
}

/* Lock/Error Graphic Icon */
.error-card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.14);
  color: #ef4444;
  display: grid;
  place-items: center;
  margin: 0 auto 20px;
}

/* Title & Description */
.error-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--text, #ffffff);
  margin-bottom: 10px;
}

.error-card p {
  font-size: 14.5px;
  color: var(--muted, #9ca3af);
  line-height: 1.55;
  margin-bottom: 24px;
}

/* Dismiss Button */
.error-card .btn {
  width: 100%;
  justify-content: center;
  font-size: 15px;
  padding: 13px 20px;
  border-radius: 12px;
}
```

---

## 4. Vanilla JS Event Handling & Helper Functions

```javascript
/**
 * Display clean centered Vanilla JS error modal
 * @param {string} title Header text for modal
 * @param {string} message Specific error returned from server
 */
function showErrorModal(title, message) {
  const modal = document.getElementById("error-modal");
  if (!modal) return;
  
  const titleEl = document.getElementById("error-modal-title");
  const msgEl = document.getElementById("error-modal-message");
  
  if (titleEl) titleEl.textContent = title || "Unable to proceed";
  if (msgEl) msgEl.textContent = message || "An unexpected error occurred. Please try again.";
  
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

/**
 * Dismiss the error modal
 */
function hideErrorModal() {
  const modal = document.getElementById("error-modal");
  if (!modal) return;
  
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

// Bind modal closing handlers
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("error-modal-close")?.addEventListener("click", hideErrorModal);
  document.getElementById("error-modal-dismiss")?.addEventListener("click", hideErrorModal);
  
  // Close when clicking outside card (on overlay backdrop)
  document.getElementById("error-modal")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("error-modal")) hideErrorModal();
  });

  // Close on Escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideErrorModal();
  });
});
```

---

## 5. Architectural Compliance Verification (R2)
- Zero external UI libraries required.
- Standard cross-browser compatibility (Chrome, Edge, Firefox, Safari, Mobile).
- Fully responsive on viewports from 320px up to 4K displays.
- High visual contrast and full keyboard accessibility (`aria-*` attributes + `Escape` key handler).
