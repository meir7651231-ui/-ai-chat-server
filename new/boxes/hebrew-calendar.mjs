/** קופסת-חיבורים · לוח עברי. חוזה: hebrew-calendar.contract.md */
import { gem as __pure_gem } from '../atoms/gematria.mjs';
import { U, T, H } from '../atoms/gematria-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const gem = (...a) => __pure_gem(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), U, T, H);
import { hebParts } from '../atoms/heb-parts.mjs';
import { hebMonthHe } from '../atoms/heb-month-he.mjs';
import { adarNorm } from '../atoms/adar-norm.mjs';

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
