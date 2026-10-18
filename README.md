# Student Finance Tracker

A responsive, accessible vanilla JavaScript web application designed to help students track expenses, monitor monthly budgets, manage multiple currencies, and perform advanced regex-powered searches.

## Features
- **Dashboard & Statistics**: Real-time tracking of total records, total expenditure, top spending category, and 7-day spending trends.
- **Budget Caps & ARIA Alerts**: Set a custom monthly budget cap with dynamic visual status and `aria-live` screen-reader notifications when approaching or exceeding limits.
- **Multi-Currency Support**: Base currency selector with manual exchange rate configuration relative to USD.
- **Robust Regex Search & Highlighting**: Real-time search powered by a safe regex compiler (`try/catch`) with live `<mark>` text highlighting.
- **Data Persistence & Portability**: Automatic saving to browser `localStorage` with JSON export and import capabilities.
- **Inline Editing & Management**: Add, update, and delete financial records with dynamic timestamp tracking (`updatedAt`).

---

## Regex Catalog

The application utilizes regular expressions for form validation and live search filtering:

1. **Cents Present**: `/\.\d{2}\b/`
   * *Example*: Matches any amount containing exact two-decimal cent formatting (e.g., `12.50`).
2. **Beverage Keyword Search**: `/(coffee|tea)/i`
   * *Example*: Case-insensitive match for common beverage purchases in descriptions or categories.
3. **Date Format Validation**: `/^\d{4}-\d{2}-\d{2}$/`
   * *Example*: Ensures transaction dates strictly adhere to the `YYYY-MM-DD` standard format.
4. **Duplicate Words (Advanced)**: `/\b(\w+)\s+\1\b/`
   * *Example*: Uses back-references to detect accidental duplicate words typed consecutively in descriptions.

---

## Keyboard Map

The application is fully navigable using only keyboard controls:
- **`Tab` / `Shift + Tab`**: Move forward or backward through interactive elements, form fields, and buttons.
- **`Enter`**: Submit forms, trigger data exports/imports, or activate focused buttons.
- **`Escape`**: Dismiss active overlays or reset focus states.
- **`Skip-to-Content Link`**: Pressing `Tab` immediately upon loading reveals the hidden skip link, allowing keyboard users to jump straight past navigation headers to the main content.

---

## Accessibility (A11y) Notes

- **Semantic Landmarks**: Uses native HTML5 structural tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) to establish clear document hierarchy.
- **ARIA Live Regions**: Dynamic budget warnings utilize `aria-live="polite"` (or assertive when caps are exceeded) to announce threshold status changes to screen readers.
- **Focus States**: High-contrast visible focus rings are applied to all interactive controls.
- **Form Association**: All input fields are explicitly bound to descriptive `<label>` elements.

---

## How to Run Tests

1. Open the project folder in your code editor (e.g., VS Code).
2. Launch a local development server (such as the **Live Server** extension) or open `tests.html` directly in your browser.
3. Review the test results list on the page to verify that automated unit test assertions pass successfully.