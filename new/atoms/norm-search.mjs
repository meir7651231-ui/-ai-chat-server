/** חוט · norm-search — נרמול-חיפוש עברי. חוזה: norm-search.contract.md
 *  חולץ כלשונו מ-maor/src/lib/validate.ts */
export function normSearch(t, T) {
  return String(t || '')
    .toLowerCase()
    .replace(/[֑-ׇ]/g, '')
    .replace(/[ךםןףץ]/g, (ch) => ({ ך: T.k1, ם: T.k2, ן: T.k3, ף: T.k4, ץ: T.k5 })[ch])
    .replace(/['"׳״\-–._]/g, '')
    .trim();
}
