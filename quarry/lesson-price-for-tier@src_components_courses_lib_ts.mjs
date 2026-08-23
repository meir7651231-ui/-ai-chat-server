/** 🪨 טיוטת-חוט (דרגת-מחצבה) · lessonPriceForTier — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:262-269 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): lessonPriceForTier
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function lessonPriceForTier(c, tier) {
    if (tier === '1' && c.lessonPrice1)
        return c.lessonPrice1;
    if (tier === '2' && c.lessonPrice2)
        return c.lessonPrice2;
    if (tier === '3' && c.lessonPrice3)
        return c.lessonPrice3;
    return c.lessonPrice || 0;
}
/** רמות-ההנחה הזמינות לחוג פר-שיעור — רק אלו עם מחיר+שם. */
