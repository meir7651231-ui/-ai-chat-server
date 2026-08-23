/** 🪨 טיוטת-חוט (דרגת-מחצבה) · importableContacts — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/vcardImport.ts:236-254 (19 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): importableContacts, parseVcards, isJunkContact
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function importableContacts(text) {
    return parseVcards(text).filter((c) => !isJunkContact(c));
}
/**
 * מיפוי כרטיס → שורת-ייבוא: שם-תצוגה, שני טלפונים ראשונים, מייל ראשון, כתובת,
 * ו"ארגון · תפקיד · הערה" מאוחדים ל-notes. טהור — הנרמול/הדדופ נעשים בצרכן.
 */
