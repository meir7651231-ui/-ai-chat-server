/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sortTeamMsgs — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supportChat.ts:99-103 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sortTeamMsgs
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sortTeamMsgs(msgs) {
    return [...msgs].sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
}
/** מיון רשימת-שיחות (לוח-הבקרה): לא-נקראות-לתמיכה קודם, ואז לפי lastAt יורד. */
