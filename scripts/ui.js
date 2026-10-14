import { compileRegex, highlight } from './search.js';

export function renderDashboard(state) {
  const stats = state.getDashboardStats();
  const currentRate = state.rates[state.currency] || 1.0;

  document.getElementById('stat-total-records').textContent = stats.totalRecords;
  document.getElementById('stat-total-sum').textContent = state.formatAmount(stats.totalSpent);
  document.getElementById('stat-top-category').textContent = stats.topCategory;
  document.getElementById('stat-7day-sum').textContent = state.formatAmount(stats.last7DaysSum);

  const convertedCap = state.monthlyCap * currentRate;
  const convertedSpent = stats.totalSpent * currentRate;

  const capStatusDiv = document.getElementById('aria-cap-status');
  if (convertedSpent > convertedCap) {
    capStatusDiv.textContent = `Warning: You have exceeded your monthly cap of ${state.currency} ${convertedCap.toFixed(2)}!`;
    capStatusDiv.style.color = 'red';
  } else {
    const remaining = convertedCap - convertedSpent;
    capStatusDiv.textContent = `Budget remaining: ${state.currency} ${remaining.toFixed(2)}`;
    capStatusDiv.style.color = 'green';
  }
}

function highlightText(text, regex) {
  if (!regex || !text) return text;
  const stringText = String(text);
  try{
    const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
    const globalRegex = new RegExp(regex.source, flags);
    return stringText.replace(globalRegex, match => `<mark>${match}</mark>`);
  } catch (e) {
    return stringText;
  }
}

export function renderRecords(state) {
  const regex = state.searchQuery.trim() ? compileRegex(state.searchQuery) : null;
  const records = state.getFilteredAndSortedRecords(compileRegex);
  const tbody = document.getElementById('records-table-body');
  const cardsContainer = document.getElementById('records-cards');

  tbody.innerHTML = '';
  cardsContainer.innerHTML = '';

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No records found.</td></tr>`;
    cardsContainer.innerHTML = `<p style="text-align: center;">No records found.</p>`;
    return;
  }

  records.forEach(r => {
    const formattedAmount = state.formatAmount(r.amount);
    const highlightedDate = highlightText(r.date, regex);
    const highlightedDesc = highlightText(r.description, regex);
    const highlightedCat = highlightText(r.category, regex);
    const highlightedAmount = highlightText(formattedAmount, regex);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${highlightedDate}</td>
      <td>${highlightedDesc}</td>
      <td>${highlightedCat}</td>
      <td>${highlightedAmount}</td>
      <td><button class="btn-delete" data-id="${r.id}">Delete</button></td>
    `;
    tbody.appendChild(tr);

    const card = document.createElement('div');
    card.className = 'record-card';
    card.innerHTML = `
      <p><strong>Date:</strong> ${highlightedDate}</p>
      <p><strong>Description:</strong> ${highlightedDesc}</p>
      <p><strong>Category:</strong> ${highlightedCat}</p>
      <p><strong>Amount:</strong> ${highlightedAmount}</p>
      <button class="btn-delete" data-id="${r.id}">Delete</button>
    `;
    cardsContainer.appendChild(card);
  });
}