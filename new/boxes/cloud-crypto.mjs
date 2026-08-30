/** קופסת-חיבורים · הצפנת-ענן doc-level (cloud-crypto). חוזה: cloud-crypto.contract.md
 *  ההלחמות-לשעבר מ-maor/src/lib/cloudCrypto.ts — הקודק-הפרטי b64/unb64 + חמשת
 *  החוטים + ה-import מ-'./crypto' — עכשיו חיווט גלוי אחד.
 *  שקעי-מודול-אחר (encryptDb/openDek מ-crypto) = deps מוזרקים; crypto.subtle/
 *  getRandomValues/TextEncoder/TextDecoder/btoa/atob = סטנדרט-פלטפורמה. */
import { isEncDoc as __pure_isEncDoc } from '../atoms/is-enc-doc.mjs';
import { IS_ENC_DOC_T as __d_isEncDoc_IS_ENC_DOC_T } from '../atoms/is-enc-doc-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const isEncDoc = (...a) => __pure_isEncDoc(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_isEncDoc_IS_ENC_DOC_T);
import { encryptDoc as encDocAtom } from '../atoms/encrypt-doc.mjs';
import { decryptDoc as decDocAtom } from '../atoms/decrypt-doc.mjs';
import { createCloudKey as createCloudKeyAtom } from '../atoms/create-cloud-key.mjs';
import { openCloudKey as openCloudKeyAtom } from '../atoms/open-cloud-key.mjs';
import { isEncrypted as __pure_isEncrypted } from '../atoms/is-encrypted.mjs';
import { IS_ENCRYPTED_T as __d_isEncrypted_IS_ENCRYPTED_T } from '../atoms/is-encrypted-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const isEncrypted = (...a) => __pure_isEncrypted(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_isEncrypted_IS_ENCRYPTED_T);

// ── מילון-הקופסה · קודק-base64 (verbatim מ-cloudCrypto.ts:16-22) ──
// b64 מטפל ב-ArrayBuffer *וגם* Uint8Array: encrypt-doc מזין ct(ArrayBuffer)+iv(Uint8Array).
const b64 = (buf) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
};
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

// ── החיווט ──

/** האם הערך מסמך-מוצפן {enc,iv} (בדיקה מבנית). */
export { isEncDoc };

/** האם הערך מעטפת-הצפנה ($enc===2) — re-export (במקור: export { isEncrypted }). */
export { isEncrypted };

/** הצפנת מסמך ל-{enc,iv} עם IV טרי — הקודק b64 מוזרק לאטום. */
export function encryptDoc(plain, dek) {
  return encDocAtom(plain, dek, b64);
}

/** פענוח מסמך (plaintext ישן עובר כמו-שהוא) — isEncDoc+unb64 מוזרקים לאטום. */
export function decryptDoc(d, dek) {
  return decDocAtom(d, dek, isEncDoc, unb64);
}

/** יצירת envelope-מפתח-ענן + DEK חי. encryptDb/openDek = חוטי-מודול-אחר, מוזרקים. */
export function createCloudKey(password, recoveryKey, { encryptDb, openDek } = {}) {
  return createCloudKeyAtom(password, recoveryKey, encryptDb, openDek);
}

/** חילוץ DEK-ענן מ-envelope — האצלה שקופה. openDek = חוט-מודול-אחר, מוזרק. */
export function openCloudKey(env, secret, via, { openDek } = {}) {
  return openCloudKeyAtom(env, secret, via, openDek);
}
