/** קופסת-חיבורים · lib-crypto — הצפנת-נתונים-במנוחה (envelope v2, AES-GCM 256 +
 *  DEK עטוף-כפול: סיסמה⊗מפתח-שחזור). חוזה: lib-crypto.contract.md
 *
 *  זה המקום היחיד שבו 7 חוטי-ההצפנה נפגשים (חוקי-החשמלאי, LAW.md): הקופסה
 *  מייבאת אך-ורק אטומים, ומספקת את שקעי-ה-WebCrypto (b64/unb64/rand/
 *  deriveWrapKey/aesEnc/aesDec) כ**חיווט** — אלה ה-helpers הפרטיים של המקור
 *  (maor/src/lib/crypto.ts:29-66), ששוקעו מהאטומים ומיושמים כאן פעם-אחת
 *  ומשותפים לכל החוטים. הפיגמנט היחיד שאינו דטרמיניסטי — אנטרופיה — נשען על
 *  crypto.getRandomValues (סטנדרט-פלטפורמה, כמו crypto.subtle שכבר בשימוש
 *  ישיר באטומים). ה-API הציבורי זהה-חתימה למקור. */
import { genRecoveryKey as __pure_genRecoveryKey } from '../atoms/gen-recovery-key.mjs';
import { GEN_RECOVERY_KEY_T as __d_genRecoveryKey_GEN_RECOVERY_KEY_T } from '../atoms/gen-recovery-key-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _genRecoveryKey = (...a) => __pure_genRecoveryKey(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_genRecoveryKey_GEN_RECOVERY_KEY_T);
import { encryptDb as _encryptDb } from '../atoms/encrypt-db.mjs';
import { isEncrypted as __pure_isEncrypted } from '../atoms/is-encrypted.mjs';
import { IS_ENCRYPTED_T as __d_isEncrypted_IS_ENCRYPTED_T } from '../atoms/is-encrypted-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const isEncrypted = (...a) => __pure_isEncrypted(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_isEncrypted_IS_ENCRYPTED_T);
import { openDek as _openDek } from '../atoms/open-dek.mjs';
import { decryptDb as _decryptDb } from '../atoms/decrypt-db.mjs';
import { reencryptDb as _reencryptDb } from '../atoms/reencrypt-db.mjs';
import { rewrapPassword as _rewrapPassword } from '../atoms/rewrap-password.mjs';

// ── שקעי-החיווט: ה-helpers הפרטיים של המקור (crypto.ts:29-66), verbatim ──
// enc משמש רק את deriveWrapKey (גזירת-הסוד ⇒ בייטים); הקידוד json⇒בייטים חי באטומים.
const enc = new TextEncoder();

const b64 = (buf) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
};
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const rand = (n) => crypto.getRandomValues(new Uint8Array(n));

/** גזירת מפתח-עטיפה (AES-GCM) מסוד טקסטואלי + מלח, דרך PBKDF2-SHA256. */
async function deriveWrapKey(secret, salt, iter) {
  const base = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** הצפנה: iv אקראי → "iv:ct" ב-base64. */
async function aesEnc(key, plain) {
  const iv = rand(12);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain);
  return b64(iv) + ':' + b64(ct);
}

/** פענוח "iv:ct" — זורק אם המפתח שגוי או הנתונים שונו. */
async function aesDec(key, blob) {
  const [ivB, ctB] = blob.split(':');
  const buf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(ivB) }, key, unb64(ctB));
  return new Uint8Array(buf);
}

// ── החשיפה: כל חוט מקבל את שקעיו בסדר-המקור (crypto.ts). ──
export { isEncrypted };

/** מפתח-שחזור קריא 6×4 (base32 בלי I,O,0,1). */
export const genRecoveryKey = () => _genRecoveryKey(rand);

/** מעטפת-מוצפנת חדשה — DEK עטוף בסיסמה ובמפתח-השחזור. */
export const encryptDb = (json, password, recoveryKey) =>
  _encryptDb(json, password, recoveryKey, rand, deriveWrapKey, aesEnc, b64);

/** חילוץ ה-DEK מהמעטפת בסיסמה ('pass') או מפתח-שחזור ('rec'); כשל ⇒ null. */
export const openDek = (env, secret, via) =>
  _openDek(env, secret, via, unb64, deriveWrapKey, aesDec);

/** פענוח נתוני-המעטפת עם DEK שכבר חולץ ⇒ JSON-טקסט. */
export const decryptDb = (env, dek) => _decryptDb(env, dek, aesDec);

/** הצפנת JSON חדש עם DEK קיים (שמירה שוטפת) — אותה מעטפת, רק data מתחלף. */
export const reencryptDb = (env, dek, json) => _reencryptDb(env, dek, json, aesEnc);

/** החלפת-סיסמה בלי הצפנה-מחדש — עוטף את ה-DEK מחדש בלבד. */
export const rewrapPassword = (env, dek, newPassword) =>
  _rewrapPassword(env, dek, newPassword, rand, deriveWrapKey, aesEnc, b64);
