/** קופסת-חיבורים · hebdate — שכבת קלט/תצוגה תאריך-עברי: המרות עברי↔לועזי דרך Intl בלבד.
 *  חוזה: hebdate.contract.md · מקור-האמת (L4): maor/src/lib/hebdate.ts
 *  8 חוטים לפי box-drafts/lib-hebdate.box-draft.md; ההכרעות שחיות כאן (חיווט, לא אטום):
 *  · isoOf — הרכבת ISO מ-Date מקומי דרך pad2 (hebdate.ts:60-62)
 *  · hebToIsoEn — סריקת-העוגן: 1-באוגוסט של (hebYear−3761), עד 440 ימים, צהריים-מקומי
 *    חסין-שעון-קיץ (hebdate.ts:65-75) — תפר-הרכבה של hebParts+isoOf, גבולות 1..30 / 4000..7000
 *  · KNOWN_MONTHS_EN — מילון-התוויות המוכר ל-CLDR-guard (hebdate.ts:124)
 *  · ברירת-מחדל hebYear=hebYearNow() לוולידציה (hebdate.ts:125)
 *  שקעי-IO מוזרקים (לא מימוש): now=שעון (ברירת-מחדל new Date() כמו במקור hebdate.ts:53,141) ·
 *  warn=קונסולה (hebdate.ts:142). שער-ה-CLDR שבמקור רץ בטעינת-המודול (hebdate.ts:139-143)
 *  נחשף כאן כפונקציה cldrGuard — הקופסה נקייה מתופעות-לוואי בייבוא; לוח-האם מחווט אותה באתחול. */
import { hebParts as __pure_hebParts } from '../atoms/heb-parts.mjs';
import { HEB_PARTS_T as __d_hebParts_HEB_PARTS_T } from '../atoms/heb-parts-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebParts = (...a) => __pure_hebParts(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_hebParts_HEB_PARTS_T);
import { pad2 } from '../atoms/pad2.mjs';
import { monthHeOf as __pure_monthHeOf } from '../atoms/month-he-of.mjs';
import { MONTHS as __d_monthHeOf_MONTHS } from '../atoms/month-en-of-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const monthHeOfAtom = (...a) => __pure_monthHeOf(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_monthHeOf_MONTHS);
import { monthEnOf as __pure_monthEnOf } from '../atoms/month-en-of.mjs';
import { MONTHS } from '../atoms/month-en-of-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const monthEnOfAtom = (...a) => __pure_monthEnOf(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), MONTHS);
import { hebYearNow as hebYearNowAtom } from '../atoms/heb-year-now.mjs';
import { isHebLeapYear as __pure_isHebLeapYear } from '../atoms/is-heb-leap-year.mjs';
import { IS_HEB_LEAP_YEAR_T as __d_isHebLeapYear_IS_HEB_LEAP_YEAR_T } from '../atoms/is-heb-leap-year-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const isHebLeapYearAtom = (...a) => __pure_isHebLeapYear(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_isHebLeapYear_IS_HEB_LEAP_YEAR_T);
import { hebMonthsOf as __pure_hebMonthsOf } from '../atoms/heb-months-of.mjs';
import { ORDER_COMMON, ORDER_LEAP } from '../atoms/heb-months-of-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const hebMonthsOfAtom = (...a) => __pure_hebMonthsOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), ORDER_COMMON, ORDER_LEAP);
import { hebToIso as hebToIsoAtom } from '../atoms/heb-to-iso.mjs';
import { isoToHebParts as isoToHebPartsAtom } from '../atoms/iso-to-heb-parts.mjs';
import { validateHebMonthNames as validateHebMonthNamesAtom } from '../atoms/validate-heb-month-names.mjs';

// ── חיווט: Date⇒ISO מקומי (hebdate.ts:60-62) ──
const isoOf = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());

