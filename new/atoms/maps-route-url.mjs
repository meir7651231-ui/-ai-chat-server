/** חוט · maps-route-url — מסלול רב-עצירות Google Maps. חוזה: maps-route-url.contract.md */
/** ניקוי עצירה: '|' ליטרלי = מפריד-העצירות של Google (אין escaping ב-api=1) ⇒ מוחלף ברווח. */
export function mapsRouteUrl(stops, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  function cleanStop(s) {
    return (s || '').replace(/\|/g, ' ').trim();
  }

  const clean = stops.map(cleanStop).filter(Boolean);
  if (clean.length === 0) return null;
  if (clean.length === 1) {
    return T.k2 + encodeURIComponent(clean[0]);
  }
  const destination = clean[clean.length - 1];
  const waypoints = clean.slice(0, -1);
  return (
    T.k3 +
    encodeURIComponent(destination) +
    T.k1 +
    waypoints.map(encodeURIComponent).join('%7C')
  );
}
