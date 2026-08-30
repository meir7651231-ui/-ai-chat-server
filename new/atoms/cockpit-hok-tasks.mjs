/** חוט · cockpit-hok-tasks — Golden. חוזה: cockpit-hok-tasks.contract.md
 * מוצא: cockpit.ts:180 (cockpitHokTasks). חוק-4 verbatim. עוטף hokDue הקיים כתור-פעולה.
 * שקע: hokDue (אטום-Genesis).
 */
export function cockpitHokTasks(supporters, todayIso, { hokDue }, T) {
  return hokDue(supporters, todayIso).map((sp) => {
    const hok = sp.hok;
    const money = hok.cur === '$' ? '$' + hok.amount.toLocaleString('en-US') : '₪' + hok.amount.toLocaleString('he-IL');
    return { id: T.k1 + sp.id, kind: T.k2, supId: sp.id, name: sp.name, phone: sp.phone || '', email: sp.email || '', reason: T.k3 + money + T.k4 + hok.day + T.k5, severity: T.k6, sort: T.k7 - (hok.day || 0) };
  });
}
