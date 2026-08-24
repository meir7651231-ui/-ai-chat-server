/** קופסת-חיבורים · hebrew — הלוח העברי המלא (maor/src/lib/hebrew.ts, ‏9 חוטים).
 *  חוזה: hebrew.contract.md · תוכנית: box-drafts/lib-hebrew.box-draft.md
 *  אפס שקעי-IO: הכול Intl/סטנדרט — אין DOM/רשת/אחסון להזרקה. */
import { gem } from '../atoms/gematria.mjs';
import { gemYear as gemYearWire } from '../atoms/gem-year.mjs';
import { adarNorm } from '../atoms/adar-norm.mjs';
import { hebAnnualEq as hebAnnualEqWire } from '../atoms/heb-annual-eq.mjs';
import { hebParts } from '../atoms/heb-parts.mjs';
import { hebPartsOfIso as hebPartsOfIsoWire } from '../atoms/heb-parts-of-iso.mjs';
import { hebDateFull as hebDateFullWire } from '../atoms/heb-date-full.mjs';
import { HOLIDAYS } from '../atoms/holidays.mjs';
import { holidayOf as holidayOfWire } from '../atoms/holiday-of.mjs';

// ── חיווט: סריקת-שנה-עברית (מקור hebrew.ts:60-76) — הכרעות-הקופסה: חלון 440 ימים,
//    עוגן 1 באוגוסט של (hebYear-3761) בצהריים, מטמון-Map פר-שנה. קומפוזיציה של חוט
//    heb-parts (לא IO) — לכן חיה כאן ולא כפרמטר. משרתת את כלל-ל' ואת דין-חנוכה-ח'.
const hebYearScan = new Map();
function scanHebYear(hebYear) {
  const hit = hebYearScan.get(hebYear);
  if (hit) return hit;
  const seq = [];
  const has30 = new Set();
  const gy = hebYear - 3761; // 1 באוגוסט של השנה הזו קודם תמיד לא' תשרי של hebYear
  for (let i = 0; i < 440; i++) {
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
