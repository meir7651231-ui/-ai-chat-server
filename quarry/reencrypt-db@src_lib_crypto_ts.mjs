/** 🪨 טיוטת-חוט (דרגת-מחצבה) · reencryptDb — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/crypto.ts:128-132 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): reencryptDb, aesEnc, encode
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function reencryptDb(env, dek, json) {
    return { ...env, data: await aesEnc(dek, enc.encode(json)) };
}
/** החלפת סיסמה בלי להצפין מחדש את הנתונים — עוטף מחדש את ה-DEK בלבד. */
