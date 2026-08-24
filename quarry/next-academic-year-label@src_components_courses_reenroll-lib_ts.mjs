/** 🪨 טיוטת-חוט (דרגת-מחצבה) · nextAcademicYearLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:42-50 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): nextAcademicYearLabel, atNoon, getMonth, getFullYear, gemYear, hebPartsOfIso
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function nextAcademicYearLabel(startIso) {
    if (!startIso)
        return '';
    const d = atNoon(startIso);
    const yy = d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
    // "השנה הבאה" = הוסף שנה עברית אחת (31.12 של השנה הלועזית הבאה).
    return gemYear(hebPartsOfIso(`${yy + 1}-12-31`).year);
}
/** תאריכי השנה הבאה — הזזת start/end בשנה קדימה (שומר יום/חודש). */
