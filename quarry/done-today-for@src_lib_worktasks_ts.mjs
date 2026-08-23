/** 🪨 טיוטת-חוט (דרגת-מחצבה) · doneTodayFor — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/worktasks.ts:28-33 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): doneTodayFor, taskIdentity
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function doneTodayFor(tasks, identity, todayIso) {
    const me = taskIdentity(identity);
    return tasks.filter((t) => taskIdentity(t.assignee) === me && (t.doneAt ?? '').slice(0, 10) === todayIso).length;
}
/** האם משימה באיחור — יש יעד והוא לפני היום, והיא עוד פתוחה. */
