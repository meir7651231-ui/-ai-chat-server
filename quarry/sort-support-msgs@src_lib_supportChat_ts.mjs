/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sortSupportMsgs — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supportChat.ts:46-50 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sortSupportMsgs
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sortSupportMsgs(msgs) {
    return [...msgs].sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
}
/** שעת-ההודעה HH:MM (מקומי) — פרסור עמיד (T אם חסר). */
