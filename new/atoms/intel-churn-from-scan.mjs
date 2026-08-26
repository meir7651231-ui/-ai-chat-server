/** חוט · intel-churn-from-scan — Golden. חוזה: intel-churn-from-scan.contract.md
 * מוצא: intel.ts:111 (churnFromScan). חוק-4 verbatim. סיכון-נטישה 0–100 מול קצב אישי. שקע: dayDiff (אח).
 */
export function churnFromScan(scan, todayIso, { dayDiff }) {
  if (scan.count === 0 || !scan.last) return 0;
  const daysSince = dayDiff(scan.last, todayIso);
  const span = scan.first && scan.first !== scan.last ? dayDiff(scan.first, scan.last) : 0;
  const cadence = scan.count >= 2 && span > 0 ? span / (scan.count - 1) : 365;
  const expected = Math.max(30, cadence * 1.5);
  const ratio = daysSince / expected;
  return Math.max(0, Math.min(100, Math.round(ratio * 50)));
}
