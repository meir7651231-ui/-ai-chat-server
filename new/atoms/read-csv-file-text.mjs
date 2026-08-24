/** חוט · read-csv-file-text — קריאת קובץ-ייבוא לטקסט: bytes מהקובץ ⇒ מפענח.
 *  חוזה: read-csv-file-text.contract.md
 *  חולץ כלשונו מ-maor/src/lib/csvx.ts:64-71; השכן decodeCsvBuffer (זיהוי-קידוד
 *  UTF-8/UTF-16/windows-1255) הוזרק כפרמטר-שקע (חוק-1 — אפס import פנימי). */
export async function readCsvFileText(file, decodeCsvBuffer) {
  return decodeCsvBuffer(await file.arrayBuffer());
}
