/** חוט · cockpit-work-list-text — Golden. חוזה: cockpit-work-list-text.contract.md
 * מוצא: cockpit.ts:289 (cockpitWorkListText) + KIND_ICON:278 (הוטבע inline). טהור. חוק-4 verbatim.
 * רשימת-המשימות כטקסט (שורה למשימה) — להעתקה/שיתוף.
 */
export function cockpitWorkListText(queue, T) {
  const KIND_ICON = { call: T.k1, thanks: T.k2, hok: T.k3 };
  return queue.tasks
    .map((t) => KIND_ICON[t.kind] + ' · ' + (t.name || T.k4) + (t.phone ? ' · ' + t.phone : '') + ' — ' + t.reason)
    .join('\n');
}
