/** 🪨 טיוטת-חוט (דרגת-מחצבה) · wheelIndexUnderPointer — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:592-598 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): wheelIndexUnderPointer
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function wheelIndexUnderPointer(rot, n) {
    if (n <= 1)
        return 0;
    const step = 360 / n;
    const off = (((-rot) % 360) + 360) % 360;
    return Math.floor(off / step) % n;
}
