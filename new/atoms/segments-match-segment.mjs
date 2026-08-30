/** חוט · segments-match-segment — Golden. חוזה: segments-match-segment.contract.md
 * מוצא: segments.ts:104 (matchSegment) + SEGMENTS:32 + totalIls:23 + ספים (inline). חוק-4 verbatim.
 * פרדיקט-סגמנט בודד. 'atrisk' עוטף cockpitAtRisk. שקעים כמו segment-counts.
 */
export function matchSegment(sp, key, supporters, todayIso, rate = 3.7, { cockpitAtRisk, supIls, supUsd, supLast, daysSince }, T) {
  const GOLD_ILS = 5000, GOLD_SILENT = 60;
  const totalIls = (s) => supIls(s) + supUsd(s) * rate;
  const SEGMENTS = [
    { key: T.k1, match: () => false },
    { key: T.k2, match: (s, today) => totalIls(s) >= GOLD_ILS && daysSince(supLast(s), today) >= GOLD_SILENT },
    { key: T.k3, match: (s) => s.hok?.active === true },
    { key: T.k4, match: (s, today) => { const last = supLast(s); return !!last && daysSince(last, today) <= 365; } },
    { key: T.k5, match: (s) => !s.email },
  ];
  if (key === T.k1) return cockpitAtRisk(supporters, todayIso).some((s) => s.id === sp.id);
  const def = SEGMENTS.find((s) => s.key === key);
  return def ? def.match(sp, todayIso, rate) : false;
}
