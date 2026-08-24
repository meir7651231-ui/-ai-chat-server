/** חוט · hok-due — תור-ההו"ק הממתין לחודש (מסונן+ממוין לפי יום-חיוב). חוזה: hok-due.contract.md
 *  שקעים: hokEffectivelyActive · hokRecordedThisMonth (חוק-1 — קריאות-לשכן הוזרקו כפרמטרים).
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:728-732. */
export function hokDue(supporters, todayIso, hokEffectivelyActive, hokRecordedThisMonth) {
  return supporters
    .filter((sp) => hokEffectivelyActive(sp, todayIso) && !hokRecordedThisMonth(sp, todayIso))
    .sort((a, b) => (a.hok?.day ?? 0) - (b.hok?.day ?? 0));
}
