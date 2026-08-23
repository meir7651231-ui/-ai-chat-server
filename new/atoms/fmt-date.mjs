/** חוט · fmt-date — תאריך-ISO לתצוגה. חוזה: fmt-date.contract.md
 *  חולץ כלשונו (היה זהה ב-4 מודולים של maor — אוחד לעותק-יחיד). */
export function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  if (!y || !m || !d) return '—';
  return `${d}/${m}/${y}`;
}
