/** חוט · col-ref-to-index — הפניית-תא xlsx לאינדקס-עמודה 0-בסיס ("AB4" → 27).
 *  חוזה: col-ref-to-index.contract.md
 *  חולץ כלשונו מ-maor/src/lib/xlsx.ts:26-32. */
export function colRefToIndex(ref) {
  const m = /^([A-Z]+)/.exec(ref);
  if (!m) return 0;
  let n = 0;
  for (const ch of m[1]) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}
