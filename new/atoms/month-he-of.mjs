/** חוט · month-he-of — שם-Intl של חודש עברי ⇒ תווית עברית. חוזה: month-he-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebdate.ts (monthHeOf); טבלת MONTHS הוטמעה-פנימה
 *  ביט-זהה (נתון של האטום, לא ייבוא — חוק-1). */
export function monthHeOf(en, MONTHS) {
  return MONTHS.find((m) => m[0] === en)?.[1] ?? '';
}
