/** חוט · subsidy-total — הסבסוד הכולל: שווי-שנמסר פחות מה-ששולם (מחיר סמלי).
 *  חוזה: subsidy-total.contract.md · חולץ כלשונו מ-maor/src/components/shop/lib.ts:447-451;
 *  השכנים givenValue/collectedPaid הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function subsidyTotal(assignments, givenValue, collectedPaid) {
  return givenValue(assignments) - collectedPaid(assignments);
}
