/** חוט · open-dek — חילוץ ה-DEK ממעטפת-הצפנה בסיסמה/מפתח-שחזור; כשל ⇒ null.
 *  חוזה: open-dek.contract.md · שקעים: unb64, deriveWrapKey, aesDec
 *  חולץ כלשונו מ-maor/src/lib/crypto.ts:106-122; השכנים הוזרקו כשקעים
 *  (חוק-1 — אפס import פנימי). crypto.subtle = סטנדרט-פלטפורמה (מותר). */
export async function openDek(env, secret, via, unb64, deriveWrapKey, aesDec, T) {
  try {
    const salt = unb64(via === T.k1 ? env.saltPass : env.saltRec);
    const wrap = via === T.k1 ? env.wrapPass : env.wrapRec;
    const wrapKey = await deriveWrapKey(secret, salt, env.iter);
    const dekRaw = await aesDec(wrapKey, wrap);
    return crypto.subtle.importKey(T.k2, dekRaw, T.k3, true, [T.k4, T.k5]);
  } catch {
    return null; // סוד שגוי או מעטפת פגומה
  }
}
