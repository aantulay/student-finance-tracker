# Student Finance Tracker

A lightweight, accessible, and fully modular vanilla JavaScript application designed to help students track expenses, manage monthly budgets, configure manual exchange rates, and analyze financial records in real time.

---

## Project Requirements & Specifications

This application is built to fulfill specific academic project criteria for financial trackers, featuring a base currency alongside two secondary currencies, with fully manual exchange rate management directly within the settings panel without external API dependencies.

---

## Core Features

* **Modular ES6 Architecture**: The codebase is organized into single-responsibility modules to maintain clean, professional, and accessible code across state management, data persistence, UI rendering, validation, and search operations.
* **Multi-Currency Support & Manual Rates**: Implements a base currency (USD) and two secondary currencies (EUR and KES), allowing users to define and modify manual exchange rates directly in the settings panel[cite: 1].
* **Dynamic Monthly Budget Cap**: Set and adjust spending limits in any active display currency. The application handles conversions automatically behind the scenes against the base currency and issues real-time accessibility warnings when limits are exceeded.
* **Live Regex Search**: Filter financial records instantly using regular expressions with automatic visual text highlighting via semantic HTML elements.
* **Persistent Local Storage**: Automatically saves transaction records, user preferences, and manual exchange rates to `localStorage` so data remains intact across browser sessions.
* **Robust JSON Export and Import**: Securely back up your financial records and settings to a JSON file or import external data complete with strict validation checks.
* **Accessibility (a11y)**: Built with semantic HTML land-marking, ARIA live regions for budget status alerts (`#aria-cap-status`), skip links, and full keyboard navigation support.
* **Responsive Design**: Adapts smoothly across screen sizes using a dynamic desktop data table and a mobile-friendly card layout.
* **Automated Unit Testing**: Includes a dedicated unit test runner suite (`tests.html`) verifying regex patterns and validation constraints.

---

## Project Structure

```text
student-finance-tracker/
│
├── index.html            # Main application dashboard and user interface
├── tests.html            # Unit test runner for regex and validation assertions
├── seed.json             # Initial dataset of sample transactions
│
├── styles/
│   └── main.css          # Core styles, responsive layouts, form controls, and settings panel styles
│
└── scripts/
    ├── main.js           # Controller managing event listeners, DOM updates, and initialization
    ├── state.js          # Business logic, state management, sorting, filtering, and currency conversion
    ├── storage.js        # Local storage persistence and JSON import validation with schema checks
    ├── ui.js             # DOM rendering, currency formatting, and accessibility alerts
    ├── search.js         # Safe regex compilation helper
    ├── validators.js     # Form and input validation rules
    └── tests.js          # Assertion logic for the test runner suite


---

## Getting Started

Follow these steps to set up and run the application locally:

1. **Clone or Download**: Download or clone this repository to your local machine.
2. **Open the Application**: 
   * Open `index.html` directly in any modern web browser.
   * Alternatively, run the project using a local development server such as the Live Server extension in VS Code to ensure smooth ES6 module loading.
3. **Run Unit Tests**: 
   * Open `tests.html` in your browser to view automated assertion results verifying the validation rules and regex logic.

---

## Usage Guide

* **Adding Transactions**: 
  * Navigate to the Add Transaction form section.
  * Enter a valid description, monetary amount, date, and category. Click submit to record the entry. Validation errors appear inline if input requirements are not met.
* **Managing Settings and Currencies**: 
  * Go to the Settings section to update your monthly budget cap or switch your display currency (USD, EUR, or KES).
  * Modify the manual exchange rate input fields relative to the base currency to see totals, table entries, and budget warnings scale and update instantly.
* **Searching Records**: 
  * Type search terms or regular expression patterns into the live search input bar to filter your transaction list dynamically on the fly.
* **Data Management**: 
  * Click **Export JSON** to download a comprehensive backup file containing your current records, settings, and manual exchange rates.
  * Click **Import JSON** to upload and validate a backup file from your device, ensuring data integrity through built-in schema checks.