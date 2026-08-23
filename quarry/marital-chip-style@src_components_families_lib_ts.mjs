/** 🪨 טיוטת-חוט (דרגת-מחצבה) · maritalChipStyle — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/families/lib.ts:228-232 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): maritalChipStyle, chipStyle
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function maritalChipStyle(status) {
    const [bg, c] = MARITAL_CHIP[status] ?? ['#eef1f5', '#4a5568'];
    return chipStyle(bg, c);
}
