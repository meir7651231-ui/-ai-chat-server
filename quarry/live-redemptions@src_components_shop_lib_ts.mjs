/** 🪨 טיוטת-חוט (דרגת-מחצבה) · liveRedemptions — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:25-48 (24 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): liveRedemptions
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function liveRedemptions(a) {
    return a.redemptions.filter((r) => !r.voidedAt);
}
/**
 * פענוח רכיב לפריט שלו + דריסות. רכיב טרום-מיגרציה (itemId ריק/מצביע
 * שבור) נופל לשדות-התאימות של הרכיב עצמו — אין קריסה על נתונים ישנים.
 */
