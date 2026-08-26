/** חוט · cockpit-kpis — Golden. חוזה: cockpit-kpis.contract.md
 * מוצא: cockpit.ts:227 (cockpitKpis). חוק-4 verbatim. ארבעת מדדי-הראש.
 * שקעים: cockpitCollectedThisMonth, cockpitAtRisk (אחים) · hokMonthlyTotal (Genesis).
 */
export function cockpitKpis(supporters, todayIso, rate = 3.7, { cockpitCollectedThisMonth, hokMonthlyTotal, cockpitAtRisk }) {
  return {
    total: supporters.length,
    collected: cockpitCollectedThisMonth(supporters, todayIso, rate),
    expectedHok: hokMonthlyTotal(supporters, rate),
    atRisk: cockpitAtRisk(supporters, todayIso).length,
  };
}
