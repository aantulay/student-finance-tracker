export function compileRegex(pattern, flags = 'i') {
  if (!pattern) return null;
  try {
    return new RegExp(pattern, flags);
  } catch (error) {
    return null;
  }
}

export function highlight(text, regex) {
  if (!regex || !text) return String(text);
  const str = String(text);
  return str.replace(regex, (match) => `<mark>${match}</mark>`);
}