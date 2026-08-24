/** חוט · heb-year-now — השנה העברית של רגע נתון. חוזה: heb-year-now.contract.md
 *  שקעים: hebParts · now (חוק-1 — השכן והשעון-הסמוי הוזרקו כפרמטרים).
 *  חולץ כלשונו מ-maor/src/lib/hebdate.ts:52-54. */
export function hebYearNow(hebParts, now) {
  return hebParts(now).year;
}
