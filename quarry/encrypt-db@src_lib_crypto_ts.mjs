/** 🪨 טיוטת-חוט (דרגת-מחצבה) · encryptDb — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/crypto.ts:79-100 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): encryptDb, rand, importKey, deriveWrapKey, aesEnc, encode
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function encryptDb(json, password, recoveryKey) {
    const dekRaw = rand(32);
    const dek = await crypto.subtle.importKey('raw', dekRaw, 'AES-GCM', true, [
        'encrypt',
        'decrypt',
    ]);
    const saltPass = rand(16);
    const saltRec = rand(16);
    const kPass = await deriveWrapKey(password, saltPass, PBKDF2_ITER);
    const kRec = await deriveWrapKey(recoveryKey, saltRec, PBKDF2_ITER);
    return {
        $enc: 2,
        iter: PBKDF2_ITER,
        saltPass: b64(saltPass),
        saltRec: b64(saltRec),
        wrapPass: await aesEnc(kPass, dekRaw),
        wrapRec: await aesEnc(kRec, dekRaw),
        data: await aesEnc(dek, enc.encode(json)),
    };
}
/** האם הערך הוא מעטפת מוצפנת. */
