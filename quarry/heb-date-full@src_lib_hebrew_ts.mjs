/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hebDateFull — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebrew.ts:156-163 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hebDateFull, isNaN, getTime, hebParts, format, gemYear
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function hebDateFull(iso) {
    if (!iso)
        return '';
    const d = new Date(iso.slice(0, 10) + 'T12:00:00');
    if (isNaN(d.getTime()))
        return '';
    return `${gem(hebParts(d).day)} ${fmtHM.format(d)} ${gemYear(fmtHY.format(d))}`;
}
/** חגים ומועדים לפי 'חודש-אנגלי יום'. */
