/** 🪨 טיוטת-חוט (דרגת-מחצבה) · rangeLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/reports/lib.ts:32-38 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): rangeLabel, fmtDate
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function rangeLabel(r) {
    if (!r.from && !r.to)
        return 'כל התאריכים';
    if (r.from && r.to)
        return `${fmtDate(r.from)} – ${fmtDate(r.to)}`;
    return r.from ? 'מ-' + fmtDate(r.from) : 'עד ' + fmtDate(r.to);
}
/** סה"כ ששולם בשיבוץ (כל התשלומים). */
