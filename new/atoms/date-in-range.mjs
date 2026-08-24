/** חוט · date-in-range — תאריך-ISO בטווח כוללני, קצה ריק=פתוח. חוזה: date-in-range.contract.md
 *  חולץ כלשונו מ-maor/src/lib/date-util.ts:30-33 (אפס שכנים — אפס שקעים). */
export function dateInRange(iso, fromIso, toIso) {
  return (!fromIso || iso >= fromIso) && (!toIso || iso <= toIso);
}
