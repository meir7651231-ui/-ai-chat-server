/** חוט · decrypt-doc — פענוח מסמך-ענן doc-level (plaintext ישן עובר כמו-שהוא). חוזה: decrypt-doc.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudCrypto.ts:49-63; השכנים isEncDoc·unb64
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי); decoder = TextDecoder סטנדרטי. */
export async function decryptDoc(d, dek, isEncDoc, unb64, T) {
  if (!isEncDoc(d)) return d; // plaintext — לא מוצפן
  const buf = await crypto.subtle.decrypt({ name: T.k1, iv: unb64(d.iv) }, dek, unb64(d.enc));
  return JSON.parse(new TextDecoder().decode(buf));
}
