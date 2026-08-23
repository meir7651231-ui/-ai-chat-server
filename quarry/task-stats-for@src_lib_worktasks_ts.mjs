/** 🪨 טיוטת-חוט (דרגת-מחצבה) · taskStatsFor — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/worktasks.ts:45-64 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): taskStatsFor, taskIdentity, getTime, taskOverdue
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function taskStatsFor(tasks, identity, todayIso) {
    const me = taskIdentity(identity);
    const mine = tasks.filter((t) => taskIdentity(t.assignee) === me);
    const t0 = new Date(todayIso + 'T12:00:00').getTime();
    let open = 0, overdue = 0, done = 0, doneWeek = 0;
    for (const t of mine) {
        if (!t.doneAt) {
            open++;
            if (taskOverdue(t, todayIso))
                overdue++;
        }
        else {
            done++;
            const d = new Date((t.doneAt ?? '').slice(0, 10) + 'T12:00:00').getTime();
            const diff = (t0 - d) / 86400000;
            if (diff >= 0 && diff < 7)
                doneWeek++;
        }
    }
    return { open, overdue, done, doneWeek };
}
/** תוויות-עדיפות לתצוגה. */
