/** קופסת-חיבורים · מיזוג צד-הקבלה של סנכרון-הענן. חוזה: cloud-merge.contract.md
 *  זה המקום היחיד שבו חוטי-המיזוג נפגשים (חוקי-החשמלאי, LAW.md).
 *  מקור: maor/src/lib/cloud-merge.ts — צד-הקבלה הטהור (ללא firebase/DOM). */
import { ENTITY_COLLECTIONS } from '../atoms/entity-collections.mjs';
import { sanitizeIncoming } from '../atoms/sanitize-incoming.mjs';
import { mergeDonationsPreserving } from '../atoms/merge-donations-preserving.mjs';
import { applyEntityPartial as applyEntityPartialAtom } from '../atoms/apply-entity-partial.mjs';
import { applyMetaPartial } from '../atoms/apply-meta-partial.mjs';

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
