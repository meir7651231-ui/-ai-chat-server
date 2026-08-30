/** חוט · commands-build-commands — Golden. חוזה: commands-build-commands.contract.md
 * מוצא: maor-system/src/components/supporters/commands.ts:50 (buildCommands) + norm:45 (inline). חוק-4 verbatim.
 * בונה רשימת-פקודות לפי ההקשר (דגלים) + כרטיס-לכל-תורם. טהור, אפס-שקעים.
 */
export function buildCommands(ctx, T) {
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const out = [];
  const push = (c) => out.push({ ...c, keywords: norm(c.label + ' ' + c.keywords) });
  push({ id: T.k1, kind: T.k2, label: T.k3 + ctx.supporterTerm, group: T.k4, keywords: T.k5 });
  if (ctx.cockpitOn) {
    push({ id: T.k6, kind: T.k7, label: T.k8, group: T.k9, keywords: T.k10 });
    push({ id: T.k11, kind: T.k12, label: T.k13, group: T.k9, keywords: T.k14 });
  }
  if (ctx.importOn) push({ id: T.k15, kind: T.k16, label: T.k17, group: T.k4, keywords: T.k18 });
  if (ctx.customReportOn) push({ id: T.k19, kind: T.k20, label: T.k21, group: T.k4, keywords: T.k22 });
  if (ctx.dedupCount > 0) push({ id: T.k23, kind: T.k24, label: T.k25 + ctx.dedupCount, group: T.k4, keywords: T.k26 });
  if (ctx.paymentsOn) {
    push({ id: T.k27, kind: T.k28, label: T.k29, group: T.k4, keywords: T.k30 });
    push({ id: T.k31, kind: T.k32, label: T.k33, group: T.k4, keywords: T.k34 });
  }
  for (const sp of ctx.supporters) {
    push({ id: T.k35 + sp.id, kind: T.k36, arg: sp.id, label: sp.name || T.k37, hint: T.k38, group: T.k39, keywords: (sp.name || '') + ' ' + (sp.phone || '') });
  }
  return out;
}
