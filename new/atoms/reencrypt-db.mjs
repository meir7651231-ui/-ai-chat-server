/** חוט · reencrypt-db — הצפנת JSON חדש עם DEK קיים; המעטפת נשמרת, רק data מוחלף.
 *  חוזה: reencrypt-db.contract.md · שקע: aesEnc.
 *  חולץ כלשונו מ-maor/src/lib/crypto.ts:128-131 (‏aesEnc שוקע; TextEncoder = שפה). */
const enc = new TextEncoder();
export async function reencryptDb(env, dek, json, aesEnc) {
  return { ...env, data: await aesEnc(dek, enc.encode(json)) };
}
