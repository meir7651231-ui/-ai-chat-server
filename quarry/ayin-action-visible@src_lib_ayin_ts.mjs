/** 🪨 טיוטת-חוט (דרגת-מחצבה) · ayinActionVisible — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:145-153 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): ayinActionVisible
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function ayinActionVisible(a) {
    const st = a.stage;
    if (st === 'done')
        return false;
    if (st === 'new')
        return a.names.length > 0;
    if (st === 'eyes')
        return a.names.some((n) => n.eyes !== '' && n.eyes != null);
    return true;
}
/** תווית הכפתור-החכם (המקדם לשלב הבא) לפי השלב הנוכחי. */
