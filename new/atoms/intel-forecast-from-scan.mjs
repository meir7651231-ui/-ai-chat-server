/** חוט · intel-forecast-from-scan — Golden. חוזה: intel-forecast-from-scan.contract.md
 * מוצא: intel.ts:131 (forecastFromScan) + MS_DAY:13 (inline). חוק-4 verbatim. שקע: dayDiff (אח).
 * ⚠️ תלוי-שעון-מערכת: Date.parse('..T12:00:00')=צהריים-מקומי; toISOString=UTC. דטרמיניסטי ב-UTC.
 */
export function forecastFromScan(scan, todayIso, { dayDiff }) {
  const MS_DAY = 86_400_000;
  if (scan.count === 0 || !scan.last) return null;
  const avg = Math.round(scan.ils / scan.count);
  const span = scan.first && scan.first !== scan.last ? dayDiff(scan.first, scan.last) : 0;
  const cadence = scan.count >= 2 && span > 0 ? span / (scan.count - 1) : 365;
  const lastMs = Date.parse(scan.last.slice(0, 10) + 'T12:00:00');
  const dueMs = lastMs + cadence * MS_DAY;
  const dueIso = new Date(dueMs).toISOString().slice(0, 10);
  const daysSince = dayDiff(scan.last, todayIso);
  const overdue = cadence > 0 ? Math.max(0, daysSince / cadence - 1) : 0;
  const confidence = Math.max(15, Math.min(92, Math.round(30 + scan.count * 7 - overdue * 25)));
  return { amount: avg, dueIso, confidence };
}
