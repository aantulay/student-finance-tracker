import { validateRecord, REGEX_PATTERNS } from './validators.js';

const results = [];

function assert(description, condition) {
  results.push({ description, status: condition ? 'PASS' : 'FAIL' });
}

assert('Description with double space fails validation', !REGEX_PATTERNS.description.test('Lunch  cafeteria'));
assert('Duplicate word detection catches repeated words', REGEX_PATTERNS.duplicateWords.test('coffee coffee'));
assert('Amount 12.50 is valid', REGEX_PATTERNS.amount.test('12.50'));
assert('Amount 12.501 is invalid', !REGEX_PATTERNS.amount.test('12.501'));
assert('Date 2026-09-25 is valid', REGEX_PATTERNS.date.test('2026-09-25'));
assert('Date 25-09-2026 is invalid', !REGEX_PATTERNS.date.test('25-09-2026'));

const container = document.getElementById('test-results');
results.forEach(res => {
  const p = document.createElement('p');
  p.className = res.status.toLowerCase();
  p.textContent = `[${res.status}] ${res.description}`;
  container.appendChild(p);
});