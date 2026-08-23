/** 🪨 טיוטת-חוט (דרגת-מחצבה) · decryptDoc — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudCrypto.ts:49-63 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): decryptDoc, isEncDoc, decrypt, unb64, decode
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function decryptDoc(d, dek) {
    if (!isEncDoc(d))
        return d; // plaintext — לא מוצפן
    const buf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(d.iv) }, dek, unb64(d.enc));
    return JSON.parse(decoder.decode(buf));
}
/**
 * יצירת envelope-מפתח לענן: DEK אקראי עטוף בסיסמה + מפתח-שחזור. מחזיר גם את
 * ה-DEK החי (לשימוש מיידי). ה-envelope נשמר ב-`orgs/{slug}/_enc/envelope`.
 * (משתמש ב-encryptDb עם json ריק — רק העטיפות נחוצות; ה-data מתעלמים ממנו.)
 */
