import { hebMonthsOf } from './heb-months-of.mjs';
// שקעים אמיתיים (מקומיים לבדיקה — הבדיקה מייבאת רק את האטום שלה):
// עיבור לפי מחזור-המטונים (זהה לתשובת Intl — אומת מול סריקת-הלוח לשנים הנבדקות)
const isHebLeapYear = (y) => (7 * y + 1) % 19 < 7;
const MONTHS = [
  ['Tishri', 'תשרי'], ['Heshvan', 'חשוון'], ['Kislev', 'כסלו'], ['Tevet', 'טבת'],
  ['Shevat', 'שבט'], ['Adar', 'אדר'], ['Adar I', 'אדר א׳'], ['Adar II', 'אדר ב׳'],
  ['Nisan', 'ניסן'], ['Iyar', 'אייר'], ['Sivan', 'סיוון'], ['Tamuz', 'תמוז'],
  ['Av', 'אב'], ['Elul', 'אלול'],
];
const monthHeOf = (en) => MONTHS.find((m) => m[0] === en)?.[1] ?? '';
let f = 0;
const common = hebMonthsOf(5786, isHebLeapYear, monthHeOf);
const wantCommon = ['תשרי', 'חשוון', 'כסלו', 'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיוון', 'תמוז', 'אב', 'אלול'];
if (JSON.stringify(common) !== JSON.stringify(wantCommon)) { console.error('✗ 5786 פשוטה: ' + JSON.stringify(common)); f = 1; }
const leap = hebMonthsOf(5784, isHebLeapYear, monthHeOf);
if (leap.length !== 13 || leap[5] !== 'אדר א׳' || leap[6] !== 'אדר ב׳' || leap.includes('אדר')) {
  console.error('✗ 5784 מעוברת: ' + JSON.stringify(leap)); f = 1;
}
if (leap[4] !== 'שבט' || leap[7] !== 'ניסן' || leap[12] !== 'אלול') { console.error('✗ 5784 סדר-שאר-החודשים'); f = 1; }
if (hebMonthsOf(5787, isHebLeapYear, monthHeOf).length !== 13) { console.error('✗ 5787 אורך'); f = 1; }
const y5785 = hebMonthsOf(5785, isHebLeapYear, monthHeOf);
if (y5785.length !== 12 || y5785[5] !== 'אדר') { console.error('✗ 5785 פשוטה'); f = 1; }
if (f) process.exit(1);
console.log('✓ heb-months-of: 4 שנים (2 פשוטות + 2 מעוברות) לפי החוזה — ירוק');
