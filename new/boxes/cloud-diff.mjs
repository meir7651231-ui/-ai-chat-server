/** קופסת-חיבורים · מנוע-ה-diff של סנכרון-הענן. חוזה: cloud-diff.contract.md
 *  המקום היחיד שבו 11 חוטי-cloud-diff נפגשים (LAW.md). drop-in ל-maor/src/lib/cloud-diff.ts.
 *  מייבאת אך-ורק אטומים; הקריאות-לשכן שוקעו כפרמטרים והן מחווטות כאן. */
import { ENTITY_COLLECTIONS } from '../atoms/entity-collections.mjs';
import { colPath as __pure_colPath } from '../atoms/col-path.mjs';
import { COL_PATH_T as __d_colPath_COL_PATH_T } from '../atoms/col-path-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const colPath = (...a) => __pure_colPath(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_colPath_COL_PATH_T);
import { metaPath as __pure_metaPath } from '../atoms/meta-path.mjs';
import { META_PATH_T as __d_metaPath_META_PATH_T } from '../atoms/meta-path-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const metaPath = (...a) => __pure_metaPath(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_metaPath_META_PATH_T);
import { envPath as __pure_envPath } from '../atoms/env-path.mjs';
import { ENV_PATH_T as __d_envPath_ENV_PATH_T } from '../atoms/env-path-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const envPath = (...a) => __pure_envPath(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_envPath_ENV_PATH_T);
import { DONATIONS_COL } from '../atoms/donations-col.mjs';
import { donationsPath as donationsPathAtom } from '../atoms/donations-path.mjs';
import { stripSupporterDonations as __pure_stripSupporterDonations } from '../atoms/strip-supporter-donations.mjs';
import { STRIP_SUPPORTER_DONATIONS_T as __d_stripSupporterDonations_STRIP_SUPPORTER_DONATIONS_T } from '../atoms/strip-supporter-donations-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const stripSupporterDonations = (...a) => __pure_stripSupporterDonations(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_stripSupporterDonations_STRIP_SUPPORTER_DONATIONS_T);
import { metaOf } from '../atoms/meta-of.mjs';
import { diffDb as diffDbAtom } from '../atoms/diff-db.mjs';
import { fullDbDiff as fullDbDiffAtom } from '../atoms/full-db-diff.mjs';
import { emptyDiff } from '../atoms/empty-diff.mjs';
import { META_KEYS } from '../atoms/cloud-meta-keys.mjs';

// ── הכרעות-הקופסה (חיות כאן, לא בחוטים) ──
// META_KEYS: מפתחות-ה-Db שנבדקים לשינוי-meta. savedAt מוחרג במכוון (משתנה בכל שמירה = רעש).
// המימוש והסדר verbatim מ-maor/src/lib/cloud-diff.ts:87-105.
// sameJson: אסטרטגיית-ההשוואה — === מהיר, אחרת שוויון-JSON. verbatim מ-cloud-diff.ts:138-141.
const sameJson = (a, b) => a === b || JSON.stringify(a) === JSON.stringify(b);

// ── החשיפה: ה-API המקורי ──
// קבועים ופונקציות-נתיב חד-חד-ערכיות עם המקור — נחשפות ישירות.
export { ENTITY_COLLECTIONS, DONATIONS_COL, metaOf, stripSupporterDonations, emptyDiff };
export { colPath, metaPath, envPath };

// donationsPath: השקעים colPath+DONATIONS_COL היו שכני-קובץ במקור — מחווטים כאן.
export const donationsPath = (slug, cloudRoot) =>
  donationsPathAtom(slug, cloudRoot, colPath, DONATIONS_COL);

// diffDb: 4 השקעים (רשימת-אוספים · מפתחות-meta · אסטרטגיית-השוואה · בונה-meta) מחווטים כאן.
export const diffDb = (prev, next) =>
  diffDbAtom(prev, next, ENTITY_COLLECTIONS, META_KEYS, sameJson, metaOf);

// fullDbDiff: השקעים ENTITY_COLLECTIONS+metaOf מחווטים כאן.
export const fullDbDiff = (db) => fullDbDiffAtom(db, ENTITY_COLLECTIONS, metaOf);
