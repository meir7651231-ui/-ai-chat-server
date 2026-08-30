/** חוט · portfolio-active-by-month — Golden. חוזה: portfolio-active-by-month.contract.md
 * מוצא: portfolio.ts:139 (activeByMonth). חוק-4 verbatim. מונה-פעילים פר-חודש. שקע: donorScan (intel).
 */
export function activeByMonth(supporters, todayIso, months , rate = 3.7, { donorScan }, T) {
  if (months === undefined) months = T.k1;
  const out = new Array(months).fill(0);
  for (const sp of supporters) {
    const scan = donorScan(sp, todayIso, rate, months);
    for (let i = 0; i < months; i++) if (scan.monthly[i] > 0) out[i]++;
  }
  return out;
}
