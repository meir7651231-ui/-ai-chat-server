/** 🪨 טיוטת-חוט (דרגת-מחצבה) · reenrollCounts — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:184-197 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): reenrollCounts
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function reenrollCounts(rows) {
    const c = { total: 0, yes: 0, no: 0, hold: 0, undecided: 0, renewed: 0 };
    for (const r of rows) {
        c.total++;
        if (r.renewed)
            c.renewed++;
        if (r.decision === 'yes')
            c.yes++;
        else if (r.decision === 'no')
            c.no++;
        else if (r.decision === 'hold')
            c.hold++;
        else
            c.undecided++;
    }
    return c;
}
/** מי מיועד לרישום המוני — "ממשיך" שעדיין לא נרשם. */
