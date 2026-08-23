/** 🪨 טיוטת-חוט (דרגת-מחצבה) · verifyPin — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/lock.ts:82-86 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): verifyPin, hashPin
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function verifyPin(pin, hash) {
    if (!hash)
        return false;
    return (await hashPin(pin)) === hash;
}
