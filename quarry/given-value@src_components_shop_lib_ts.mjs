/** 🪨 טיוטת-חוט (דרגת-מחצבה) · givenValue — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:433-439 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): givenValue, liveRedemptions, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function givenValue(assignments) {
    let sum = 0;
    for (const a of assignments)
        for (const r of liveRedemptions(a))
            sum += Number.isFinite(r.value) ? r.value : 0;
    return sum;
}
/** Σ מה ששולם בפועל במחיר הסמלי (מימושים חיים בלבד). */
