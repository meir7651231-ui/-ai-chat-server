/** 🪨 טיוטת-חוט (דרגת-מחצבה) · encryptDoc — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudCrypto.ts:35-48 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): encryptDoc, getRandomValues, encrypt, encode
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function encryptDoc(plain, dek) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, dek, encoder.encode(JSON.stringify(plain)));
    return { enc: b64(ct), iv: b64(iv) };
}
/**
 * פענוח מסמך שנקרא מהחוט. **תאימות-לאחור:** מסמך בלי enc/iv (plaintext ישן)
 * מוחזר כמו-שהוא — כך ארגון יכול להכיל מסמכים מעורבים בזמן מיגרציה.
 */
