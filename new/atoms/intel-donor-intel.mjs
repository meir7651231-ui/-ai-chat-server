/** חוט · intel-donor-intel — Golden. חוזה: intel-donor-intel.contract.md
 * מוצא: intel.ts:179 (donorIntel). חוק-4 verbatim. כל המודיעין במעבר-יחיד + נגזרות.
 * שקעים (אחים intel): donorScan, rfmFromScan, churnFromScan, forecastFromScan, trendFromScan.
 */
export function donorIntel(sp, todayIso, rate = 3.7, months , { donorScan, rfmFromScan, churnFromScan, forecastFromScan, trendFromScan }, T) {
  if (months === undefined) months = T.k1;
  const scan = donorScan(sp, todayIso, rate, months);
  return {
    scan,
    rfm: rfmFromScan(scan, todayIso),
    churn: churnFromScan(scan, todayIso),
    forecast: forecastFromScan(scan, todayIso),
    trend: trendFromScan(scan),
    ltv: Math.round(scan.ils),
    avgGift: scan.count ? Math.round(scan.ils / scan.count) : 0,
  };
}
