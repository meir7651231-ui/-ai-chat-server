/** קופסת-חיבורים · נעילת-גישה (lib-lock). חוזה: lib-lock.contract.md
 *  ההלחמה-לשעבר מ-maor/src/lib/lock.ts — אזורי-הנעילה, מפתח-התחום, קריאה/כתיבה
 *  ל-localStorage, ותיקוף/גיבוב/אימות ה-PIN — עכשיו חיווט גלוי אחד.
 *  הקופסה מייבאת אטומים בלבד (חוק-2/3); שקעי-IO אמיתיים (nsLsKey, storage)
 *  מוזרקים כפרמטרים ואינם ממומשים כאן. */
import { LOCK_ZONES } from '../atoms/lock-zones.mjs';
import { DEFAULT_LOCK_ZONES } from '../atoms/default-lock-zones.mjs';
import { lockKey as __pure_lockKey } from '../atoms/lock-key.mjs';
import { LOCK_KEY_T as __d_lockKey_LOCK_KEY_T } from '../atoms/lock-key-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const lockKeyAtom = (...a) => __pure_lockKey(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_lockKey_LOCK_KEY_T);
import { isValidPin as isValidPinAtom } from '../atoms/is-valid-pin.mjs';
import { hashPin as hashPinAtom } from '../atoms/hash-pin.mjs';
import { verifyPin as verifyPinAtom } from '../atoms/verify-pin.mjs';

// ── הכרעות-החיווט של הקופסה (סדר · ברירות-מחדל · מילון-קבועים) ──
// 1) המלח: גרסת-פורמט של ההצבה — שינויו מבטל כל גיבוב שמור. המקור: lock.ts:23.
//    הוא שקע-הגיבוב של החוט hash-pin (חוק-6 — קבוע-הצבה חי בחיווט, לא באטום).
const SALT = 'maor.lock.v1::';
// 2) בסיס-המפתח הישן (bare), לזיהוי המיגרציה-הרכה. המקור: lock.ts:36.
const LOCK_BASE = 'maor_lock';

// ── קבועי-האזורים מיוצאים כלשונם מהחוטים ──
export { LOCK_ZONES, DEFAULT_LOCK_ZONES };

/** מפתח הנעילה בתחום הנוכחי. nsLsKey (ממרחב-השמות) = שקע מוזרק — הקופסה לא
 *  יודעת איזה ארגון מוצב. default ⇒ 'maor_lock' (ביט-זהה); ארגון ⇒ 'maor_lock:{slug}'.
 *  המקור: lock.ts:40-43. */
export function lockKey(nsLsKey) {
  return lockKeyAtom(nsLsKey);
}

/** קריאת-הנעילה. שקעים מוזרקים: nsLsKey (מרחב-שם) · storage (localStorage-דמוי).
 *  מיגרציה-רכה: תחום ממורחב-שם ללא נעילה משלו נופל לבסיס-הישן 'maor_lock' כדי
 *  לא לאבד PIN קיים; הכתיבה הבאה תעביר לתחום. קלט פגום/storage-שזורק ⇒ {} בשקט.
 *  המקור: lock.ts:44-55. */
export function readLock(nsLsKey, storage) {
  try {
    const key = lockKeyAtom(nsLsKey);
    let raw = storage.getItem(key);
    if (raw == null && key !== LOCK_BASE) raw = storage.getItem(LOCK_BASE);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** כתיבת-הנעילה. שקעים מוזרקים: nsLsKey · storage. ריק (בלי primary וגם בלי
 *  secondary) ⇒ מחיקת-המפתח; אחרת JSON. storage חסום (מצב-פרטי, זריקה) ⇒ נבלע
 *  בשקט (הנעילה תפעל לסשן הנוכחי בלבד). המקור: lock.ts:57-65. */
export function writeLock(nsLsKey, storage, cfg) {
  try {
    const key = lockKeyAtom(nsLsKey);
    if (!cfg.primary && !cfg.secondary) storage.removeItem(key);
    else storage.setItem(key, JSON.stringify(cfg));
  } catch {
    /* localStorage חסום — הנעילה תפעל לסשן הנוכחי בלבד */
  }
}

/** קוד תקין: 4–8 ספרות. המקור: lock.ts:68-70. */
export function isValidPin(pin) {
  return isValidPinAtom(pin);
}

/** גיבוב הקוד ל-hex של SHA-256 — המלח של הקופסה מוזרק לשקע-הגיבוב של החוט.
 *  אסינכרוני (crypto.subtle של הפלטפורמה). המקור: lock.ts:73-79. */
export function hashPin(pin) {
  return hashPinAtom(pin, SALT);
}

/** אימות: קוד מול גיבוב שמור. הגיבוב חסר/ריק ⇒ false בלי לגבב כלל. הגיבוב
 *  המחווט-כאן (הנושא את SALT) מוזרק לחוט — שרשרת-המלח נשמרת. המקור: lock.ts:82-85. */
export function verifyPin(pin, hash) {
  return verifyPinAtom(pin, hash, hashPin);
}
