/** חוט · gematria — מספר⇒אותיות. חוזה: gematria.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebrew.ts */
export function gem(n, U, T, H, T2) {
  n = Math.floor(+n);
  if (!Number.isFinite(n) || n <= 0) return '';
  let s = H[Math.floor(n / 100)] || '';
  const r = n % 100;
  if (r === 15) s += T2.k1;
  else if (r === 16) s += T2.k2;
  else s += T[Math.floor(r / 10)] + U[r % 10];
  return s.length === 1 ? s + T2.k3 : s.slice(0, -1) + T2.k4 + s.slice(-1);
}
