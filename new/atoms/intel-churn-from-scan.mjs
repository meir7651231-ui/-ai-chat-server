/** חוט · intel-churn-from-scan — Golden. חוזה: intel-churn-from-scan.contract.md
 * מוצא: intel.ts:111 (churnFromScan). חוק-4 verbatim. סיכון-נטישה 0–100 מול קצב אישי. שקע: dayDiff (אח).
 */
export function churnFromScan(scan, todayIso, { dayDiff }, T) {
  if (scan.count === 0 || !scan.last) return 0;
  const daysSince = dayDiff(scan.last, todayIso);
  const span = scan.first && scan.first !== scan.last ? dayDiff(scan.first, scan.last) : 0;
  const cadence = scan.count >= 2 && span > 0 ? span / (scan.count - 1) : T.k1;
  const expected = Math.max(T.k2, cadence * 1.5);
  const ratio = daysSince / expected;
  return Math.max(0, Math.min(T.k3, Math.round(ratio * T.k4)));
}
