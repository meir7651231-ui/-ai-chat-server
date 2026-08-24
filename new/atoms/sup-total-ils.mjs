/** חוט · sup-total-ils — שווי-תורם כולל בש"ח: ₪ + $×שער (ברירת-מחדל 3.7).
 *  חוזה: sup-total-ils.contract.md · חולץ כלשונו מ-maor/src/components/supporters/lib.ts:143-150;
 *  השכנים supIls/supUsd הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function supTotalIls(sp, rate = 3.7, supIls, supUsd) {
  return supIls(sp) + supUsd(sp) * rate;
}
