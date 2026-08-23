/** 🪨 טיוטת-חוט (דרגת-מחצבה) · createCloudKey — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudCrypto.ts:64-71 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): createCloudKey, encryptDb, openDek
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function createCloudKey(password, recoveryKey) {
    const env = await encryptDb('', password, recoveryKey);
    const dek = await openDek(env, password, 'pass');
    if (!dek)
        throw new Error('יצירת מפתח-הצפנה נכשלה');
    return { env, dek };
}
/** חילוץ ה-DEK מ-envelope בעזרת סיסמה או מפתח-שחזור. null = סוד שגוי. */
