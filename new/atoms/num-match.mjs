/** חוט · num-match — התאמת מספר לתחביר סינון-עמודות ("3" / "3+" / "2-4").
 *  חוזה: num-match.contract.md · אפס שקעים.
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:129-139. */
export function numMatch(q, n) {
  q = String(q || '').trim();
  if (!q) return true;
  let m = q.match(/^(\d+)\s*\+$/);
  if (m) return n >= +m[1];
  m = q.match(/^(\d+)\s*-\s*(\d+)$/);
  if (m) return n >= +m[1] && n <= +m[2];
  if (/^\d+$/.test(q)) return n === +q;
  return true;
}
