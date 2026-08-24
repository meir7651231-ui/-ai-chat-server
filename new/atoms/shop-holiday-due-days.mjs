/** אטום-קבוע · shop-holiday-due-days — קודם אוטומטית (צילום-ערך). חוזה: shop-holiday-due-days.contract.md */
export const SHOP_HOLIDAY_DUE_DAYS = 30;
/**
 * רשימת הטיפול המשרדי — ממוינת לפי סוג: מתנות-חג שמועדן קרב →
 * פגישות שטרם מומשו → קופונים שטרם מומשו → קופונים שפקעו → מלאי שאזל.
 * שיוכים active בלבד (מלאי — פר-רכיב במוצר active, בלי שיוך: assignmentId='').
 * קופון שפקע מדווח כ-couponExpired (במקום couponPending — לא כפול).
 * config (רשות, swarm-audit): מונחי termOf בתוויות (beneficiaryLabel) + גידור
 * שורות 'expiring' בדגל shop.expiry — בלי config ההתנהגות ההיסטורית (הכול פעיל).
 */
