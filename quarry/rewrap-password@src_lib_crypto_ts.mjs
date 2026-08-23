/** 🪨 טיוטת-חוט (דרגת-מחצבה) · rewrapPassword — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/crypto.ts:133-139 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): rewrapPassword, exportKey, rand, deriveWrapKey, aesEnc
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function rewrapPassword(env, dek, newPassword) {
    const dekRaw = await crypto.subtle.exportKey('raw', dek);
    const saltPass = rand(16);
    const kPass = await deriveWrapKey(newPassword, saltPass, env.iter);
    return { ...env, saltPass: b64(saltPass), wrapPass: await aesEnc(kPass, new Uint8Array(dekRaw)) };
}
