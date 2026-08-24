/** חוט · decrypt-db — פענוח נתוני-מעטפת עם DEK חלוץ. חוזה: decrypt-db.contract.md
 *  חולץ כלשונו מ-maor/src/lib/crypto.ts:123-127; השכן aesDec הוזרק כשקע
 *  (חוק-1 — אפס import פנימי); dec = TextDecoder סטנדרטי. */
export async function decryptDb(env, dek, aesDec) {
  return new TextDecoder().decode(await aesDec(dek, env.data));
}
