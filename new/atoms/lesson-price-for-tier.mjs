/** חוט · lesson-price-for-tier — מחיר-לשיעור לפי רמת-ההנחה (fallback למלא).
 *  חוזה: lesson-price-for-tier.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:262-267 — אפס שקעים. */
export function lessonPriceForTier(c, tier) {
    if (tier === '1' && c.lessonPrice1)
        return c.lessonPrice1;
    if (tier === '2' && c.lessonPrice2)
        return c.lessonPrice2;
    if (tier === '3' && c.lessonPrice3)
        return c.lessonPrice3;
    return c.lessonPrice || 0;
}
