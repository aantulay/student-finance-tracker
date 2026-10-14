import { compileRegex, highlight } from './search.js';

export function renderDashboard(state) {
  const stats = state.getStats();
  const cap = state.settings.monthlyCap;
  const currency = state.settings.baseCurrency;

  document.getElementById('stat-total-records').textContent = stats.totalRecords;
  document.getElementById('stat-total-sum').textContent = `${currency} ${stats.totalSum.toFixed(2)}`;
  document.getElementById('stat-top-category').textContent = stats.topCategory;
  document.getElementById('stat-7day-sum').textContent = `${currency} ${stats.last7DaysSum.toFixed(2)}`;

  const capLiveRegion = document.getElementById('aria-cap-status');
  const remaining = cap - stats.totalSum;

  if (stats.totalSum > cap) {
    capLiveRegion.setAttribute('aria-live', 'assertive');
    capLiveRegion.className = 'status-alert overage';
    capLiveRegion.textContent = `Budget Alert: Exceeded budget cap by ${currency} ${Math.abs(remaining).toFixed(2)}`;
  } else {
    capLiveRegion.setAttribute('aria-live', 'polite');
    capLiveRegion.className = 'status-alert under';
    capLiveRegion.textContent = `Budget Status: ${currency} ${remaining.toFixed(2)} remaining under monthly cap.`;
  }
}

export function renderRecords(state) {
  const tableBody = document.getElementById('records-table-body');
  const cardContainer = document.getElementById('records-cards');
  const searchRegex = compileRegex(state.searchQuery, 'i');
  const records = state.getFilteredAndSortedRecords();

  tableBody.innerHTML = '';
  cardContainer.innerHTML = '';

  records.forEach(record => {
    const isMatched = searchRegex ? searchRegex.test(`${record.description} ${record.category}`) : true;
    if (searchRegex && !isMatched) return;

    const descHl = highlight(record.description, searchRegex);
    const catHl = highlight(record.category, searchRegex);

    const tr = document.createElement('tr');
    tr.dataset.id = record.id;
    tr.innerHTML = `
      <td>${record.date}</td>
      <td class="cell-desc">${descHl}</td>
      <td class="cell-cat">${catHl}</td>
      <td>${state.settings.baseCurrency} ${Number(record.amount).toFixed(2)}</td>
      <td>
        <button class="btn-delete" data-id="${record.id}" aria-label="Delete record ${record.description}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);

    const card = document.createElement('div');
    card.className = 'record-card';
    card.dataset.id = record.id;
    card.innerHTML = `
      <div class="card-header">
        <strong>${descHl}</strong>
        <span>${state.settings.baseCurrency} ${Number(record.amount).toFixed(2)}</span>
      </div>
      <div class="card-body">
        <p>Category: ${catHl}</p>
        <p>Date: ${record.date}</p>
      </div>
      <div class="card-actions">
        <button class="btn-delete" data-id="${record.id}" aria-label="Delete record ${record.description}">Delete</button>
      </div>
    `;
    cardContainer.appendChild(card);
  });
}