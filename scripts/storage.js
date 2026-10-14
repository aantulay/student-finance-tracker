const STORAGE_KEY_RECORDS = 'student_finance_records';
const STORAGE_KEY_SETTINGS = 'student_finance_settings';

export function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
}

export function loadRecords() {
  const data = localStorage.getItem(STORAGE_KEY_RECORDS);
  return data ? JSON.parse(data) : [];
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

export function loadSettings() {
  const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
  return data ? JSON.parse(data) : { 
    monthlyCap: 500, 
    currency: 'USD',
    rates: {
      USD: 1.0,
      EUR: 0.92,
      KES: 130.0
    }
  };
}

export function validateAndImportJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    const rawRecords = Array.isArray(parsed) ? parsed : parsed.records;
    if (!Array.isArray(rawRecords)) {
      throw new Error('Imported data must contain an array of records.');
    }
    return {
      records: rawRecords,
      settings: parsed.settings || null
    };
  } catch (e) {
    throw new Error('Invalid JSON file format: ' + e.message);
  }
}