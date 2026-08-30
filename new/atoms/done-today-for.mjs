/** חוט · done-today-for — כמה משימות נסגרו היום ע"י עובד/ת. חוזה: done-today-for.contract.md
 *  חולץ מ-maor/src/lib/worktasks.ts:28-31 · שקע: taskIdentity (היה שכן באותו קובץ). */
export function doneTodayFor(tasks, identity, todayIso, taskIdentity, T) {
    const me = taskIdentity(identity);
    return tasks.filter((t) => taskIdentity(t.assignee) === me && (t.doneAt ?? '').slice(0, T.k1) === todayIso).length;
}
