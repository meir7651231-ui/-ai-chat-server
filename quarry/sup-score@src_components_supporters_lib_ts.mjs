/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supScore — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:151-171 (21 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supScore, supTotalIls, supLast, supCount, getTime
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supScore(sp, rate = 3.7) {
    const tot = supTotalIls(sp, rate);
    const last = supLast(sp);
    const cnt = supCount(sp);
    const days = last
        ? Math.floor((Date.now() - new Date(last + 'T12:00:00').getTime()) / 86400000)
        : 9999;
    const R = days <= 30 ? 350 : days <= 90 ? 280 : days <= 180 ? 200 : days <= 365 ? 120 : 40;
    const F = cnt >= 10 ? 300 : cnt >= 5 ? 230 : cnt >= 3 ? 160 : cnt >= 2 ? 100 : 50;
    const M = tot >= 5000 ? 350 : tot >= 2000 ? 280 : tot >= 1000 ? 210 : tot >= 500 ? 140 : tot >= 100 ? 80 : 40;
    return R + F + M;
}
/** דרגה לפי הציון — זהה לחלוקה ולצבעים במקור (800/600/400). */
