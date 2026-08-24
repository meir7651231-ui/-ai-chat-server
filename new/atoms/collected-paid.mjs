/** חוט · collected-paid — Σ מה ששולם בפועל (מימושים חיים בלבד).
 *  חוזה: collected-paid.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:440-446; השכן liveRedemptions
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function collectedPaid(assignments, liveRedemptions) {
  let sum = 0;
  for (const a of assignments)
    for (const r of liveRedemptions(a)) sum += Number.isFinite(r.paid) ? r.paid : 0;
  return sum;
}
