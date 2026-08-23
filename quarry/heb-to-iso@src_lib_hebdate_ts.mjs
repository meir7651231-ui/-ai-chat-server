/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hebToIso — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebdate.ts:100-106 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hebToIso, monthEnOf, hebToIsoEn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function hebToIso(day, monthHe, hebYear) {
    const en = monthEnOf(monthHe);
    if (!en)
        return null;
    return hebToIsoEn(day, en, hebYear);
}
/** לועזי→עברי: '2026-08-06' → { day: 23, monthHe: 'אב', year: 5786 }. */
