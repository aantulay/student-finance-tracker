export function compileRegex(query) {
  if (!query || typeof query !== 'string') {
    return new RegExp('', 'i');
  }
  try{
    return new RegExp(query, 'i');
  } catch (e) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped, 'i');
  }
}

export function highlight(text, re) {
  if (!re) return text;
  return String(text).replace(re, m => `<mark>${m}</mark>`);
}