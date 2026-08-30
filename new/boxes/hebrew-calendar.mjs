/** קופסת-חיבורים · לוח עברי. חוזה: hebrew-calendar.contract.md */
import { gem as __pure_gem } from '../atoms/gematria.mjs';
import { U, T, H } from '../atoms/gematria-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const gem = (...a) => __pure_gem(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), U, T, H);
import { hebParts as __pure_hebParts } from '../atoms/heb-parts.mjs';
import { HEB_PARTS_T as __d_hebParts_HEB_PARTS_T } from '../atoms/heb-parts-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebParts = (...a) => __pure_hebParts(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_hebParts_HEB_PARTS_T);
import { hebMonthHe } from '../atoms/heb-month-he.mjs';
import { adarNorm as __pure_adarNorm } from '../atoms/adar-norm.mjs';
import { ADAR_NORM_T as __d_adarNorm_ADAR_NORM_T } from '../atoms/adar-norm-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const adarNorm = (...a) => __pure_adarNorm(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_adarNorm_ADAR_NORM_T);

// ── החיווט: כלל-הצהריים — הכרעת-הקופסה, לא של החוטים ──
const noon = (iso) => new Date(String(iso).slice(0, 10) + 'T12:00:00');

export const parts = (iso) => hebParts(noon(iso));
export const fullDate = (iso) => {
  if (!iso) return '';
  const d = noon(iso);
  if (isNaN(d.getTime())) return '';
  const p = hebParts(d);
  return `${gem(p.day)} ${hebMonthHe(d)} ${gem(p.year % 1000)}`;
};
export const annualKey = (iso) => {
  const p = parts(iso);
  return p.month ? `${adarNorm(p.month)} ${p.day}` : '';
};
