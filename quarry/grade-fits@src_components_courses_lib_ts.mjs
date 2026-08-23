/** 🪨 טיוטת-חוט (דרגת-מחצבה) · gradeFits — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:466-476 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): gradeFits, gradeIndex
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function gradeFits(c, childGrade) {
    if (!c.gradeMin && !c.gradeMax)
        return true;
    const gi = gradeIndex(childGrade);
    if (gi < 0)
        return true;
    const lo = gradeIndex(c.gradeMin);
    const hi = gradeIndex(c.gradeMax);
    if (lo >= 0 && gi < lo)
        return false;
    if (hi >= 0 && gi > hi)
        return false;
    return true;
}
