# Security Policy

## EcoWise AI Security & Data Policy

EcoWise AI is a premium, client-side-only sustainability platform. Because it operates entirely within the user's browser, data security is built on a "local-first" privacy paradigm. This policy outlines how user data is processed, stored, and protected.

---

## 1. Security Architecture & Principles

EcoWise AI implements a zero-trust model towards external data, processing everything locally to avoid any leak of personal sustainability metrics:

- **Local-First Processing**: 100% of carbon footprint calculations, sustainability scoring, habit logging, and challenge tracking occur directly in the user's browser.
- **No Remote Servers**: The application does not deploy backend database storage or remote analytics engines. No personal identifiable information (PII) or usage behavior is transmitted to third-party endpoints.
- **No Credentials**: There are no login credentials, passwords, or session tokens stored on any server. Identity management is completely avoided by design.
- **No API Keys**: There are no API keys or secrets embedded within the built client bundles, preventing reverse-engineering or secret leakage risks.

---

## 2. LocalStorage Security & Hardening

All application state is persisted inside browser `localStorage`. We treat `localStorage` as a potentially untrusted data source and have hardened it as follows:

- **Defensive De-serialization**: All reads from `localStorage` are wrapped in strict `try-catch` blocks.
- **Schema Validation & Sanitization**: Data retrieved from storage is defensively validated using `src/utils/security.ts` before being incorporated into the active React context. If any properties are missing, invalid, or corrupted, default safe values are substituted.
- **Range Clamping**: Numerical values retrieved from storage are clamped to safe maximum and minimum values to prevent calculation overflows, divisions by zero, or layout distortion attacks.

---

## 3. Input Sanitization & XSS Prevention

To prevent Cross-Site Scripting (XSS) when rendering user-entered text (e.g. customized profile names, custom habit descriptions, or goal comments):

- **HTML Entity Encoding**: The utility helper `sanitizeText()` automatically escapes vulnerable HTML characters (`<`, `>`, `&`, `"`, `'`, `/`).
- **Length Limits**: Text fields are strictly truncated to safe lengths (e.g. max 100 characters for user profile fields, 200 characters for habit logs) to mitigate buffer allocation or DOM strain issues.

---

## 4. Resilience & Graceful Recovery

To prevent rendering-level runtime exceptions from crashing the application:

- **React Error Boundary**: The application routing system is wrapped inside a custom React `ErrorBoundary` component.
- **Crash Recovery**: If an unhandled rendering error occurs, the boundary catches it and displays a clean, user-friendly recovery UI with options to:
  1. Reload the current view.
  2. Perform a total state reset (which clears `localStorage` and restores all defaults).

---

## 5. Security Assumptions

- **Physical/Device Security**: Since data resides entirely inside the local browser container, the security of user information relies on the security of the host operating system and the web browser. Users should keep their systems updated and secure their user accounts.
- **XSS via Browser Extensions**: Malicious or compromised browser extensions with write access to the DOM or localStorage can access the saved state. We recommend using reputable, vetted browser extensions.
