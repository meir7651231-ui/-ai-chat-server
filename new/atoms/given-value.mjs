/** חוט · given-value — Σ השווי שנמסר בפועל (מימושים חיים בלבד).
 *  חוזה: given-value.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:432-438; השכן liveRedemptions
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function givenValue(assignments, liveRedemptions) {
  let sum = 0;
  for (const a of assignments)
    for (const r of liveRedemptions(a)) sum += Number.isFinite(r.value) ? r.value : 0;
  return sum;
}
