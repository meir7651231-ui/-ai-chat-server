/** חוט · freshen-demo-db — ריענון תאריכי-תזמון של הדמו בדלתא מהעוגן.
 *  חוזה: freshen-demo-db.contract.md
 *  חולץ כלשונו מ-maor/src/lib/demoFresh.ts:32-51 (כולל העוזרים הפרטיים
 *  daysBetween/shift); ‏DEMO_ANCHOR ו-isoLocal הוזרקו כשקעים (חוק-1). */

function daysBetween(fromIso, toIso, T) {
  const a = new Date(fromIso + 'T12:00:00').getTime();
  const b = new Date(toIso + 'T12:00:00').getTime();
  if (isNaN(a) || isNaN(b)) return 0;
  return Math.round((b - a) / T.k1);
}

/** מזיז תאריך ISO ב-days; קלט ריק/לא-תקין מוחזר כמות-שהוא. */
function shift(iso, days, isoLocal, T) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return iso;
  const d = new Date(iso.slice(0, T.k2) + 'T12:00:00');
  if (isNaN(d.getTime())) return iso;
  d.setDate(d.getDate() + days);
  return isoLocal(d);
}

export function freshenDemoDb(db, todayIso, anchorIso, isoLocal, T) {
  const delta = daysBetween(anchorIso, todayIso, T);
  if (!delta) return db;
  return {
    ...db,
    courses: db.courses.map((c) => ({ ...c, start: shift(c.start, delta, isoLocal, T), end: shift(c.end, delta, isoLocal, T) })),
    events: db.events.map((e) => ({ ...e, date: shift(e.date, delta, isoLocal, T) })),
    distributionDays: db.distributionDays.map((d) => ({
      ...d,
      date: shift(d.date, delta, isoLocal, T),
      createdAt: shift(d.createdAt, delta, isoLocal, T),
    })),
    enrollments: db.enrollments.map((en) => ({
      ...en,
      dueDate: shift(en.dueDate, delta, isoLocal, T),
      enrolledAt: shift(en.enrolledAt, delta, isoLocal, T),
    })),
  };
}
