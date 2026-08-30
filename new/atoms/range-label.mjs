/** חוט · range-label — תווית עברית לטווח-תאריכים {from,to} במסך הדוחות.
 *  חוזה: range-label.contract.md
 *  חולץ כלשונו מ-maor/src/components/reports/lib.ts:32-38 (תורגם TS→JS);
 *  ‏fmtDate הפך לשקע-מוזרק (חוק-1). */
export function rangeLabel(r, fmtDate, T) {
  if (!r.from && !r.to) return T.k1;
  if (r.from && r.to) return `${fmtDate(r.from)} – ${fmtDate(r.to)}`;
  return r.from ? T.k2 + fmtDate(r.from) : T.k3 + fmtDate(r.to);
}
