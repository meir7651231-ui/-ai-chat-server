/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hashPin — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/lock.ts:73-81 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hashPin, encode, digest, toString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function hashPin(pin) {
    const data = new TextEncoder().encode(SALT + pin);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}
/** בדיקת קוד מול גיבוב שמור. גיבוב חסר/ריק → תמיד false. */
