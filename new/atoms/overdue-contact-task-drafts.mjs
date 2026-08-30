/** חוט · overdue-contact-task-drafts — תורמים שעבר-יעד-הקשר ⇒ טיוטות-משימה עם דדופ.
 *  חוזה: overdue-contact-task-drafts.contract.md
 *  חולץ כלשונו מ-maor/src/lib/worktasks.ts:72-94; השכן taskIdentity הוזרק
 *  כשקע (חוק-1 — אפס import פנימי). */
export function overdueContactTaskDrafts(supporters, existing, assignee, todayIso, taskIdentity, T) {
  const me = taskIdentity(assignee);
  const already = new Set(
    existing
      .filter((t) => !t.doneAt && taskIdentity(t.assignee) === me && t.ref?.kind === T.k1)
      .map((t) => t.ref.id),
  );
  return supporters
    .filter((sp) => sp.nextDate && sp.nextDate <= todayIso && !already.has(sp.id))
    .map((sp) => ({
      assignee: me,
      title: T.k2 + sp.name,
      ref: { kind: T.k1, id: sp.id },
      pri: 1,
      due: todayIso,
    }));
}
