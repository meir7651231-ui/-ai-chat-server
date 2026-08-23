/** 🪨 טיוטת-חוט (דרגת-מחצבה) · filterCollections — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:233-249 (17 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): filterCollections, dateInRange
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function filterCollections(box, fromIso, toIso, campaignId) {
    return box.collections.filter((c) => dateInRange(c.date, fromIso, toIso) && (!campaignId || c.campaignId === campaignId));
}
/* ---------- תדפיס שטח וייצוא (CONNECT חיבור 6) ---------- */
/**
 * שורות תדפיס הרכז — רשימת הקופות שלו לסבב שטח: מספר, משפחה, כתובת,
 * טלפון וריקון אחרון. טהור — ההורדה בדפוס downloadText הקיים.
 */
