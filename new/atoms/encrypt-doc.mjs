/** חוט · encrypt-doc — הצפנת מסמך-ענן doc-level ל-{enc,iv} עם IV טרי. חוזה: encrypt-doc.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudCrypto.ts:35-48; השכן b64 הוזרק כשקע
 *  (חוק-1 — אפס import פנימי); encoder = TextEncoder סטנדרטי. */
export async function encryptDoc(plain, dek, b64, T) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: T.k1, iv }, dek, new TextEncoder().encode(JSON.stringify(plain)));
  return { enc: b64(ct), iv: b64(iv) };
}
