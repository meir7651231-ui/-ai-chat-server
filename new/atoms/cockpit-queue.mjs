/** חוט · cockpit-queue — Golden. חוזה: cockpit-queue.contract.md
 * מוצא: cockpit.ts:250 (cockpitQueue). חוק-4 verbatim. שלוש קבוצות + רשימה-מאוחדת + מונה.
 * שקעים: cockpitCalls, cockpitThanks, cockpitHokTasks (אחים cockpit).
 */
export function cockpitQueue(supporters, todayIso, rate = 3.7, { cockpitCalls, cockpitThanks, cockpitHokTasks }) {
  const calls = cockpitCalls(supporters, todayIso, rate);
  const thanks = cockpitThanks(supporters, todayIso);
  const hok = cockpitHokTasks(supporters, todayIso);
  const tasks = [...calls, ...thanks, ...hok];
  return { calls, thanks, hok, tasks, total: tasks.length };
}
