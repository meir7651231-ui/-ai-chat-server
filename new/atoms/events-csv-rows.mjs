/** חוט · events-csv-rows — שורות ייצוא-CSV של האירועים.
 *  חוזה: events-csv-rows.contract.md · שקעים: termOf, hebDateFull, evMeta
 *  חולץ כלשונו מ-maor/src/lib/exportRows.ts (עוזרי-הקובץ fmtD/PRIORITY_LABEL שוכנו). */
export function eventsCsvRows(db, config, termOf, hebDateFull, evMeta, T2) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const PRIORITY_LABEL = {
    green: T2.k1,
    orange: T2.k2,
    red: T2.k3,
  };
  function fmtD(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  const rows = [
    [T2.k4, T2.k5, T2.k6, T2.k7, T2.k8, T(T2.k9, T2.k10), T2.k11, T2.k12, T2.k13],
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
      ev.done ? T2.k14 : T2.k15,
    ]);
  }
  return rows;
}
