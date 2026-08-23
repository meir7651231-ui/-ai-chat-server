/** חוט · month-en-of — תווית-עברית של חודש עברי ⇒ שם-Intl. חוזה: month-en-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebdate.ts (monthEnOf); טבלת MONTHS הוטמעה-פנימה
 *  ביט-זהה (נתון של האטום, לא ייבוא — חוק-1). */
const MONTHS = [
  ['Tishri', 'תשרי'],
  ['Heshvan', 'חשוון'],
  ['Kislev', 'כסלו'],
  ['Tevet', 'טבת'],
  ['Shevat', 'שבט'],
  ['Adar', 'אדר'],
  ['Adar I', 'אדר א׳'],
  ['Adar II', 'אדר ב׳'],
  ['Nisan', 'ניסן'],
  ['Iyar', 'אייר'],
  ['Sivan', 'סיוון'],
  ['Tamuz', 'תמוז'],
  ['Av', 'אב'],
  ['Elul', 'אלול'],
];
export function monthEnOf(he) {
  return MONTHS.find((m) => m[1] === he)?.[0] ?? null;
}
