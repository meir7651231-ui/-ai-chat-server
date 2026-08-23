/** 🪨 טיוטת-חוט (דרגת-מחצבה) · ayinActive — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:74-85 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): ayinActive
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function ayinActive(a) {
    if (!a)
        return false;
    return (a.stage !== 'new' ||
        a.names.length > 0 ||
        !!a.lastTouch ||
        a.answers.length > 0 ||
        a.log.length > 0);
}
/** סכום המונים על פני כל הפריטים. */
