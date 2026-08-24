/** חוט · sup-score — ציון-תורם RFM ‏0–1000 (טריות+תדירות+סכום, ספים verbatim).
 *  חוזה: sup-score.contract.md · חולץ כלשונו מ-maor/src/components/supporters/lib.ts:151-171;
 *  השכנים supTotalIls/supLast/supCount הוזרקו כשקעים, ו-Date.now() הפך להזרקת-nowMs
 *  (חוק-1 — אפס import פנימי; ברירת-המחדל שומרת את התנהגות-המקור). */
export function supScore(sp, rate = 3.7, nowMs, supTotalIls, supLast, supCount) {
  const now = nowMs ?? Date.now();
  const tot = supTotalIls(sp, rate);
  const last = supLast(sp);
  const cnt = supCount(sp);
  const days = last
    ? Math.floor((now - new Date(last + 'T12:00:00').getTime()) / 86400000)
    : 9999;
  const R = days <= 30 ? 350 : days <= 90 ? 280 : days <= 180 ? 200 : days <= 365 ? 120 : 40;
  const F = cnt >= 10 ? 300 : cnt >= 5 ? 230 : cnt >= 3 ? 160 : cnt >= 2 ? 100 : 50;
  const M = tot >= 5000 ? 350 : tot >= 2000 ? 280 : tot >= 1000 ? 210 : tot >= 500 ? 140 : tot >= 100 ? 80 : 40;
  return R + F + M;
}
