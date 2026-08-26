/** חוט · cockpit-work-list-text — Golden. חוזה: cockpit-work-list-text.contract.md
 * מוצא: cockpit.ts:289 (cockpitWorkListText) + KIND_ICON:278 (הוטבע inline). טהור. חוק-4 verbatim.
 * רשימת-המשימות כטקסט (שורה למשימה) — להעתקה/שיתוף.
 */
export function cockpitWorkListText(queue) {
  const KIND_ICON = { call: '📞 שיחה', thanks: '💛 תודה', hok: '🔁 הו״ק' };
  return queue.tasks
    .map((t) => KIND_ICON[t.kind] + ' · ' + (t.name || 'ללא שם') + (t.phone ? ' · ' + t.phone : '') + ' — ' + t.reason)
    .join('\n');
}
