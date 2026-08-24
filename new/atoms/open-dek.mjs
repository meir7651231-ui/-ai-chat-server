/** חוט · open-dek — חילוץ ה-DEK ממעטפת-הצפנה בסיסמה/מפתח-שחזור; כשל ⇒ null.
 *  חוזה: open-dek.contract.md · שקעים: unb64, deriveWrapKey, aesDec
 *  חולץ כלשונו מ-maor/src/lib/crypto.ts:106-122; השכנים הוזרקו כשקעים
 *  (חוק-1 — אפס import פנימי). crypto.subtle = סטנדרט-פלטפורמה (מותר). */
export async function openDek(env, secret, via, unb64, deriveWrapKey, aesDec) {
  try {
    const salt = unb64(via === 'pass' ? env.saltPass : env.saltRec);
    const wrap = via === 'pass' ? env.wrapPass : env.wrapRec;
    const wrapKey = await deriveWrapKey(secret, salt, env.iter);
    const dekRaw = await aesDec(wrapKey, wrap);
    return crypto.subtle.importKey('raw', dekRaw, 'AES-GCM', true, ['encrypt', 'decrypt']);
  } catch {
    return null; // סוד שגוי או מעטפת פגומה
  }
}
