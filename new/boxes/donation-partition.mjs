/** קופסת-חיבורים · donation-partition — שכבת-פיצול-התרומות (מסלול-B, טהורה).
 *  חוזה: donation-partition.contract.md · מקור-האמת: maor/src/lib/donationPartition.ts.
 *  זה המקום היחיד שבו חוטי-הפיצול נפגשים (חוקי-החשמלאי, LAW.md). 6 החוטים חולצו
 *  לאטומים; החיווט — סדר-ההזרקות, המפתח-המשותף, ובחירת-purposeKeyOf שמזין את
 *  הפירוק — חי כאן, לא בחוטים.
 *  שקעי-IO אמיתיים: אין — donationPartition טהור לגמרי (בלי DOM/localStorage/fetch/ענן). */
import { SHARED_PURPOSE_KEY } from '../atoms/shared-purpose-key.mjs';
import { purposeKeyOf } from '../atoms/purpose-key-of.mjs';
import { donAllowedKeys as _donAllowedKeys } from '../atoms/don-allowed-keys.mjs';
import { explodeSupporter as _explodeSupporter } from '../atoms/explode-supporter.mjs';
import { reassembleDonations } from '../atoms/reassemble-donations.mjs';
import { donationPartitionDiff as _donationPartitionDiff } from '../atoms/donation-partition-diff.mjs';

// ── החיווט (גרף-הקריאות של donationPartition.ts, סוקטים מוזרקים) ──
// המפתח-המשותף '_shared_' הוא הכרעת-החיווט: הוא הערך-הנוסף בשאילתת-ה-in של עובד
// מוגבל (donAllowedKeys) ואת אותו מפתח מייצר purpose ריק בפירוק (purposeKeyOf).
const donAllowedKeys = (allowed) => _donAllowedKeys(allowed, SHARED_PURPOSE_KEY);
// explodeSupporter מוזן ב-purposeKeyOf (השכן הפנימי במקור, כאן שקע-מוזרק).
const explodeSupporter = (sp) => _explodeSupporter(sp, purposeKeyOf);
// donationPartitionDiff מוזן ב-explodeSupporter המחווט — הצד-הדוחף של מסלול-B.
const donationPartitionDiff = (prev, next) => _donationPartitionDiff(prev, next, explodeSupporter);

// ── החשיפה (ה-API הפומבי, ביט-זהה לחתימות donationPartition.ts) ──
export {
  SHARED_PURPOSE_KEY,
  purposeKeyOf,
  donAllowedKeys,
  explodeSupporter,
  reassembleDonations,
  donationPartitionDiff,
};
