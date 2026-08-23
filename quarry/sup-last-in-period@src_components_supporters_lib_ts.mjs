/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supLastInPeriod — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:133-142 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supLastInPeriod, supLast
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supLastInPeriod(sp, year, month) {
    if (year == null && month == null)
        return true;
    const iso = supLast(sp);
    if (!iso)
        return false;
    if (year != null && +iso.slice(0, 4) !== year)
        return false;
    if (month != null && +iso.slice(5, 7) !== month)
        return false;
    return true;
}
/** שווי כולל בש"ח — דולר לפי השער העריך (ברירת-מחדל 3.7, כמו במקור); כולל היסטוריה. */
