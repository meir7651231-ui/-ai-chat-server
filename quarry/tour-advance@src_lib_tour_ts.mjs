/** 🪨 טיוטת-חוט (דרגת-מחצבה) · tourAdvance — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/tour.ts:80-97 (18 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): tourAdvance
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function tourAdvance(index, delta, length) {
    const next = index + delta;
    if (next < 0)
        return 0;
    if (next >= length)
        return null;
    return next;
}
/**
 * חישוב חלון ה-spotlight סביב אלמנט: ריפוד קבוע, ונצמד לגבולות המסך
 * כך שהחור לעולם לא חורג מה-viewport. rect ריק (מידות 0) = אין חור.
 */
