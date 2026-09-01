/** חוט · cockpit-calls — Golden. חוזה: cockpit-calls.contract.md
 * מוצא: cockpit.ts:84 (cockpitCalls) + valueTag:56 (inline) + COCKPIT_SILENT_DAYS=60 (inline). חוק-4 verbatim.
 * שיחות מומלצות = יעד-קשר שעבר ∪ בסיכון-נטישה. כל תורם פעם-אחת. ממוין לפי sort יורד.
 * שקעים: supIls, supUsd, supLast (Genesis) · daysSince, cockpitAtRisk (אחים cockpit).
 */
// קבוע-מתמטי: חלון-שתיקה ברירת-מחדל (ימים) — ההתאמה עוברת דרך silentDays המוזרק
export function cockpitCalls(supporters, todayIso, rate = 3.7, silentDays = 60, { supIls, supUsd, supLast, daysSince, cockpitAtRisk }, T) {
  const valueTag = (sp) => {
    const ils = supIls(sp) + supUsd(sp) * rate;
    if (ils >= T.k12) return T.k1;
    if (ils >= T.k13) return T.k2;
    return T.k3;
  };
  const tasks = [];
  const seen = new Set();
  for (const sp of supporters) {
    if (!sp.nextDate || sp.nextDate > todayIso) continue;
    const late = daysSince(sp.nextDate, todayIso);
    tasks.push({ id: T.k4 + sp.id, kind: T.k5, supId: sp.id, name: sp.name, phone: sp.phone || '', email: sp.email || '', reason: late <= 0 ? T.k6 : T.k7 + late + T.k8, severity: T.k9, sort: T.k14 + late });
    seen.add(sp.id);
  }
  for (const sp of cockpitAtRisk(supporters, todayIso, silentDays)) {
    if (seen.has(sp.id)) continue;
    const silent = daysSince(supLast(sp), todayIso);
    tasks.push({ id: T.k4 + sp.id, kind: T.k5, supId: sp.id, name: sp.name, phone: sp.phone || '', email: sp.email || '', reason: valueTag(sp) + T.k10 + silent + T.k8, severity: T.k11, sort: silent });
    seen.add(sp.id);
  }
  return tasks.sort((a, b) => b.sort - a.sort);
}
