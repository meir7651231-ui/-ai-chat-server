/** 🪨 טיוטת-חוט (דרגת-מחצבה) · lessonTierOptions — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:270-287 (18 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): lessonTierOptions
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
/** תמחור משוקלל — טהור. total = round(שיעורים × מחיר-לשיעור-אחרי-הנחה). */
