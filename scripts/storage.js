import { validateRecord } from './validators.js';

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
  return data ? JSON.parse(data) : { monthlyCap: 500, currency: 'USD' };
}

export function validateAndImportJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    const rawRecords = Array.isArray(parsed) ? parsed : parsed.records;

    if (!Array.isArray(rawRecords)) {
      throw new Error('Imported data must contain an array of records.');
    }

    const validRecords = [];
    for (const item of rawRecords) {
      const { isValid } = validateRecord(item);
      if (isValid) {
        validRecords.push({
          id: item.id || 'rec_' + Date.now() + Math.random(),
          description: item.description,
          amount: item.amount,
          date: item.date,
          category: item.category,
          createdAt: item.createdAt || new Date().toISOString()
        });
      }
    }

    return {
      records: validRecords,
      settings: parsed.settings || null
    };
  } catch (e) {
    throw new Error('Invalid JSON file format: ' + e.message);
  }
}