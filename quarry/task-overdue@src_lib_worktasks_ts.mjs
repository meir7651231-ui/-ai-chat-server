/** 🪨 טיוטת-חוט (דרגת-מחצבה) · taskOverdue — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/worktasks.ts:34-44 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): taskOverdue
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function taskOverdue(t, todayIso) {
    return !t.doneAt && !!t.due && t.due < todayIso;
}
