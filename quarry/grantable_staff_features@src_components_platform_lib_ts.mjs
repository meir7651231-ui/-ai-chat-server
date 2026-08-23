/** 🪨 טיוטת-חוט (דרגת-מחצבה) · GRANTABLE_STAFF_FEATURES — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:180-193 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const GRANTABLE_STAFF_FEATURES = new Set([
    'supporters.bulkselect',
    'supporters.bulkdelete',
    'supporters.purpose',
    'supporters.delete',
    'families.delete',
    'courses.delete',
    'courses.bulkadmin',
    'settings.teachers.delete',
    'shop.delete',
    'tzedaka.delete',
]);
/** האם המפתח הוא יכולת-הדלקה-פר-עובד (מכבד `true` בכרטיס-העובד). */
