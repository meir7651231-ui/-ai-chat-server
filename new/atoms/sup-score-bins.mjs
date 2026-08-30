/** חוט · sup-score-bins — היסטוגרמת-ציונים: 10 סלים של 100 נק' (900+ = הסל האחרון).
 *  חוזה: sup-score-bins.contract.md · חולץ כלשונו מ-maor/src/components/supporters/lib.ts:184-190;
 *  השכן supScore הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function supScoreBins(supporters, rate = 3.7, supScore, T) {
  const bins = Array(T.k1).fill(0);
  for (const sp of supporters) bins[Math.min(9, Math.floor(supScore(sp, rate) / T.k2))]++;
  return bins;
}
