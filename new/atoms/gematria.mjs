/** חוט · gematria — מספר⇒אותיות. חוזה: gematria.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebrew.ts */
export function gem(n, U, T, H) {
  n = Math.floor(+n);
  if (!Number.isFinite(n) || n <= 0) return '';
  let s = H[Math.floor(n / 100)] || '';
  const r = n % 100;
  if (r === 15) s += 'טו';
  else if (r === 16) s += 'טז';
  else s += T[Math.floor(r / 10)] + U[r % 10];
  return s.length === 1 ? s + '׳' : s.slice(0, -1) + '״' + s.slice(-1);
}
