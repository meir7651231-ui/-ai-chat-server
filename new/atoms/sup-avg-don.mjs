/** חוט · sup-avg-don — ממוצע-לתרומה: Σ שווי-בש"ח ÷ Σ מספר-תרומות (מעוגל); אין תרומות ⇒ null.
 *  חוזה: sup-avg-don.contract.md · חולץ כלשונו מ-maor/src/components/supporters/lib.ts:191-197;
 *  השכנים supTotalIls/supCount הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function supAvgDon(supporters, rate = 3.7, supTotalIls, supCount) {
  const totIls = supporters.reduce((a, x) => a + supTotalIls(x, rate), 0);
  const totCnt = supporters.reduce((a, x) => a + supCount(x), 0);
  return totCnt ? Math.round(totIls / totCnt) : null;
}
