/** קופסת-חיבורים · hebrew — הלוח העברי המלא (maor/src/lib/hebrew.ts, ‏9 חוטים).
 *  חוזה: hebrew.contract.md · תוכנית: box-drafts/lib-hebrew.box-draft.md
 *  אפס שקעי-IO: הכול Intl/סטנדרט — אין DOM/רשת/אחסון להזרקה. */
import { gem as __pure_gem } from '../atoms/gematria.mjs';
import { GEMATRIA_T as __d_gem_GEMATRIA_T } from '../atoms/gematria-strings.mjs';
import { U, T, H } from '../atoms/gematria-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const gem = (...a) => __pure_gem(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), U, T, H, __d_gem_GEMATRIA_T);
import { gemYear as __pure_gemYear } from '../atoms/gem-year.mjs';
import { GEM_YEAR_T as __d_gem_year_T } from '../atoms/gem-year-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const gemYearWire = (...a) => __pure_gemYear(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_gem_year_T);
import { adarNorm as __pure_adarNorm } from '../atoms/adar-norm.mjs';
import { ADAR_NORM_T as __d_adarNorm_ADAR_NORM_T } from '../atoms/adar-norm-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const adarNorm = (...a) => __pure_adarNorm(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_adarNorm_ADAR_NORM_T);
import { hebAnnualEq as __pure_hebAnnualEq } from '../atoms/heb-annual-eq.mjs';
import { HEB_ANNUAL_EQ_T as __d_hebAnnualEq_HEB_ANNUAL_EQ_T } from '../atoms/heb-annual-eq-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebAnnualEqWire = (...a) => __pure_hebAnnualEq(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_hebAnnualEq_HEB_ANNUAL_EQ_T);
import { hebParts as __pure_hebParts } from '../atoms/heb-parts.mjs';
import { HEB_PARTS_T as __d_hebParts_HEB_PARTS_T } from '../atoms/heb-parts-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebParts = (...a) => __pure_hebParts(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_hebParts_HEB_PARTS_T);
import { hebPartsOfIso as __pure_hebPartsOfIso } from '../atoms/heb-parts-of-iso.mjs';
import { HP_CACHE_MAX as __d_hebPartsOfIso_HP_CACHE_MAX } from '../atoms/heb-parts-of-iso-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const hebPartsOfIsoWire = (...a) => __pure_hebPartsOfIso(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_hebPartsOfIso_HP_CACHE_MAX);
import { hebDateFull as __pure_hebDateFull } from '../atoms/heb-date-full.mjs';
import { HEB_DATE_FULL_T as __d_hebDateFull_HEB_DATE_FULL_T } from '../atoms/heb-date-full-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebDateFullWire = (...a) => __pure_hebDateFull(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_hebDateFull_HEB_DATE_FULL_T);
import { HOLIDAYS } from '../atoms/holidays.mjs';
import { holidayOf as __pure_holidayOf } from '../atoms/holiday-of.mjs';
import { HOLIDAY_OF_T as __d_holidayOf_HOLIDAY_OF_T } from '../atoms/holiday-of-strings.mjs';
import { HEB_CAL } from '../atoms/heb-cal-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const holidayOfWire = (...a) => __pure_holidayOf(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_holidayOf_HOLIDAY_OF_T);

// ── חיווט: סריקת-שנה-עברית (מקור hebrew.ts:60-76) — הכרעות-הקופסה: חלון 440 ימים,
//    עוגן 1 באוגוסט של (hebYear-3761) בצהריים, מטמון-Map פר-שנה. קומפוזיציה של חוט
//    heb-parts (לא IO) — לכן חיה כאן ולא כפרמטר. משרתת את כלל-ל' ואת דין-חנוכה-ח'.
const hebYearScan = new Map();
function scanHebYear(hebYear) {
  const hit = hebYearScan.get(hebYear);
  if (hit) return hit;
  const seq = [];
  const has30 = new Set();
  const gy = hebYear - HEB_CAL.hebYearOffset; // 1 באוגוסט של השנה הזו קודם תמיד לא' תשרי של hebYear
  for (let i = 0; i < HEB_CAL.scanWindowDays; i++) {
    const p = hebParts(new Date(gy, 7, 1 + i, 12));
    if (p.year !== hebYear) continue;
    if (!seq.includes(p.month)) seq.push(p.month);
    if (p.day === 30) has30.add(p.month);
  }
  const res = { seq, has30 };
  hebYearScan.set(hebYear, res);
  return res;
}

// ── חשיפה: שמות-המקור verbatim (חוק-7 — החלפה-הפיכה) ──
export { gem, adarNorm, hebParts, HOLIDAYS };
export const gemYear = (y) => gemYearWire(y, gem);
export const hebAnnualEq = (anchor, query) => hebAnnualEqWire(anchor, query, scanHebYear);
export const hebPartsOfIso = (iso) => hebPartsOfIsoWire(iso, hebParts);
export const hebDateFull = (iso) => hebDateFullWire(iso, gem, gemYear, hebParts);
export const holidayOf = (d) => holidayOfWire(d, hebParts, scanHebYear, HOLIDAYS);
