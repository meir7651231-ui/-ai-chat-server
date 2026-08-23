/** 🪨 טיוטת-חוט (דרגת-מחצבה) · installAvailable — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/pwa.ts:32-36 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): installAvailable
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function installAvailable() {
    return deferredInstall !== null;
}
/** הפעלת דיאלוג-ההתקנה; מחזיר האם המשתמש אישר. */
