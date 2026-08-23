/** 🪨 טיוטת-חוט (דרגת-מחצבה) · normName — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:69-73 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): normName, normSearch
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function normName(s) {
    return normSearch(s).replace(/\s/g, '');
}
/** האם התיק "פעיל" — כלומר עבר אינטראקציה כלשהי ולכן מופיע בלוח הטיפול. */
