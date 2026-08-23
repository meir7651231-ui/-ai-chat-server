/** 🪨 טיוטת-חוט (דרגת-מחצבה) · setExportBlocked — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/exportGate.ts:19-24 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): setExportBlocked
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function setExportBlocked(isBlocked, onBlocked) {
    blocked = isBlocked;
    notify = onBlocked ?? null;
}
/** האם יציאת-מידע מותרת כרגע (חסר-דגל/ברירת-מחדל ⇒ true). */
