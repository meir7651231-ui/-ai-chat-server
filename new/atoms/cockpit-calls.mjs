/** חוט · cockpit-calls — Golden. חוזה: cockpit-calls.contract.md
 * מוצא: cockpit.ts:84 (cockpitCalls) + valueTag:56 (inline) + COCKPIT_SILENT_DAYS=60 (inline). חוק-4 verbatim.
 * שיחות מומלצות = יעד-קשר שעבר ∪ בסיכון-נטישה. כל תורם פעם-אחת. ממוין לפי sort יורד.
 * שקעים: supIls, supUsd, supLast (Genesis) · daysSince, cockpitAtRisk (אחים cockpit).
 */
export function cockpitCalls(supporters, todayIso, rate = 3.7, silentDays = 60, { supIls, supUsd, supLast, daysSince, cockpitAtRisk }) {
  const valueTag = (sp) => {
    const ils = supIls(sp) + supUsd(sp) * rate;
    if (ils >= 5000) return 'תורם/ת מרכזי/ת';
    if (ils >= 1000) return 'תורם/ת מהותי/ת';
    return 'תורם/ת';
  };
  const tasks = [];
  const seen = new Set();
  for (const sp of supporters) {
    if (!sp.nextDate || sp.nextDate > todayIso) continue;
    const late = daysSince(sp.nextDate, todayIso);
    tasks.push({ id: 'call:' + sp.id, kind: 'call', supId: sp.id, name: sp.name, phone: sp.phone || '', email: sp.email || '', reason: late <= 0 ? 'יעד-קשר להיום' : 'יעד-קשר עבר לפני ' + late + ' יום', severity: 'due', sort: 1_000_000 + late });
    seen.add(sp.id);
  }
  for (const sp of cockpitAtRisk(supporters, todayIso, silentDays)) {
    if (seen.has(sp.id)) continue;
    const silent = daysSince(supLast(sp), todayIso);
    tasks.push({ id: 'call:' + sp.id, kind: 'call', supId: sp.id, name: sp.name, phone: sp.phone || '', email: sp.email || '', reason: valueTag(sp) + ' · שקט/ה ' + silent + ' יום', severity: 'risk', sort: silent });
    seen.add(sp.id);
  }
  return tasks.sort((a, b) => b.sort - a.sort);
}
