/** חוט · sup-score — ציון-תורם RFM ‏0–1000 (טריות+תדירות+סכום, ספים verbatim).
 *  חוזה: sup-score.contract.md · חולץ כלשונו מ-maor/src/components/supporters/lib.ts:151-171;
 *  השכנים supTotalIls/supLast/supCount הוזרקו כשקעים, ו-Date.now() הפך להזרקת-nowMs
 *  (חוק-1 — אפס import פנימי; ברירת-המחדל שומרת את התנהגות-המקור). */
export function supScore(sp, rate = 3.7, nowMs, supTotalIls, supLast, supCount, T) {
  const now = nowMs ?? Date.now();
  const tot = supTotalIls(sp, rate);
  const last = supLast(sp);
  const cnt = supCount(sp);
  const days = last
    ? Math.floor((now - new Date(last + 'T12:00:00').getTime()) / T.k1)
    : T.k2;
  const R = days <= T.k3 ? T.k4 : days <= T.k5 ? T.k6 : days <= T.k7 ? T.k8 : days <= T.k9 ? T.k10 : T.k11;
  const F = cnt >= T.k12 ? T.k13 : cnt >= 5 ? T.k14 : cnt >= 3 ? T.k15 : cnt >= 2 ? T.k16 : T.k17;
  const M = tot >= T.k18 ? T.k4 : tot >= T.k19 ? T.k6 : tot >= T.k20 ? T.k21 : tot >= T.k22 ? T.k23 : tot >= T.k16 ? T.k24 : T.k11;
  return R + F + M;
}
