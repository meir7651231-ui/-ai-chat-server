/** חוט · month-en-of — תווית-עברית של חודש עברי ⇒ שם-Intl. חוזה: month-en-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebdate.ts (monthEnOf); טבלת MONTHS הוטמעה-פנימה
 *  ביט-זהה (נתון של האטום, לא ייבוא — חוק-1). */
export function monthEnOf(he, MONTHS) {
  return MONTHS.find((m) => m[1] === he)?.[0] ?? null;
}
