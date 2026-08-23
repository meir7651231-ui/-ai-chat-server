/** חוט · norm-name — נרמול-שם חסין-רווחים. חוזה: norm-name.contract.md
 *  חולץ כלשונו מ-maor/src/lib/validate.ts (normName); הקריאה-הפנימית
 *  ל-normSearch הוזרקה כשקע (חוק-1 — אפס ייבוא-אטום). */
export function normName(t, normSearch) {
  return normSearch(t).replace(/\s/g, '');
}
