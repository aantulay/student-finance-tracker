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