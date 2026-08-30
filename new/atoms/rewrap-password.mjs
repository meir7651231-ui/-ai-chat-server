/** חוט · rewrap-password — החלפת-סיסמה בלי להצפין מחדש: עוטף מחדש רק את ה-DEK.
 *  חוזה: rewrap-password.contract.md
 *  חולץ כלשונו מ-maor/src/lib/crypto.ts:133-139; השכנים rand·deriveWrapKey·aesEnc·b64
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי); crypto.subtle = WebCrypto סטנדרטי. */
export async function rewrapPassword(env, dek, newPassword, rand, deriveWrapKey, aesEnc, b64, T) {
    const dekRaw = await crypto.subtle.exportKey(T.k1, dek);
    const saltPass = rand(16);
    const kPass = await deriveWrapKey(newPassword, saltPass, env.iter);
    return { ...env, saltPass: b64(saltPass), wrapPass: await aesEnc(kPass, new Uint8Array(dekRaw)) };
}
