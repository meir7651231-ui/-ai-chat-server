/** 🪨 טיוטת-חוט (דרגת-מחצבה) · academicYearLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:26-34 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): academicYearLabel, atNoon, getFullYear, getMonth
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function academicYearLabel(startIso) {
    const d = atNoon(startIso);
    const y = d.getFullYear();
    const startYear = d.getMonth() >= 8 ? y : y - 1; // ספט׳=8
    const nn = String((startYear + 1) % 100).padStart(2, '0');
    return `${startYear}/${nn}`;
}
/** תאריכי השנה הבאה — הזזת start/end בשנה קדימה (שומר יום/חודש). */
