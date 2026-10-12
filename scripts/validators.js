export const REGEX_PATTERNS = {
  description: /^\S+(?:\s\S+)*$/,
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWords: /\b(\w+)\s+\1\b/i
};

export function validateRecord(record) {
  const errors = {};

  if (!REGEX_PATTERNS.description.test(record.description || '')) {
    errors.description = 'Description cannot have leading/trailing spaces or multiple spaces.';
  } else if (REGEX_PATTERNS.duplicateWords.test(record.description)) {
    errors.description = 'Description contains duplicate words (e.g., "coffee coffee").';
  }

  if (!REGEX_PATTERNS.amount.test(String(record.amount))) {
    errors.amount = 'Amount must be a valid positive number with up to 2 decimals.';
  }

  if (!REGEX_PATTERNS.date.test(record.date || '')) {
    errors.date = 'Date must follow YYYY-MM-DD format.';
  }

  if (!REGEX_PATTERNS.category.test(record.category || '')) {
    errors.category = 'Category must contain letters, spaces, or hyphens only.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}