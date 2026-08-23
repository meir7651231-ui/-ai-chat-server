/** 🪨 טיוטת-חוט (דרגת-מחצבה) · openTasksFor — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/worktasks.ts:15-27 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): openTasksFor, taskIdentity
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function openTasksFor(tasks, identity) {
    const me = taskIdentity(identity);
    return tasks
        .filter((t) => !t.doneAt && taskIdentity(t.assignee) === me)
        .sort((a, b) => a.pri - b.pri ||
        (a.due || '9999').localeCompare(b.due || '9999') ||
        a.createdAt.localeCompare(b.createdAt));
}
/** המשימות שבוצעו היום ע"י עובד/ת (לחיווי "כמה סגרת היום"). */
