import { loadRecords, saveRecords, loadSettings, saveSettings } from './storage.js';

export class AppState {
  constructor() {
    this.records = loadRecords() || [];
    this.settings = loadSettings();
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.sortBy = 'date';
    this.sortOrder = 'desc';
  }

  addRecord(record) {
    const timestamp = new Date().toISOString();
    const newRecord = {
      ...record,
      id: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.records.push(newRecord);
    saveRecords(this.records);
    return newRecord;
  }

  updateRecord(id, updatedFields) {
    const index = this.records.findIndex(r => r.id === id);
    if (index !== -1) {
      this.records[index] = {
        ...this.records[index],
        ...updatedFields,
        updatedAt: new Date().toISOString()
      };
      saveRecords(this.records);
    }
  }

  deleteRecord(id) {
    this.records = this.records.filter(r => r.id !== id);
    saveRecords(this.records);
  }

  setRecords(records) {
    this.records = records;
    saveRecords(this.records);
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    saveSettings(this.settings);
  }

  getFilteredAndSortedRecords() {
    let result = [...this.records];

    if (this.selectedCategory !== 'All') {
      result = result.filter(r => r.category === this.selectedCategory);
    }

    result.sort((a, b) => {
      let valA = a[this.sortBy];
      let valB = b[this.sortBy];

      if (this.sortBy === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }

  getStats() {
    const totalRecords = this.records.length;
    const totalSum = this.records.reduce((acc, r) => acc + Number(r.amount), 0);

    const categoryTotals = {};
    this.records.forEach(r => {
      categoryTotals[r.category] = (categoryTotals[r.category] || 0) + Number(r.amount);
    });

    let topCategory = 'N/A';
    let maxCatVal = 0;
    for (const [cat, sum] of Object.entries(categoryTotals)) {
      if (sum > maxCatVal) {
        maxCatVal = sum;
        topCategory = cat;
      }
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7DaysSum = this.records
      .filter(r => new Date(r.date) >= sevenDaysAgo)
      .reduce((acc, r) => acc + Number(r.amount), 0);

    return { totalRecords, totalSum, topCategory, last7DaysSum };
  }
}