/** חוט · holiday-names — כל שמות-החגים הייחודיים בסריקת 400 יום מעוגן-קבוע. חוזה: holiday-names.contract.md
 *  חולץ מ-maor/src/components/shop/lib.ts:153-179; השכן holidayOf (שם-חג לתאריך,
 *  מ-lib/hebrew) הוזרק כשקע (חוק-1 — אפס import פנימי). המטמון-המודולרי של המקור
 *  (holidayNamesCache) הושמט — memoization היא הקשר-שימוש (חוק-5) ושייכת לקופסה;
 *  עם שקע מוזרק מטמון גלובלי היה מזהם בין תוכניות-חיווט שונות. */
export function holidayNames(holidayOf) {
  const out = [];
  const seen = new Set();
  const start = new Date('2026-01-01T12:00:00');
  for (let i = 0; i < 400; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const name = holidayOf(d);
    if (name && !seen.has(name)) {
      seen.add(name);
      out.push(name);
    }
  }
  return out;
}
