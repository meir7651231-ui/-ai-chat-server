/** חוט · portfolio-tier-trend-counts — Golden. חוזה: portfolio-tier-trend-counts.contract.md
 * מוצא: portfolio.ts:116 (tierTrendCounts). חוק-4 verbatim. פרוקסי-מגמה פר-דרגה.
 * שקעים (מבונים): donorScan,rfmFromScan,trendFromScan (intel) · supTier (Genesis).
 */
export function tierTrendCounts(supporters, todayIso, rate = 3.7, { donorScan, rfmFromScan, trendFromScan, supTier }, order, T) {
  const map = new Map(order.map((t) => [t, { tier: t, total: 0, rising: 0, falling: 0, stable: 0 }]));
  for (const sp of supporters) {
    const scan = donorScan(sp, todayIso, rate, 12);
    if (scan.count === 0) continue;
    const tier = supTier(rfmFromScan(scan, todayIso).score).label;
    const row = map.get(tier);
    if (!row) continue;
    row.total++;
    const d = trendFromScan(scan).dir;
    if (d === 'up') row.rising++;
    else if (d === T.k1) row.falling++;
    else row.stable++;
  }
  return order.map((t) => map.get(t));
}
