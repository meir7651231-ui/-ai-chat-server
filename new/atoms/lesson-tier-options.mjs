/** חוט · lesson-tier-options — אופציות רמות-ההנחה פר-שיעור לבורר.
 *  חוזה: lesson-tier-options.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:271-277 — אפס שקעים. */
export function lessonTierOptions(c) {
    const out = [{ v: '', t: 'מחיר מלא · ₪' + (c.lessonPrice || 0) }];
    if (c.lessonPrice1)
        out.push({ v: '1', t: (c.price1Name || 'הנחה 1') + ' · ₪' + c.lessonPrice1 });
    if (c.lessonPrice2)
        out.push({ v: '2', t: (c.price2Name || 'הנחה 2') + ' · ₪' + c.lessonPrice2 });
    if (c.lessonPrice3)
        out.push({ v: '3', t: (c.price3Name || 'הנחה 3') + ' · ₪' + c.lessonPrice3 });
    return out;
}
