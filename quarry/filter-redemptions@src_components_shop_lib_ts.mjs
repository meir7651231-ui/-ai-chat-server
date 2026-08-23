/** 🪨 טיוטת-חוט (דרגת-מחצבה) · filterRedemptions — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:565-587 (23 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): filterRedemptions, dateInRange
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function filterRedemptions(a, fromIso, toIso, includeVoided) {
    return a.redemptions.filter((r) => dateInRange(r.date, fromIso, toIso) && (includeVoided || !r.voidedAt));
}
/**
 * יומן הקליטות — חדש-ראשון (תאריך יורד, שוויון = סדר ההזנה שכבר חדש-ראשון)
 * + סה"כ עלויות (תרומות-בעין = 0, לא מוסיפות).
 */
