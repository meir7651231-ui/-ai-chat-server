/** חוט · overdue-contact-task-drafts — תורמים שעבר-יעד-הקשר ⇒ טיוטות-משימה עם דדופ.
 *  חוזה: overdue-contact-task-drafts.contract.md
 *  חולץ כלשונו מ-maor/src/lib/worktasks.ts:72-94; השכן taskIdentity הוזרק
 *  כשקע (חוק-1 — אפס import פנימי). */
export function overdueContactTaskDrafts(supporters, existing, assignee, todayIso, taskIdentity) {
  const me = taskIdentity(assignee);
  const already = new Set(
    existing
      .filter((t) => !t.doneAt && taskIdentity(t.assignee) === me && t.ref?.kind === 'supporter')
      .map((t) => t.ref.id),
  );
  return supporters
    .filter((sp) => sp.nextDate && sp.nextDate <= todayIso && !already.has(sp.id))
    .map((sp) => ({
      assignee: me,
      title: '📞 להתקשר — ' + sp.name,
      ref: { kind: 'supporter', id: sp.id },
      pri: 1,
      due: todayIso,
    }));
}
