/** 🪨 טיוטת-חוט (דרגת-מחצבה) · validIsraeliId — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/validate.ts:4-18 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): validIsraeliId
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function validIsraeliId(id) {
    const s = String(id).trim();
    if (!/^\d{5,9}$/.test(s))
        return false;
    if (!/[1-9]/.test(s))
        return false; // ת"ז של אפסים בלבד אינה תקינה
    const p = s.padStart(9, '0');
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let d = +p[i] * (i % 2 === 0 ? 1 : 2);
        if (d > 9)
            d -= 9;
        sum += d;
    }
    return sum % 10 === 0;
}
/** נרמול טלפון: מסיר רווחים/מקפים, מוסיף 0 מוביל אם חסר. */
