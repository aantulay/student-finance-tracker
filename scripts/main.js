import { AppState } from './state.js';
import { validateRecord } from './validators.js';
import { validateAndImportJSON } from './storage.js';
import { renderDashboard, renderRecords } from './ui.js';

const state = new AppState();

function updateSettingsInputs() {
  const currentRate = state.rates[state.currency] || 1.0;
  document.getElementById('monthly-cap-input').value = (state.monthlyCap * currentRate).toFixed(2);
  document.getElementById('currency-select').value = state.currency;
  document.getElementById('rate-eur').value = state.rates.EUR;
  document.getElementById('rate-kes').value = state.rates.KES;
}

async function init() {
  if (state.records.length === 0) {
    try {
      const res = await fetch('seed.json');
      const seedData = await res.json();
      state.setRecords(seedData);
    } catch (e) {
      console.error('Failed to load seed dataset', e);
    }
  }

  updateSettingsInputs();
  refresh();
}

function refresh() {
  renderDashboard(state);
  renderRecords(state);
}

document.getElementById('regex-search').addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  renderRecords(state);
});

document.getElementById('sort-by').addEventListener('change', (e) => {
  state.sortBy = e.target.value;
  renderRecords(state);
});

document.getElementById('transaction-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const record = {
    description: document.getElementById('input-desc').value,
    amount: document.getElementById('input-amount').value,
    date: document.getElementById('input-date').value,
    category: document.getElementById('input-category').value
  };

  const { isValid, errors } = validateRecord(record);
  document.getElementById('desc-error').textContent = errors.description || '';
  document.getElementById('amount-error').textContent = errors.amount || '';
  document.getElementById('date-error').textContent = errors.date || '';
  document.getElementById('cat-error').textContent = errors.category || '';

  if (isValid) {
    state.addRecord(record);
    e.target.reset();
    refresh();
  }
});

document.getElementById('monthly-cap-input').addEventListener('input', (e) => {
  const inputVal = parseFloat(e.target.value);
  if (!isNaN(inputVal)) {
    const currentRate = state.rates[state.currency] || 1.0;
    const baseCap = inputVal / currentRate;
    state.setMonthlyCap(baseCap);
    renderDashboard(state);
  }
});

document.getElementById('currency-select').addEventListener('change', (e) => {
  state.setCurrency(e.target.value);
  updateSettingsInputs();
  refresh();
});

document.getElementById('rate-eur').addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  if (!isNaN(val)) {
    state.setRate('EUR', val);
    updateSettingsInputs();
    refresh();
  }
});

document.getElementById('rate-kes').addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  if (!isNaN(val)) {
    state.setRate('KES', val);
    updateSettingsInputs();
    refresh();
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    const id = e.target.dataset.id;
    state.deleteRecord(id);
    refresh();
  }
});

document.getElementById('export-json').addEventListener('click', () => {
  const dataToExport = {
    settings: { 
      monthlyCap: state.monthlyCap, 
      currency: state.currency,
      rates: state.rates
    },
    records: state.records
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "student_finance_tracker_backup.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

document.getElementById('trigger-import').addEventListener('click', () => {
  document.getElementById('import-json-file').click();
});

document.getElementById('import-json-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedData = validateAndImportJSON(event.target.result);
      const recordsList = importedData.records;
      
      if (importedData.settings) {
        if (importedData.settings.monthlyCap) state.setMonthlyCap(importedData.settings.monthlyCap);
        if (importedData.settings.currency) state.setCurrency(importedData.settings.currency);
        if (importedData.settings.rates) {
          state.rates = importedData.settings.rates;
          state.persistSettings();
        }
        updateSettingsInputs();
      }
      
      state.setRecords(recordsList || []);
      refresh();
      alert('Data imported successfully!');
    } catch (err) {
      alert('Import Error: ' + err.message);
    }
  };
  reader.readAsText(file);
});

init();