// ── חיווט: המרה עברי→לועזי כששם-החודש בשם-Intl — סריקת ~440 ימים מהעוגן (hebdate.ts:65-75) ──
const hebToIsoEn = (day, monthEn, hebYear) => {
  if (!Number.isInteger(day) || day < 1 || day > 30) return null;
  if (!Number.isInteger(hebYear) || hebYear < 4000 || hebYear > 7000) return null;
  const gy = hebYear - 3761; // 1 באוגוסט של השנה הזו קודם תמיד לא׳ תשרי של hebYear
  for (let i = 0; i < 440; i++) {
    const d = new Date(gy, 7, 1 + i, 12); // צהריים — חסין להיסטי שעון קיץ
    const p = hebParts(d);
    if (p.year === hebYear && p.month === monthEn && p.day === day) return isoOf(d);
  }
  return null; // התאריך לא קיים בשנה זו (למשל ל׳ חשוון בשנה חסרה/כסדרה)
};

/** תווית עברית של חודש לפי שם Intl ('Av' → 'אב'), או '' אם לא מוכר. (hebdate.ts:42-44) */
export const monthHeOf = (en) => monthHeOfAtom(en);

/** שם Intl של חודש לפי תווית עברית ('אב' → 'Av'), או null אם לא מוכר. (hebdate.ts:47-49) */
export const monthEnOf = (he) => monthEnOfAtom(he);

/** השנה העברית של רגע נתון (ברירת-מחדל: עכשיו — כמו במקור). (hebdate.ts:52-54) */
export const hebYearNow = (now = new Date()) => hebYearNowAtom(hebParts, now);

/** האם שנה עברית מעוברת — האם קיים בה 'Adar I' (עם cache באטום). (hebdate.ts:79-85) */
export const isHebLeapYear = (hebYear) => isHebLeapYearAtom(hebYear, hebToIsoEn);

/** חודשי שנה עברית לפי הסדר, בתוויות עבריות — 12 בפשוטה / 13 במעוברת. (hebdate.ts:91-94) */
export const hebMonthsOf = (hebYear) => hebMonthsOfAtom(hebYear, isHebLeapYear, monthHeOf);

/** עברי→לועזי: (23,'אב',5786) → '2026-08-06'; null אם הצירוף לא קיים. (hebdate.ts:100-104) */
export const hebToIso = (day, monthHe, hebYear) => hebToIsoAtom(day, monthHe, hebYear, monthEnOf, hebToIsoEn);

/** לועזי→עברי: '2026-08-06' → {day:23, monthHe:'אב', year:5786} | null. (hebdate.ts:107-115) */
export const isoToHebParts = (iso) => isoToHebPartsAtom(iso, hebParts, monthHeOf);

/** מילון-החודשים המוכרים (שמות-Intl, כולל 'Adar' + 'Adar I/II') — הכרעת-קופסה. (hebdate.ts:124) */
export const KNOWN_MONTHS_EN = new Set([
  'Tishri', 'Heshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar', 'Adar I', 'Adar II',
  'Nisan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul',
]);

/** ולידציית-ריצה: סריקת שנה עברית ⇒ שמות-חודשי-Intl לא-מוכרים (ריק = תקין). (hebdate.ts:125-137) */
export const validateHebMonthNames = (hebYear = hebYearNow()) =>
  validateHebMonthNamesAtom(hebYear, hebParts, KNOWN_MONTHS_EN);

/** שער-CLDR זול O(1): שם-חודש-היום חייב להיות מוכר; לא-מוכר ⇒ warn (אין throw) ומחזיר false.
 *  במקור רץ בטעינת-המודול (hebdate.ts:139-143) — כאן שקע-מחווט ללוח-האם. */
export const cldrGuard = (now = new Date(), warn = console.warn) => {
  if (!KNOWN_MONTHS_EN.has(hebParts(now).month)) {
    warn('⚠ שם חודש עברי לא-צפוי מ-Intl — ייתכן שינוי CLDR שישבור המרות תאריך. הריצו validateHebMonthNames().');
    return false;
  }
  return true;
};
