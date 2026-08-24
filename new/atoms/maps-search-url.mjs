/** חוט · maps-search-url — קישור-חיפוש Google Maps לכתובת. חוזה: maps-search-url.contract.md */
/** ניקוי עצירה: '|' ליטרלי = מפריד-העצירות של Google (אין escaping ב-api=1) ⇒ מוחלף ברווח. */
function cleanStop(s) {
  return (s || '').replace(/\|/g, ' ').trim();
}
export function mapsSearchUrl(address, city = '') {
  const q = [address, city].map(cleanStop).filter(Boolean).join(', ');
  if (!q) return null;
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
}
