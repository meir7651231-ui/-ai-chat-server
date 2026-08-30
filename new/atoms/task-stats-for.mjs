/** חוט · task-stats-for — סטטיסטיקת-מנהל פר-עובד/ת: פתוחות/באיחור/בוצעו/בוצעו-השבוע.
 *  חוזה: task-stats-for.contract.md
 *  חולץ כלשונו מ-maor/src/lib/worktasks.ts:45-64; השכנים taskIdentity ו-taskOverdue
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function taskStatsFor(tasks, identity, todayIso, taskIdentity, taskOverdue, T) {
  const me = taskIdentity(identity);
  const mine = tasks.filter((t) => taskIdentity(t.assignee) === me);
  const t0 = new Date(todayIso + 'T12:00:00').getTime();
  let open = 0, overdue = 0, done = 0, doneWeek = 0;
  for (const t of mine) {
    if (!t.doneAt) {
      open++;
      if (taskOverdue(t, todayIso)) overdue++;
    } else {
      done++;
      const d = new Date((t.doneAt ?? '').slice(0, T.k1) + 'T12:00:00').getTime();
      const diff = (t0 - d) / T.k2;
      if (diff >= 0 && diff < 7) doneWeek++;
    }
  }
  return { open, overdue, done, doneWeek };
}
