/** חוט · sheet-summary — סיכום-נוכחות ליום: נוכחים (presents כולל את התאריך) מול סך-הגיליון.
 *  חוזה: sheet-summary.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:396-400. */
export function sheetSummary(roster, dateIso) {
    return { present: roster.filter((e) => (e.presents ?? []).includes(dateIso)).length, total: roster.length };
}
