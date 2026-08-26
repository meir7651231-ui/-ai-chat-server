/** חוט · segments-segment-counts — Golden. חוזה: segments-segment-counts.contract.md
 * מוצא: maor-system/src/components/supporters/segments.ts:86 (segmentCounts) + SEGMENTS:32 + totalIls:23 + ספים:28-30 (inline). חוק-4 verbatim.
 * שקעים: cockpitAtRisk (אח cockpit) · supIls,supUsd,supLast (Genesis) · daysSince (אח cockpit).
 */
export function segmentCounts(supporters, todayIso, rate = 3.7, { cockpitAtRisk, supIls, supUsd, supLast, daysSince }) {
  const GOLD_ILS = 5000, GOLD_SILENT = 60;
  const totalIls = (sp) => supIls(sp) + supUsd(sp) * rate;
  const SEGMENTS = [
    { key: 'atrisk', label: 'בסיכון נטישה', dot: '#b45309', match: () => false },
    { key: 'goldsilent', label: 'זהב · שקטים 60+ יום', dot: '#a05008', match: (sp, today) => totalIls(sp) >= GOLD_ILS && daysSince(supLast(sp), today) >= GOLD_SILENT },
    { key: 'hok', label: 'הו״ק פעילות', dot: '#2e7d32', match: (sp) => sp.hok?.active === true },
    { key: 'gave12m', label: 'תרמו ב-12 החודשים', dot: '#1d4ed8', match: (sp, today) => { const last = supLast(sp); return !!last && daysSince(last, today) <= 365; } },
    { key: 'noemail', label: 'ללא אימייל', dot: '#8a8172', match: (sp) => !sp.email },
  ];
  const atRiskCount = cockpitAtRisk(supporters, todayIso).length;
  return SEGMENTS.map((seg) => ({ key: seg.key, label: seg.label, dot: seg.dot, count: seg.key === 'atrisk' ? atRiskCount : supporters.reduce((n, sp) => n + (seg.match(sp, todayIso, rate) ? 1 : 0), 0) }));
}
