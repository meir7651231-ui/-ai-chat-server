import { nextAcademicYearLabel } from './next-academic-year-label.mjs';
// שקעים אמיתיים/נאמנים (מקומיים — הבדיקה מייבאת רק את האטום שלה)
const atNoon = (iso) => new Date(`${iso}T12:00:00`);
// נאמן ל-31.12: השנה העברית של ה-31.12 הלועזי היא תמיד G+3761 (ר"ה כבר עבר)
const hebPartsOfIso = (iso) => ({ year: Number(iso.slice(0, 4)) + 3761 });
// gem-אמת של maor (lib/hebrew.ts) — גימטריה
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

const C = [
  ['2025-09-01', 'תשפ״ז'],
  ['2026-09-01', 'תשפ״ח'],
  ['2026-06-30', 'תשפ״ז'],
  ['2026-08-31', 'תשפ״ז'],
  ['2025-08-31', 'תשפ״ו'],
  ['', ''],
];
let f = 0;
for (const [a, w] of C) {
  const g = nextAcademicYearLabel(a, atNoon, gemYear, hebPartsOfIso);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ next-academic-year-label: 6 דוגמאות-חוזה — ירוק');
