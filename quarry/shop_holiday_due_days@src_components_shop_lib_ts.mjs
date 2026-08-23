/** 🪨 טיוטת-חוט (דרגת-מחצבה) · SHOP_HOLIDAY_DUE_DAYS — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:239-248 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const SHOP_HOLIDAY_DUE_DAYS = 30;
/**
 * רשימת הטיפול המשרדי — ממוינת לפי סוג: מתנות-חג שמועדן קרב →
 * פגישות שטרם מומשו → קופונים שטרם מומשו → קופונים שפקעו → מלאי שאזל.
 * שיוכים active בלבד (מלאי — פר-רכיב במוצר active, בלי שיוך: assignmentId='').
 * קופון שפקע מדווח כ-couponExpired (במקום couponPending — לא כפול).
 * config (רשות, swarm-audit): מונחי termOf בתוויות (beneficiaryLabel) + גידור
 * שורות 'expiring' בדגל shop.expiry — בלי config ההתנהגות ההיסטורית (הכול פעיל).
 */
