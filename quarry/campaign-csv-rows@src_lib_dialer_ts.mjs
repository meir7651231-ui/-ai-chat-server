/** 🪨 טיוטת-חוט (דרגת-מחצבה) · campaignCsvRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dialer.ts:159-169 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): campaignCsvRows, nameOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function campaignCsvRows(c, nameOf) {
    const rows = [['שם', 'תוצאה', 'הערה', 'מתי']];
    for (const e of c.log) {
        rows.push([nameOf(e.id), OUTCOME_LABELS[e.outcome], e.note ?? '', e.at]);
    }
    return rows;
}
