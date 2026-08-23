/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supporterAggregates — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supporterAgg.ts:27-42 (16 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supporterAggregates, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supporterAggregates(sp) {
    const dons = Array.isArray(sp.donations) ? sp.donations : [];
    let ils = 0;
    let usd = 0;
    const dates = [];
    for (const d of dons) {
        const amt = Number.isFinite(d.amount) ? d.amount : 0;
        if (d.cur === '$')
            usd += amt;
        else
            ils += amt; // ריק/₪/מיובא = שקל (עקבי עם addDonation והבית)
        if (d.date)
            dates.push(d.date);
    }
    dates.sort();
    // count/ils/usd = קבלות בלבד; hist מתווסף בתצוגה (supporters/lib) פעם אחת.
    return { count: dons.length, ils, usd, first: dates[0] ?? '', last: dates[dates.length - 1] ?? '' };
}
