/** חוט · month-he-of — שם-Intl של חודש עברי ⇒ תווית עברית. חוזה: month-he-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebdate.ts (monthHeOf); טבלת MONTHS הוטמעה-פנימה
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
export function monthHeOf(en) {
  return MONTHS.find((m) => m[0] === en)?.[1] ?? '';
}
