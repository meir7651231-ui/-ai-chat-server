/** חוט · heb-to-iso — עברי→לועזי: יום+חודש-עברי+שנה ⇒ ISO. חוזה: heb-to-iso.contract.md
 *  שקעים: monthEnOf · hebToIsoEn (חוק-1 — קריאות-לשכן הוזרקו כפרמטרים).
 *  חולץ כלשונו מ-maor/src/lib/hebdate.ts:100-104. */
export function hebToIso(day, monthHe, hebYear, monthEnOf, hebToIsoEn) {
  const en = monthEnOf(monthHe);
  if (!en) return null;
  return hebToIsoEn(day, en, hebYear);
}
