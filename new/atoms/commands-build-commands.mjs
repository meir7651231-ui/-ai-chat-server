/** חוט · commands-build-commands — Golden. חוזה: commands-build-commands.contract.md
 * מוצא: maor-system/src/components/supporters/commands.ts:50 (buildCommands) + norm:45 (inline). חוק-4 verbatim.
 * בונה רשימת-פקודות לפי ההקשר (דגלים) + כרטיס-לכל-תורם. טהור, אפס-שקעים.
 */
export function buildCommands(ctx) {
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const out = [];
  const push = (c) => out.push({ ...c, keywords: norm(c.label + ' ' + c.keywords) });
  push({ id: 'cmd:add', kind: 'add', label: '➕ הוספת ' + ctx.supporterTerm, group: 'פעולה', keywords: 'הוספה חדש חדשה תורם add new' });
  if (ctx.cockpitOn) {
    push({ id: 'cmd:work', kind: 'work', label: '🎯 חלון העבודה', group: 'ניווט', keywords: 'קוקפיט משימות עבודה היום cockpit' });
    push({ id: 'cmd:data', kind: 'data', label: '☰ מסך הנתונים', group: 'ניווט', keywords: 'טבלה נתונים רשימה סינון data' });
  }
  if (ctx.importOn) push({ id: 'cmd:import', kind: 'import', label: '⬆ ייבוא מקובץ CSV', group: 'פעולה', keywords: 'ייבוא csv excel קובץ import' });
  if (ctx.customReportOn) push({ id: 'cmd:customreport', kind: 'customreport', label: '📊 דו״ח מותאם', group: 'פעולה', keywords: 'דוח מותאם ייצוא טווח report export' });
  if (ctx.dedupCount > 0) push({ id: 'cmd:dedup', kind: 'dedup', label: '🔗 איחוד כפולים · ' + ctx.dedupCount, group: 'פעולה', keywords: 'כפולים מיזוג איחוד dedup merge' });
  if (ctx.paymentsOn) {
    push({ id: 'cmd:incoming', kind: 'incoming', label: '💰 תשלומים נכנסים', group: 'פעולה', keywords: 'תשלומים נכנסים סליקה payments' });
    push({ id: 'cmd:nedarim', kind: 'nedarim', label: '🔄 סנכרון מנדרים', group: 'פעולה', keywords: 'נדרים סנכרון nedarim sync' });
  }
  for (const sp of ctx.supporters) {
    push({ id: 'donor:' + sp.id, kind: 'openDonor', arg: sp.id, label: sp.name || 'ללא שם', hint: 'פתיחת כרטיס', group: 'תורם', keywords: (sp.name || '') + ' ' + (sp.phone || '') });
  }
  return out;
}
