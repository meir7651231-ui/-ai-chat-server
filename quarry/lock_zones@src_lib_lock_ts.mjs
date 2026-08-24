/** 🪨 טיוטת-חוט (דרגת-מחצבה) · LOCK_ZONES — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/lock.ts:13-20 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const LOCK_ZONES = [
    { key: 'wizard', label: 'אשף ההרכבה' },
    { key: 'settings', label: 'הגדרות' },
    { key: 'supporters', label: 'תורמים' },
    { key: 'reports', label: 'דוחות' },
];
/** ברירת מחדל להגנת המנהל: האשף וההגדרות (הקונפיגורציה). */
