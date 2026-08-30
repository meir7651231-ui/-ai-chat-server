/** קופסת-חיבורים · מיזוג צד-הקבלה של סנכרון-הענן. חוזה: cloud-merge.contract.md
 *  זה המקום היחיד שבו חוטי-המיזוג נפגשים (חוקי-החשמלאי, LAW.md).
 *  מקור: maor/src/lib/cloud-merge.ts — צד-הקבלה הטהור (ללא firebase/DOM). */
import { ENTITY_COLLECTIONS } from '../atoms/entity-collections.mjs';
import { sanitizeIncoming } from '../atoms/sanitize-incoming.mjs';
import { mergeDonationsPreserving as __pure_mergeDonationsPreserving } from '../atoms/merge-donations-preserving.mjs';
import { MERGE_DONATIONS_PRESERVING_T as __d_mergeDonationsPreserving_MERGE_DONATIONS_PRESERVING_T } from '../atoms/merge-donations-preserving-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const mergeDonationsPreserving = (...a) => __pure_mergeDonationsPreserving(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_mergeDonationsPreserving_MERGE_DONATIONS_PRESERVING_T);
import { applyEntityPartial as applyEntityPartialAtom } from '../atoms/apply-entity-partial.mjs';
import { applyMetaPartial as __pure_applyMetaPartial } from '../atoms/apply-meta-partial.mjs';
import { APPLY_META_PARTIAL_T as __d_applyMetaPartial_APPLY_META_PARTIAL_T } from '../atoms/apply-meta-partial-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const applyMetaPartial = (...a) => __pure_applyMetaPartial(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_applyMetaPartial_APPLY_META_PARTIAL_T);

// ── החיווט ──
// חוט applyEntityPartial במקור קורא ל-3 שכנים (ENTITY_COLLECTIONS · sanitizeIncoming ·
// mergeDonationsPreserving) — הם הוזרקו כשקעים בחוט (חוק-1). כאן, בקופסה, מחווטים
// אותם חזרה: אוסף-הישויות המותר = ENTITY_COLLECTIONS, החיזוק = sanitizeIncoming,
// והמיזוג-במקומו = mergeDonationsPreserving. זו *המשמעות* של המיזוג, והיא חיה כאן —
// אפס נגיעה בחוטים. ניתוק חוט = הסרת פרמטר מהשורה הזו, האטומים לא יודעים ולא נפגעים.
const applyEntityPartial = (db, col, docs) =>
  applyEntityPartialAtom(db, col, docs, ENTITY_COLLECTIONS, sanitizeIncoming, mergeDonationsPreserving);

// ── שקעי-IO (מתועדים, לא ממומשים) ──
// המקור טהור לחלוטין: אין DOM/localStorage/fetch/ענן בצד-הקבלה. הקורא (cloudSync.ts
// בצד-מאור) מזריק את db הנוכחי ואת ה-docs/meta שהגיעו מ-Firestore — אלה פרמטרים.

// ── החשיפה ──
export { sanitizeIncoming, mergeDonationsPreserving, applyEntityPartial, applyMetaPartial };
