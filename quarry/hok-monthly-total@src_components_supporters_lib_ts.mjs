/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hokMonthlyTotal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:734-744 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hokMonthlyTotal, hokEffectivelyActive, active
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function hokMonthlyTotal(supporters, usdRate, todayIso) {
    const active = (sp) => (todayIso ? hokEffectivelyActive(sp, todayIso) : !!sp.hok?.active);
    return Math.round(supporters.reduce((a, sp) => {
        if (!active(sp) || !sp.hok)
            return a;
        return a + (sp.hok.cur === '$' ? sp.hok.amount * usdRate : sp.hok.amount);
    }, 0));
}
/** תווית אמצעי-ההו"ק לתצוגה. */
