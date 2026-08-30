/** חוט · campaign-csv-rows — שורות-CSV לסיכום קמפיין-חיוג. חוזה: campaign-csv-rows.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dialer.ts:159-169; הקבוע-השכן OUTCOME_LABELS
 *  הוזרק כשקע outcomeLabels (חוק-1 — האטום outcome-labels מחובר בקופסה). */
export function campaignCsvRows(c, nameOf, outcomeLabels, T) {
  const rows = [[T.k1, T.k2, T.k3, T.k4]];
  for (const e of c.log) {
    rows.push([nameOf(e.id), outcomeLabels[e.outcome], e.note ?? '', e.at]);
  }
  return rows;
}
