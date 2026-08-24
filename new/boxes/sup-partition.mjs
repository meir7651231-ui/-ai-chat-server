/** קופסת-חיבורים · אכיפת-הרשאה בשכבת-הנתונים (פירוק-תומכים). חוזה: sup-partition.contract.md
 *  המקור-החי: maor/src/lib/supporterPartition.ts — שכבה טהורה שאוכפת ייעוד-פר-תורם
 *  (forWho ⇒ skey plaintext על מסמך-הענן). כאן החיווט הגלוי: האטומים מוזרקי-השקעים
 *  (חוק-1) מחוברים למפתח-המשותף ולשכניהם — הכרעות-החיווט חיות בקופסה, לא באטום. */
import { SHARED_SUP_KEY } from '../atoms/shared-sup-key.mjs';
import { supKeyOf as supKeyOfAtom } from '../atoms/sup-key-of.mjs';
import { SUP_KEYED_COLS } from '../atoms/sup-keyed-cols.mjs';
import { docSkey as docSkeyAtom } from '../atoms/doc-skey.mjs';
import { supKeyMapOf as supKeyMapOfAtom } from '../atoms/sup-key-map-of.mjs';
import { supAllowedKeys as supAllowedKeysAtom } from '../atoms/sup-allowed-keys.mjs';
import { stripSupKey } from '../atoms/strip-sup-key.mjs';
import { stripAuditMeta } from '../atoms/strip-audit-meta.mjs';

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
