import { isHebLeapYear as __pure_isHebLeapYear } from './is-heb-leap-year.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_isHebLeapYear_IS_HEB_LEAP_YEAR_T = {
  k1: "Adar I",
};
const isHebLeapYear = (...a) => __pure_isHebLeapYear(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_isHebLeapYear_IS_HEB_LEAP_YEAR_T);
// שקע-דמה נאמן-ללוח: 'Adar I' קיים ⇔ השנה מעוברת לפי מחזור-19 ((7y+1)%19<7) — מאומת ל-5784/5786/5787.
let calls = 0;
const hebToIsoEn = (day, monthEn, y) => { calls++; return (monthEn === 'Adar I' && (7 * y + 1) % 19 < 7) ? '2024-02-10' : null; };
let f = 0;
if (isHebLeapYear(5784, hebToIsoEn) !== true)  { console.error('✗ 5784 מעוברת'); f = 1; }
if (isHebLeapYear(5786, hebToIsoEn) !== false) { console.error('✗ 5786 פשוטה'); f = 1; }
if (isHebLeapYear(5787, hebToIsoEn) !== true)  { console.error('✗ 5787 מעוברת'); f = 1; }
const before = calls;
if (isHebLeapYear(5784, hebToIsoEn) !== true)  { console.error('✗ 5784 חוזרת'); f = 1; }
if (calls !== before) { console.error('✗ cache — השקע נקרא שוב'); f = 1; }
if (f) process.exit(1); console.log('✓ is-heb-leap-year: 3 שנים + דין-ה-cache — ירוק');
