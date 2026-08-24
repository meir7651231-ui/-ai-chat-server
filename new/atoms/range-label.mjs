/** חוט · range-label — תווית עברית לטווח-תאריכים {from,to} במסך הדוחות.
 *  חוזה: range-label.contract.md
 *  חולץ כלשונו מ-maor/src/components/reports/lib.ts:32-38 (תורגם TS→JS);
 *  ‏fmtDate הפך לשקע-מוזרק (חוק-1). */
export function rangeLabel(r, fmtDate) {
  if (!r.from && !r.to) return 'כל התאריכים';
  if (r.from && r.to) return `${fmtDate(r.from)} – ${fmtDate(r.to)}`;
  return r.from ? 'מ-' + fmtDate(r.from) : 'עד ' + fmtDate(r.to);
}
