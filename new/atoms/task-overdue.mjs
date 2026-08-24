/** חוט · task-overdue — האם משימה באיחור: יש due לפני-היום והיא עוד פתוחה.
 *  חוזה: task-overdue.contract.md
 *  חולץ כלשונו מ-maor/src/lib/worktasks.ts:34-36. אפס import פנימי. */
export function taskOverdue(t, todayIso) {
  return !t.doneAt && !!t.due && t.due < todayIso;
}
