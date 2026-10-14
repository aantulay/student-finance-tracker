import { loadRecords, saveRecords, loadSettings, saveSettings } from './storage.js';

export class AppState {
  constructor() {
    this.records = loadRecords();
    const settings = loadSettings();
    this.monthlyCap = settings.monthlyCap;
    this.currency = settings.currency;
    this.rates = settings.rates || { USD: 1.0, EUR: 0.92, KES: 130.0 };
    this.searchQuery = '';
    this.sortBy = 'date';
  }

  setRecords(newRecords) {
    this.records = newRecords;
    saveRecords(this.records);
  }

  addRecord(record) {
    const newRecord = {
      id: 'rec_' + Date.now(),
      ...record,
      createdAt: new Date().toISOString()
    };
    this.records.push(newRecord);
    saveRecords(this.records);
  }

  deleteRecord(id) {
    this.records = this.records.filter(r => r.id !== id);
    saveRecords(this.records);
  }

  setMonthlyCap(cap) {
    this.monthlyCap = cap;
    this.persistSettings();
  }

  setCurrency(curr) {
    this.currency = curr;
    this.persistSettings();
  }

  setRate(currencyCode, rate) {
    this.rates[currencyCode] = rate;
    this.persistSettings();
  }

  persistSettings() {
    saveSettings({
      monthlyCap: this.monthlyCap,
      currency: this.currency,
      rates: this.rates
    });
  }

  // Convert any base amount to the currently selected display currency
  formatAmount(amount) {
    const num = parseFloat(amount) || 0;
    const rate = this.rates[this.currency] || 1.0;
    const converted = num * rate;
    return `${this.currency} ${converted.toFixed(2)}`;
  }

  getFilteredAndSortedRecords(compileRegex) {
    let result = [...this.records];

    if (this.searchQuery.trim() !== '') {
      const regex = compileRegex(this.searchQuery);
      if (regex) {
        result = result.filter(r => 
          regex.test(r.description) || 
          regex.test(r.category) || 
          regex.test(r.amount) || 
          regex.test(r.date)
        );
      }
    }

    result.sort((a, b) => {
      if (this.sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (this.sortBy === 'amount') {
        return parseFloat(b.amount) - parseFloat(a.amount);
      } else if (this.sortBy === 'description') {
        return a.description.localeCompare(b.description);
      }
      return 0;
    });

    return result;
  }

  getDashboardStats() {
    const totalRecords = this.records.length;
    const totalSpent = this.records.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
    
    const categoryMap = {};
    this.records.forEach(r => {
      const cat = r.category || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + parseFloat(r.amount || 0);
    });

    let topCategory = 'N/A';
    let maxAmount = 0;
    for (const [cat, amt] of Object.entries(categoryMap)) {
      if (amt > maxAmount) {
        maxAmount = amt;
        topCategory = cat;
      }
    }

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const last7DaysSum = this.records
      .filter(r => new Date(r.date) >= sevenDaysAgo)
      .reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);

    return {
      totalRecords,
      totalSpent,
      topCategory,
      last7DaysSum
    };
  }
}