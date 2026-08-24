import { hebDateFull } from './heb-date-full.mjs';
// שקעים אמיתיים כמו ב-maor (מקומיים לבדיקה — הבדיקה מייבאת רק את האטום שלה)
function gem(n) {
  n = Math.floor(+n);
  if (!Number.isFinite(n) || n <= 0) return '';
  const U = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const T = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const H = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
  let s = H[Math.floor(n / 100)] || '';
  const r = n % 100;
  if (r === 15) s += 'טו';
  else if (r === 16) s += 'טז';
  else s += T[Math.floor(r / 10)] + U[r % 10];
  return s.length === 1 ? s + '׳' : s.slice(0, -1) + '״' + s.slice(-1);
}
const gemYear = (y) => gem(+y % 1000);
const fmtParts = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' });
function hebParts(d) {
  const parts = fmtParts.formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
  return { day: +get('day'), month: get('month'), year: +get('year') };
}
const C = [
  ['2026-08-24', 'י״א אלול תשפ״ו'],
  ['2026-04-02', 'ט״ו ניסן תשפ״ו'],
  ['2024-03-24', 'י״ד אדר ב׳ תשפ״ד'],
  ['2026-08-24T23:59:00', 'י״א אלול תשפ״ו'],
  ['', ''],
  ['שטויות', ''],
];
let f = 0;
for (const [iso, want] of C) {
  const got = hebDateFull(iso, gem, gemYear, hebParts);
  if (got !== want) { console.error(`✗ '${iso}' ⇒ '${got}' ≠ '${want}'`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ heb-date-full: 6 דוגמאות-חוזה מאומתות מול הלוח — ירוק');
