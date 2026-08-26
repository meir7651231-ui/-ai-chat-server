/** חוט · cockpit-hok-tasks — Golden. חוזה: cockpit-hok-tasks.contract.md
 * מוצא: cockpit.ts:180 (cockpitHokTasks). חוק-4 verbatim. עוטף hokDue הקיים כתור-פעולה.
 * שקע: hokDue (אטום-Genesis).
 */
export function cockpitHokTasks(supporters, todayIso, { hokDue }) {
  return hokDue(supporters, todayIso).map((sp) => {
    const hok = sp.hok;
    const money = hok.cur === '$' ? '$' + hok.amount.toLocaleString('en-US') : '₪' + hok.amount.toLocaleString('he-IL');
    return { id: 'hok:' + sp.id, kind: 'hok', supId: sp.id, name: sp.name, phone: sp.phone || '', email: sp.email || '', reason: 'הו״ק ' + money + ' · יום ' + hok.day + ' — טרם נרשם החודש', severity: 'due', sort: 100 - (hok.day || 0) };
  });
}
