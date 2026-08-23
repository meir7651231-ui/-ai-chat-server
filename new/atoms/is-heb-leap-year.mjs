/** חוט · is-heb-leap-year — האם שנה עברית מעוברת. חוזה: is-heb-leap-year.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebdate.ts (isHebLeapYear); קריאת-החוץ hebToIsoEn
 *  הפכה לשקע-פרמטר (חוק-1 — אפס import פנימי). המבחן: האם 'Adar I' קיים בשנה. */
const leapCache = new Map();
export function isHebLeapYear(hebYear, hebToIsoEn) {
  const hit = leapCache.get(hebYear);
  if (hit !== undefined) return hit;
  const leap = hebToIsoEn(1, 'Adar I', hebYear) !== null;
  leapCache.set(hebYear, leap);
  return leap;
}
