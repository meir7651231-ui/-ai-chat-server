/** חוט · parse-supporter-csv — פענוח טקסט-CSV לשורות-ייבוא תומכות (הרכבה).
 *  חוזה: parse-supporter-csv.contract.md · שקעים: parseCsv, parseSupporterGrid
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:506-533 (קריאות-השכן שוקעו — חוק-1). */
export function parseSupporterCsv(text, parseCsv, parseSupporterGrid) {
  return parseSupporterGrid(parseCsv(text));
}
