/** 🪨 טיוטת-חוט (דרגת-מחצבה) · mergeSupportersGroup — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dedup.ts:388-403 (16 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): mergeSupportersGroup, mergeSupporterInto
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function mergeSupportersGroup(keeper, losers) {
    return losers.reduce((acc, l) => mergeSupporterInto(acc, l), keeper);
}
/** שדות-המיזוג הנבחרים של תומך (סקלריים בלבד — בלי כסף). */
