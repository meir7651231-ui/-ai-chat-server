/** 🪨 טיוטת-חוט (דרגת-מחצבה) · ORG_SECRET_KEYS — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:138-142 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const ORG_SECRET_KEYS = ['yemotToken', 'nedarimMosad', 'nedarimApiPass', 'smsApiKey', 'smtpUrl', 'solaXKey'];
/** כתיבת סודות (merge): ערך מלא = נשמר; '' = נמחק מהכספת; שדה שלא נשלח לא נגוע.
 *  לעולם אין קריאה-חוזרת של הערכים — רק המטא ("מוגדר") מתעדכן. */
