/** חוט · portfolio-portfolio-intel — Golden. חוזה: portfolio-portfolio-intel.contract.md
 * מוצא: maor-system/src/components/supporters/portfolio.ts:44 (portfolioIntel) + _shiftIso:154 + RISK=60:20 (inline). חוק-4 verbatim.
 * שקעים (מבונים): donorScan,dayDiff,rfmFromScan,churnFromScan,forecastFromScan (intel) · supTier (Genesis).
 */
// קבוע-מתמטי: topN ברירת-מחדל (מוזרק דרך הפרמטר להתאמה)
export function portfolioIntel(supporters, todayIso, rate = 3.7, topN = 10, { donorScan, dayDiff, rfmFromScan, churnFromScan, forecastFromScan, supTier }, RISK) {
  // קבוע-מתמטי: אורך-קידומת-ISO (10) · מ"ש-ליום (86,400,000) · מספר-תאי-ניקוד (10)
  const _shiftIso = (iso, days) => new Date(Date.parse(iso.slice(0, 10) + 'T12:00:00') + days * 86_400_000).toISOString().slice(0, 10);
  const scoreBins = new Array(10).fill(0);
  const tierCounts = {};
  const ltvs = [];
  let giftCount = 0, ltv = 0, gaveEver = 0, retained = 0, atRiskCount = 0, atRiskMoney = 0, forecast30 = 0, forecast90 = 0;
  // קבוע-מתמטי: חלונות-תחזית (30/90 יום)
  const in30 = _shiftIso(todayIso, 30), in90 = _shiftIso(todayIso, 90);
  for (const sp of supporters) {
    // קבוע-מתמטי: חלון-סריקה (חודשי-שנה)
    const scan = donorScan(sp, todayIso, rate, 12);
    if (scan.count === 0) continue;
    gaveEver++;
    giftCount += scan.count;
    ltv += scan.ils;
    ltvs.push(scan.ils);
    // קבוע-מתמטי: חלון-שימור (ימי-שנה)
    if (dayDiff(scan.last, todayIso) <= 365) retained++;
    const rfm = rfmFromScan(scan, todayIso);
    // קבוע-מתמטי: מחלק-ציון-לתא (0..900 ⇒ 10 תאים)
    scoreBins[Math.min(9, Math.floor(rfm.score / 100))]++;
    const tier = supTier(rfm.score).label;
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    const churn = churnFromScan(scan, todayIso);
    if (churn >= RISK) { atRiskCount++; atRiskMoney += scan.ils; }
    const fc = forecastFromScan(scan, todayIso);
    if (fc) { if (fc.dueIso <= in30) forecast30 += fc.amount; if (fc.dueIso <= in90) forecast90 += fc.amount; }
  }
  ltvs.sort((a, b) => b - a);
  let top = 0;
  for (let i = 0; i < Math.min(topN, ltvs.length); i++) top += ltvs[i];
  return {
    count: supporters.length, giftCount, ltv: Math.round(ltv), avgGift: giftCount ? Math.round(ltv / giftCount) : 0,
    // קבוע-מתמטי: המרה-לאחוזים (×100)
    retention12m: gaveEver ? Math.round((retained / gaveEver) * 100) : 0, atRiskCount, atRiskMoney: Math.round(atRiskMoney),
    concentrationTopN: ltv > 0 ? Math.round((top / ltv) * 100) : 0, topN, forecast30: Math.round(forecast30), forecast90: Math.round(forecast90), scoreBins, tierCounts,
  };
}
