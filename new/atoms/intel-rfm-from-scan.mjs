/** חוט · intel-rfm-from-scan — Golden. חוזה: intel-rfm-from-scan.contract.md
 * מוצא: intel.ts:95 (rfmFromScan) + rScore/fScore/mScore:73-81 (inline, ספי supScore verbatim). חוק-4.
 * שקע: dayDiff (אח intel).
 */
export function rfmFromScan(scan, todayIso, { dayDiff }) {
  const rScore = (days) => days <= 30 ? 350 : days <= 90 ? 280 : days <= 180 ? 200 : days <= 365 ? 120 : 40;
  const fScore = (cnt) => cnt >= 10 ? 300 : cnt >= 5 ? 230 : cnt >= 3 ? 160 : cnt >= 2 ? 100 : 50;
  const mScore = (tot) => tot >= 5000 ? 350 : tot >= 2000 ? 280 : tot >= 1000 ? 210 : tot >= 500 ? 140 : tot >= 100 ? 80 : 40;
  const days = scan.last ? dayDiff(scan.last, todayIso) : 99999;
  const r = rScore(days), f = fScore(scan.count), m = mScore(scan.ils);
  return { r, f, m, score: r + f + m, rPct: Math.round((r / 350) * 100), fPct: Math.round((f / 300) * 100), mPct: Math.round((m / 350) * 100) };
}
