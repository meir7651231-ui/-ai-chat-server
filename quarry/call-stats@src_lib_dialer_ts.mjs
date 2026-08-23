/** 🪨 טיוטת-חוט (דרגת-מחצבה) · callStats — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dialer.ts:148-158 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): callStats
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function callStats(calls) {
    const list = calls ?? [];
    let noanswer = 0;
    for (const c of list)
        if (c.outcome === 'noanswer')
            noanswer++;
    return { total: list.length, last: list.length ? list[list.length - 1].at : '', noanswer };
}
/**
 * שורות-CSV לסיכום הקמפיין (20.8) — שורה פר-ניסיון (כולל לא-ענה שחזרו),
 * בסדר-כרונולוגי; nameOf ממופה ב-caller (המנוע לא מכיר את ה-store). טהור.
 */
