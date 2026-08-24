/** קופסת-חיבורים · מנוע-ה-diff של סנכרון-הענן. חוזה: cloud-diff.contract.md
 *  המקום היחיד שבו 11 חוטי-cloud-diff נפגשים (LAW.md). drop-in ל-maor/src/lib/cloud-diff.ts.
 *  מייבאת אך-ורק אטומים; הקריאות-לשכן שוקעו כפרמטרים והן מחווטות כאן. */
import { ENTITY_COLLECTIONS } from '../atoms/entity-collections.mjs';
import { colPath } from '../atoms/col-path.mjs';
import { metaPath } from '../atoms/meta-path.mjs';
import { envPath } from '../atoms/env-path.mjs';
import { DONATIONS_COL } from '../atoms/donations-col.mjs';
import { donationsPath as donationsPathAtom } from '../atoms/donations-path.mjs';
import { stripSupporterDonations } from '../atoms/strip-supporter-donations.mjs';
import { metaOf } from '../atoms/meta-of.mjs';
import { diffDb as diffDbAtom } from '../atoms/diff-db.mjs';
import { fullDbDiff as fullDbDiffAtom } from '../atoms/full-db-diff.mjs';
import { emptyDiff } from '../atoms/empty-diff.mjs';

// ── הכרעות-הקופסה (חיות כאן, לא בחוטים) ──
// META_KEYS: מפתחות-ה-Db שנבדקים לשינוי-meta. savedAt מוחרג במכוון (משתנה בכל שמירה = רעש).
// המימוש והסדר verbatim מ-maor/src/lib/cloud-diff.ts:87-105.
const META_KEYS = [
  'orgName',
  'orgSite',
  'orgDonate',
  'orgGoal',
  'budget',
  'usdRate',
  'audit',
  'notif',
  'reports',
  'ui',
  'seq',
  'receiptSeq',
  'donationSeq',
  'shopReceiptSeq',
  'attnDone',
];
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
