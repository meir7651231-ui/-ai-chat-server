/** חוט · cockpit-progress — Golden. חוזה: cockpit-progress.contract.md
 * מוצא: cockpit.ts:263 (cockpitProgress). טהור. חוק-4 verbatim.
 * התקדמות-היום מול קבוצת-מזהים-שטופלה. queue={tasks:[{id,...}]}, doneIds=Set/בעל-has.
 */
export function cockpitProgress(queue, doneIds) {
  let done = 0;
  for (const t of queue.tasks) if (doneIds.has(t.id)) done++;
  return { done, total: queue.total };
}
