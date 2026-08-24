/** בדיקת-קצה · קופסת-hebdate — מוכיחה את דוגמאות-החוזה (hebdate.contract.md) דרך הקופסה בלבד. */
import {
  monthHeOf, monthEnOf, hebYearNow, isHebLeapYear, hebMonthsOf,
  hebToIso, isoToHebParts, validateHebMonthNames, KNOWN_MONTHS_EN, cldrGuard,
} from './hebdate.mjs';
let f = 0;
const bad = (m) => { console.error('✗ ' + m); f = 1; };

// מילון-החודשים (hebdate.ts:42-49)
if (monthHeOf('Av') !== 'אב') bad("monthHeOf('Av'): " + monthHeOf('Av'));
if (monthHeOf('Foo') !== '') bad('monthHeOf לא-מוכר ≠ ריק');
if (monthEnOf('אב') !== 'Av') bad("monthEnOf('אב'): " + monthEnOf('אב'));
if (monthEnOf('אדר א׳') !== 'Adar I') bad('monthEnOf אדר א׳');
if (monthEnOf('זבל') !== null) bad('monthEnOf זבל ≠ null');

// הדוגמה שבמקור (hebdate.ts:97): כ״ג אב תשפ״ו = 2026-08-06
if (hebToIso(23, 'אב', 5786) !== '2026-08-06') bad('hebToIso(23,אב,5786): ' + hebToIso(23, 'אב', 5786));
const p = isoToHebParts('2026-08-06');
if (!p || p.day !== 23 || p.monthHe !== 'אב' || p.year !== 5786) bad('isoToHebParts(2026-08-06): ' + JSON.stringify(p));

// שעון-מוזרק (hebdate.ts:52-54)
if (hebYearNow(new Date(2026, 7, 24, 12)) !== 5786) bad('hebYearNow(24.8.2026) ≠ 5786');

// מעוברת/פשוטה (hebdate.ts:79-94)
if (isHebLeapYear(5784) !== true) bad('5784 מעוברת');
if (isHebLeapYear(5786) !== false) bad('5786 פשוטה');
const m86 = hebMonthsOf(5786), m84 = hebMonthsOf(5784);
if (m86.length !== 12 || !m86.includes('אדר') || m86.includes('אדר א׳')) bad('hebMonthsOf(5786): ' + m86);
if (m84.length !== 13 || !m84.includes('אדר א׳') || !m84.includes('אדר ב׳') || m84.includes('אדר')) bad('hebMonthsOf(5784): ' + m84);
if (m84[0] !== 'תשרי' || m84[12] !== 'אלול' || m86[0] !== 'תשרי' || m86[11] !== 'אלול') bad('סדר-החודשים');
if (hebToIso(1, 'אדר א׳', 5786) !== null) bad('אדר א׳ בפשוטה ≠ null');

// שמירת-גבולות (hebdate.ts:66-67)
for (const [d, m, y] of [[0, 'אב', 5786], [31, 'אב', 5786], [2.5, 'אב', 5786], [15, 'אב', 3999], [15, 'אב', 7001]])
  if (hebToIso(d, m, y) !== null) bad(`גבול: hebToIso(${d},${m},${y}) ≠ null`);

// קלט שבור (hebdate.ts:108-110)
for (const iso of ['junk', '', '2026-8-6'])
  if (isoToHebParts(iso) !== null) bad(`isoToHebParts('${iso}') ≠ null`);
// ⚠ התנהגות-המקור (L4): '2026-02-30' עובר רג׳קס ו-V8 מגלגל ל-2 במרץ — לא null
if (JSON.stringify(isoToHebParts('2026-02-30')) !== JSON.stringify(isoToHebParts('2026-03-02'))) bad('גלגול 30.2 ≠ 2.3');

// round-trip על תאריכים קבועים, כולל שנה מעוברת
for (const iso of ['2026-08-06', '2024-03-24', '2025-03-14', '2026-01-01']) {
  const q = isoToHebParts(iso);
  if (!q || hebToIso(q.day, q.monthHe, q.year) !== iso) bad('round-trip: ' + iso);
}
// ל׳ חשוון: קיים רק בשנה שלמה — בטווח 5780..5790 חייבים גם null וגם round-trip תקין
let full = 0, missing = 0;
for (let y = 5780; y <= 5790; y++) {
  const iso = hebToIso(30, 'חשוון', y);
  if (iso === null) { missing++; continue; }
  const q = isoToHebParts(iso);
  if (!q || q.day !== 30 || q.monthHe !== 'חשוון' || q.year !== y) bad('ל׳ חשוון round-trip: ' + y);
  full++;
}
if (!full || !missing) bad(`ל׳ חשוון: ציפינו גם-שלמות-וגם-חסרות בעשור (שלמות=${full}, חסרות=${missing})`);

// ולידציית-CLDR (hebdate.ts:125-137) + שער-מוזרק (hebdate.ts:139-143)
if (validateHebMonthNames(5786).length) bad('validateHebMonthNames(5786) לא ריק');
if (validateHebMonthNames(5784).length) bad('validateHebMonthNames(5784) לא ריק');
if (KNOWN_MONTHS_EN.size !== 14) bad('KNOWN_MONTHS_EN ≠ 14 שמות');
let warned = 0;
if (cldrGuard(new Date(2026, 7, 24, 12), () => warned++) !== true || warned) bad('cldrGuard תקין הזהיר');
// שעון-שבור ⇒ hebParts מחזיר month:'' (לא-מוכר) ⇒ warn אחד + false
if (cldrGuard(new Date(NaN), () => warned++) !== false || warned !== 1) bad('cldrGuard שבור לא הזהיר');

/* 🛡 מגן-הכרעה: ההכרעות שבחוזה חיות במקור-הקופסה תו-בתו (דפוס theme.test). */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./hebdate.mjs', import.meta.url), 'utf8');
if (!src.includes('hebYear - 3761')) bad('מגן: עוגן-הסריקה (−3761) שונה');
if (!src.includes('i < 440')) bad('מגן: חלון-440 שונה');
if (!src.includes('new Date(gy, 7, 1 + i, 12)')) bad('מגן: צהריים/1-באוגוסט שונה');
if (!src.includes('now = new Date()')) bad('מגן: ברירת-מחדל-השעון שונתה');
if (!src.includes('⚠ שם חודש עברי לא-צפוי מ-Intl — ייתכן שינוי CLDR שישבור המרות תאריך. הריצו validateHebMonthNames().')) bad('מגן: הודעת-ה-warn שונתה');
const imports = [...src.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
if (!imports.length || !imports.every((i) => i.startsWith('../atoms/'))) bad('מגן: ייבוא שאינו מ-atoms: ' + imports);
if (/^\s*console\.warn\(/m.test(src)) bad('מגן: console.warn ברמת-מודול — השער חייב להיות שקע-מוזרק');

if (f) process.exit(1);
console.log('✓ קופסת-hebdate: מילון-חודשים · המרות דו-כיווניות + round-trip · מעוברת/פשוטה · גבולות · שער-CLDR מוזרק — ירוק');
