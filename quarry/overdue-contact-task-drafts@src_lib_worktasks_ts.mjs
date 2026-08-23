/** 🪨 טיוטת-חוט (דרגת-מחצבה) · overdueContactTaskDrafts — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/worktasks.ts:72-94 (23 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): overdueContactTaskDrafts, taskIdentity
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function overdueContactTaskDrafts(supporters, existing, assignee, todayIso) {
    const me = taskIdentity(assignee);
    const already = new Set(existing
        .filter((t) => !t.doneAt && taskIdentity(t.assignee) === me && t.ref?.kind === 'supporter')
        .map((t) => t.ref.id));
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
