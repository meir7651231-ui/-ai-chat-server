/** 🪨 טיוטת-חוט (דרגת-מחצבה) · openDek — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/crypto.ts:106-122 (17 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): openDek, unb64, deriveWrapKey, aesDec, importKey
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function openDek(env, secret, via) {
    try {
        const salt = unb64(via === 'pass' ? env.saltPass : env.saltRec);
        const wrap = via === 'pass' ? env.wrapPass : env.wrapRec;
        const wrapKey = await deriveWrapKey(secret, salt, env.iter);
        const dekRaw = await aesDec(wrapKey, wrap);
        return crypto.subtle.importKey('raw', dekRaw, 'AES-GCM', true, ['encrypt', 'decrypt']);
    }
    catch {
        return null; // סוד שגוי או מעטפת פגומה
    }
}
/** פענוח הנתונים בעזרת DEK שכבר חולץ. */
