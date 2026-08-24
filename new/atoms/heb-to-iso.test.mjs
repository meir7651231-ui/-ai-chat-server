// בדיקת-חוזה · heb-to-iso — מוכיחה את 7 דוגמאות-החוזה. מייבאת רק את האטום-שלה.
// השקעים ממומשים כאן ביט-זהה למקור (maor/src/lib/hebdate.ts) מעל Intl לוח-hebrew.
import { hebToIso } from './heb-to-iso.mjs';

// ─── מימוש-השקעים לבדיקה (העתק התנהגות-המקור) ───
const fmtParts = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' });
function hebParts(d) {
  if (isNaN(d.getTime())) return { day: 0, month: '', year: 0 };
  const parts = fmtParts.formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
  return { day: +get('day'), month: get('month'), year: +get('year') };
}
const MONTHS = [
  ['Tishri', 'תשרי'], ['Heshvan', 'חשוון'], ['Kislev', 'כסלו'], ['Tevet', 'טבת'],
  ['Shevat', 'שבט'], ['Adar', 'אדר'], ['Adar I', 'אדר א׳'], ['Adar II', 'אדר ב׳'],
  ['Nisan', 'ניסן'], ['Iyar', 'אייר'], ['Sivan', 'סיוון'], ['Tamuz', 'תמוז'], ['Av', 'אב'], ['Elul', 'אלול'],
];
const monthEnOf = (he) => MONTHS.find((m) => m[1] === he)?.[0] ?? null;
const pad2 = (n) => String(n).padStart(2, '0');
const isoOf = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
function hebToIsoEn(day, monthEn, hebYear) {
  if (!Number.isInteger(day) || day < 1 || day > 30) return null;
  if (!Number.isInteger(hebYear) || hebYear < 4000 || hebYear > 7000) return null;
  const gy = hebYear - 3761;
  for (let i = 0; i < 440; i++) {
    const d = new Date(gy, 7, 1 + i, 12);
    const p = hebParts(d);
    if (p.year === hebYear && p.month === monthEn && p.day === day) return isoOf(d);
  }
  return null;
}
const conv = (day, monthHe, hebYear) => hebToIso(day, monthHe, hebYear, monthEnOf, hebToIsoEn);

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) כ״ג אב תשפ״ו
ok(conv(23, 'אב', 5786) === '2026-08-06', "23 אב 5786 ≠ '2026-08-06'");
// 2) ראש-השנה — השנה מתחילה בסתיו הקודם
ok(conv(1, 'תשרי', 5786) === '2025-09-23', "1 תשרי 5786 ≠ '2025-09-23'");
// 3) שנה מעוברת — אדר א׳ קיים
ok(conv(15, 'אדר א׳', 5784) === '2024-02-24', "15 אדר א׳ 5784 ≠ '2024-02-24'");
// 4) שנה פשוטה — אין אדר א׳
ok(conv(15, 'אדר א׳', 5786) === null, '15 אדר א׳ 5786 לא החזיר null');
// 5) חשוון מלא מול חסר
ok(conv(30, 'חשוון', 5785) === '2024-12-01', "30 חשוון 5785 ≠ '2024-12-01'");
ok(conv(30, 'חשוון', 5786) === null, '30 חשוון 5786 (שנה חסרה) לא החזיר null');
// 6) תווית-חודש לא-מוכרת
ok(conv(10, 'שטות', 5786) === null, 'חודש לא-מוכר לא החזיר null');
// 7) ולידציית-טווח
ok(conv(31, 'אב', 5786) === null, 'יום 31 לא החזיר null');
ok(conv(1, 'אב', 3000) === null, 'שנה 3000 לא החזירה null');

if (f) process.exit(1);
console.log('✓ heb-to-iso: 7 דוגמאות-חוזה — ירוק');
