/** 🪨 טיוטת-חוט (דרגת-מחצבה) · taskIdentity — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/worktasks.ts:9-14 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): taskIdentity
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function taskIdentity(email) {
    const e = (email ?? '').trim().toLowerCase();
    return e || 'מקומי';
}
/** המשימות הפתוחות של עובד/ת — ממוינות: עדיפות ⇒ יעד-קרוב ⇒ ותיקה-קודם. */
