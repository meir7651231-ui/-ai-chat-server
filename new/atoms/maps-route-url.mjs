/** חוט · maps-route-url — מסלול רב-עצירות Google Maps. חוזה: maps-route-url.contract.md */
/** ניקוי עצירה: '|' ליטרלי = מפריד-העצירות של Google (אין escaping ב-api=1) ⇒ מוחלף ברווח. */
function cleanStop(s) {
  return (s || '').replace(/\|/g, ' ').trim();
}
export function mapsRouteUrl(stops, T) {
  const clean = stops.map(cleanStop).filter(Boolean);
  if (clean.length === 0) return null;
  if (clean.length === 1) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(clean[0]);
  }
  const destination = clean[clean.length - 1];
  const waypoints = clean.slice(0, -1);
  return (
    'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' +
    encodeURIComponent(destination) +
    T.k1 +
    waypoints.map(encodeURIComponent).join('%7C')
  );
}
