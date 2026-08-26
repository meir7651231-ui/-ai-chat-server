/** חוט · constellation-donor-constellation — Golden. חוזה: constellation-donor-constellation.contract.md
 * מוצא: maor-system/src/components/supporters/constellation.ts:54 (donorConstellation) + hash01:32 + radiusFor:39 + TIER_KEY:14 (inline). חוק-4 verbatim.
 * שקעים (מבונים): donorScan,dayDiff,rfmFromScan,churnFromScan (intel) · supTier (Genesis).
 */
export function donorConstellation(supporters, todayIso, opts = {}, { donorScan, dayDiff, rfmFromScan, churnFromScan, supTier }) {
  const TIER_KEY = { 'זהב': 'gold', 'כסף': 'silver', 'ארד': 'bronze', 'רדומה': 'dormant' };
  const hash01 = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; };
  const radiusFor = (daysSince, jitter) => { const base = daysSince <= 30 ? 0.30 : daysSince <= 90 ? 0.45 : daysSince <= 180 ? 0.60 : daysSince <= 365 ? 0.75 : 0.9; return Math.max(0.18, Math.min(0.98, base + (jitter - 0.5) * 0.1)); };
  const rate = opts.rate ?? 3.7;
  const riskT = opts.riskThreshold ?? 60;
  const raw = [];
  let maxLog = 0;
  for (const sp of supporters) {
    const scan = donorScan(sp, todayIso, rate, 12);
    if (scan.count === 0) continue;
    const days = dayDiff(scan.last, todayIso);
    const tier = TIER_KEY[supTier(rfmFromScan(scan, todayIso).score).label] ?? 'dormant';
    const churn = churnFromScan(scan, todayIso);
    const lg = Math.log10(scan.ils + 1);
    if (lg > maxLog) maxLog = lg;
    raw.push({ sp, ils: scan.ils, days, tier, churn });
  }
  return raw.map((r) => ({
    id: r.sp.id, name: r.sp.name, angle: hash01(r.sp.id), radius: radiusFor(r.days, hash01(r.sp.id + '#r')),
    size: maxLog > 0 ? Math.max(0.15, Math.min(1, Math.log10(r.ils + 1) / maxLog)) : 0.15,
    tier: r.tier, atRisk: r.churn >= riskT, val: Math.round(r.ils), churn: r.churn,
  }));
}
