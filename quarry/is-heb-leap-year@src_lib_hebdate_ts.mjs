/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isHebLeapYear — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebdate.ts:79-90 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isHebLeapYear, hebToIsoEn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isHebLeapYear(hebYear) {
    const hit = leapCache.get(hebYear);
    if (hit !== undefined)
        return hit;
    const leap = hebToIsoEn(1, 'Adar I', hebYear) !== null;
    leapCache.set(hebYear, leap);
    return leap;
}
/**
 * שמות החודשים של שנה עברית נתונה, לפי הסדר, בתוויות עבריות.
 * שנה פשוטה: 12 חודשים עם 'אדר'; שנה מעוברת: 13 עם 'אדר א׳' ו'אדר ב׳'.
 */
