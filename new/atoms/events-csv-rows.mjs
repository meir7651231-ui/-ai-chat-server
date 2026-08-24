/** חוט · events-csv-rows — שורות ייצוא-CSV של האירועים.
 *  חוזה: events-csv-rows.contract.md · שקעים: termOf, hebDateFull, evMeta
 *  חולץ כלשונו מ-maor/src/lib/exportRows.ts (עוזרי-הקובץ fmtD/PRIORITY_LABEL שוכנו). */
const PRIORITY_LABEL = {
  green: 'רגיל (ירוק)',
  orange: 'בינוני (כתום)',
  red: 'דחוף (אדום)',
};
function fmtD(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
export function eventsCsvRows(db, config, termOf, hebDateFull, evMeta) {
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  const rows = [
    ['כותרת', 'סוג אירוע', 'תאריך עברי', 'תאריך לועזי', 'שעה', T('entity.family', 'משפחה'), 'עדיפות', 'הערות', 'בוצע'],
  ];
  const evs = [...db.events].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  for (const ev of evs) {
    rows.push([
      ev.title,
      ev.customType || evMeta[ev.type].label,
      ev.date ? hebDateFull(ev.date) : '',
      fmtD(ev.date),
      ev.time || '',
      db.families.find((f) => f.id === ev.famId)?.name || '',
      PRIORITY_LABEL[ev.priority] || ev.priority,
      ev.notes || '',
      ev.done ? 'כן' : 'לא',
    ]);
  }
  return rows;
}
