/** חוט · encrypt-db — מעטפת-מוצפנת חדשה (DEK עטוף פעמיים: סיסמה + מפתח-שחזור).
 *  חוזה: encrypt-db.contract.md
 *  חולץ כלשונו מ-maor/src/lib/crypto.ts:79-100; השכנים rand·deriveWrapKey·aesEnc·b64
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי); enc = TextEncoder סטנדרטי. */

// המלצת OWASP 2024 ל-PBKDF2-SHA256. ה-envelope שומר את ה-iter שלו (env.iter) ⇒
// העלאת ברירת-המחדל חלה רק על הצפנות חדשות; envelope ישן (210K) נפתח כרגיל.

export async function encryptDb(json, password, recoveryKey, rand, deriveWrapKey, aesEnc, b64, T) {
  const dekRaw = rand(32);
  const dek = await crypto.subtle.importKey(T.k1, dekRaw, T.k2, true, [T.k3, T.k4]);
  const saltPass = rand(16);
  const saltRec = rand(16);
  const kPass = await deriveWrapKey(password, saltPass, T.tbl1);
  const kRec = await deriveWrapKey(recoveryKey, saltRec, T.tbl1);
  return {
    $enc: 2,
    iter: T.tbl1,
    saltPass: b64(saltPass),
    saltRec: b64(saltRec),
    wrapPass: await aesEnc(kPass, dekRaw),
    wrapRec: await aesEnc(kRec, dekRaw),
    data: await aesEnc(dek, new TextEncoder().encode(json)),
  };
}
