import { validateRecord } from './validators.js';

const STORAGE_KEY = 'student_finance_data_v1';
const SETTINGS_KEY = 'student_finance_settings_v1';

export function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

export function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {
      baseCurrency: 'USD',
      rates: { EUR: 0.92, GBP: 0.79 },
      monthlyCap: 500
    };
  } catch (err) {
    return { baseCurrency: 'USD', rates: { EUR: 0.92, GBP: 0.79 }, monthlyCap: 500 };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function validateAndImportJSON(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error('Invalid JSON format.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Imported data must be an array of records.');
  }

  const validRecords = parsed.filter(item => {
    const { isValid } = validateRecord(item);
    return isValid && item.id && item.createdAt;
  });

  if (validRecords.length === 0) {
    throw new Error('No valid records found in JSON file.');
  }

  return validRecords;
}