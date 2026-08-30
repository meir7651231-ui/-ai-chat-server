/** חוט · intel-rfm-from-scan — Golden. חוזה: intel-rfm-from-scan.contract.md
 * מוצא: intel.ts:95 (rfmFromScan) + rScore/fScore/mScore:73-81 (inline, ספי supScore verbatim). חוק-4.
 * שקע: dayDiff (אח intel).
 */
export function rfmFromScan(scan, todayIso, { dayDiff }, T) {
  const rScore = (days) => days <= T.k1 ? T.k2 : days <= T.k3 ? T.k4 : days <= T.k5 ? T.k6 : days <= T.k7 ? T.k8 : T.k9;
  const fScore = (cnt) => cnt >= T.k10 ? T.k11 : cnt >= 5 ? T.k12 : cnt >= 3 ? T.k13 : cnt >= 2 ? T.k14 : T.k15;
  const mScore = (tot) => tot >= T.k16 ? T.k2 : tot >= T.k17 ? T.k4 : tot >= T.k18 ? T.k19 : tot >= T.k20 ? T.k21 : tot >= T.k14 ? T.k22 : T.k9;
  const days = scan.last ? dayDiff(scan.last, todayIso) : T.k23;
  const r = rScore(days), f = fScore(scan.count), m = mScore(scan.ils);
  return { r, f, m, score: r + f + m, rPct: Math.round((r / T.k2) * T.k14), fPct: Math.round((f / T.k11) * T.k14), mPct: Math.round((m / T.k2) * T.k14) };
}
