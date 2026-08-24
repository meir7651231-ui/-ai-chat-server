/** חוט · open-tasks-for — המשימות הפתוחות של עובד/ת, ממוינות עדיפות⇒יעד⇒יצירה.
 *  חוזה: open-tasks-for.contract.md · שקע: taskIdentity
 *  חולץ כלשונו מ-maor/src/lib/worktasks.ts:15-27; השכן taskIdentity הוזרק
 *  כשקע (חוק-1 — אפס import פנימי). */
export function openTasksFor(tasks, identity, taskIdentity) {
  const me = taskIdentity(identity);
  return tasks
    .filter((t) => !t.doneAt && taskIdentity(t.assignee) === me)
    .sort(
      (a, b) =>
        a.pri - b.pri ||
        (a.due || '9999').localeCompare(b.due || '9999') ||
        a.createdAt.localeCompare(b.createdAt),
    );
}
