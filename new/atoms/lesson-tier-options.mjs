/** חוט · lesson-tier-options — אופציות רמות-ההנחה פר-שיעור לבורר.
 *  חוזה: lesson-tier-options.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:270-276 — אפס שקעים. */
export function lessonTierOptions(c, T) {
    const out = [{ v: '', t: T.k1 + (c.lessonPrice || 0) }];
    if (c.lessonPrice1)
        out.push({ v: '1', t: (c.price1Name || T.k2) + ' · ₪' + c.lessonPrice1 });
    if (c.lessonPrice2)
        out.push({ v: '2', t: (c.price2Name || T.k3) + ' · ₪' + c.lessonPrice2 });
    if (c.lessonPrice3)
        out.push({ v: '3', t: (c.price3Name || T.k4) + ' · ₪' + c.lessonPrice3 });
    return out;
}
