/** קופסת-חיבורים · אכיפת-הרשאה בשכבת-הנתונים (פירוק-תומכים). חוזה: sup-partition.contract.md
 *  המקור-החי: maor/src/lib/supporterPartition.ts — שכבה טהורה שאוכפת ייעוד-פר-תורם
 *  (forWho ⇒ skey plaintext על מסמך-הענן). כאן החיווט הגלוי: האטומים מוזרקי-השקעים
 *  (חוק-1) מחוברים למפתח-המשותף ולשכניהם — הכרעות-החיווט חיות בקופסה, לא באטום. */
import { SHARED_SUP_KEY } from '../atoms/shared-sup-key.mjs';
import { supKeyOf as supKeyOfAtom } from '../atoms/sup-key-of.mjs';
import { SUP_KEYED_COLS } from '../atoms/sup-keyed-cols.mjs';
import { docSkey as __pure_docSkey } from '../atoms/doc-skey.mjs';
import { DOC_SKEY_T as __d_docSkey_DOC_SKEY_T } from '../atoms/doc-skey-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const docSkeyAtom = (...a) => __pure_docSkey(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_docSkey_DOC_SKEY_T);
import { supKeyMapOf as supKeyMapOfAtom } from '../atoms/sup-key-map-of.mjs';
import { supAllowedKeys as supAllowedKeysAtom } from '../atoms/sup-allowed-keys.mjs';
import { stripSupKey as __pure_stripSupKey } from '../atoms/strip-sup-key.mjs';
import { STRIP_SUP_KEY_T as __d_stripSupKey_STRIP_SUP_KEY_T } from '../atoms/strip-sup-key-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const stripSupKey = (...a) => __pure_stripSupKey(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_stripSupKey_STRIP_SUP_KEY_T);
import { stripAuditMeta as __pure_stripAuditMeta } from '../atoms/strip-audit-meta.mjs';
import { STRIP_AUDIT_META_T as __d_stripAuditMeta_STRIP_AUDIT_META_T } from '../atoms/strip-audit-meta-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const stripAuditMeta = (...a) => __pure_stripAuditMeta(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_stripAuditMeta_STRIP_AUDIT_META_T);

// ── קבועי-המילון (הכרעות-החיווט חיות כאן) ──
// המפתח-המשותף שמוזרק לכל שקע-shared בקופסה — תומך ללא-ייעוד = משותף (מקור:23).
const SHARED = SHARED_SUP_KEY;

// ── החיווט ──
// supKeyOf: הזרקת המפתח-המשותף לשקע-shared (מקור:26-29).
export function supKeyOf(sp) {
  return supKeyOfAtom(sp, SHARED);
}

// docSkey: הזרקת השכן supKeyOf (המחווט, כבר קשור-shared) + המפתח-המשותף (מקור:42-49).
export function docSkey(col, data, supKeyBySpId) {
  return docSkeyAtom(col, data, supKeyBySpId, supKeyOf, SHARED);
}

// supKeyMapOf: הזרקת השכן supKeyOf כגוזר-מפתח (מקור:52-54).
export function supKeyMapOf(supporters) {
  return supKeyMapOfAtom(supporters, supKeyOf);
}

// supAllowedKeys: הזרקת המפתח-המשותף כזנב-הרשימה (מקור:61-64).
export function supAllowedKeys(allowed) {
  return supAllowedKeysAtom(allowed, SHARED);
}

// קבועים + מקלפי-הענן עוברים כמות-שהם (אין להם שקע-שכן).
export { SHARED_SUP_KEY, SUP_KEYED_COLS, stripSupKey, stripAuditMeta };
