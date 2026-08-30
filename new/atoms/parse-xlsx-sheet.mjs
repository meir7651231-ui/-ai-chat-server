/** חוט · parse-xlsx-sheet — פענוח הגיליון הראשון של xlsx לרשת-תאים (string[][]).
 *  חוזה: parse-xlsx-sheet.contract.md · שקעים: unzipSync, strFromU8 (ספריית
 *  fflate — תלות-חוץ שוקעה), readSharedStrings, colRefToIndex, unescapeXml
 *  (שכני-הקובץ שוקעו — חוק-1).
 *  חולץ כלשונו מ-maor/src/lib/xlsx.ts:55-106. */
export function parseXlsxSheet(bytes, unzipSync, strFromU8, readSharedStrings, colRefToIndex, unescapeXml, T) {
  let files;
  try {
    files = unzipSync(bytes);
  } catch {
    return [];
  }
  const shared = files[T.k1]
    ? readSharedStrings(strFromU8(files[T.k1]))
    : [];
  // הגיליון בעל המספר הנמוך ביותר (sheet1.xml הוא הראשון בפועל בכל היצואים).
  const sheetPath = Object.keys(files)
    .filter((n) => /^xl\/worksheets\/sheet\d+\.xml$/.test(n))
    .sort()[0];
  if (!sheetPath) return [];
  const xml = strFromU8(files[sheetPath]);
  const rows = [];
  const rowRe = /<row\b[^>]*>([\s\S]*?)<\/row>/g;
  let rm;
  while ((rm = rowRe.exec(xml))) {
    const cells = [];
    const cRe = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
    let cm;
    let auto = 0;
    while ((cm = cRe.exec(rm[1]))) {
      const attrs = cm[1];
      const inner = cm[2] ?? '';
      const refM = /r="([A-Z]+\d+)"/.exec(attrs);
      const idx = refM ? colRefToIndex(refM[1]) : auto;
      const tM = /t="([^"]+)"/.exec(attrs);
      const t = tM ? tM[1] : '';
      let val = '';
      if (t === T.k2) {
        // שרשור כל ה-<t> בתוך <is> (טקסט-עשיר מוטבע)
        const isRe = /<t[^>]*>([\s\S]*?)<\/t>/g;
        let im;
        while ((im = isRe.exec(inner))) val += im[1];
        val = unescapeXml(val);
      } else {
        const vM = /<v>([\s\S]*?)<\/v>/.exec(inner);
        const raw = vM ? vM[1] : '';
        val = t === 's' ? (shared[Number(raw)] ?? '') : unescapeXml(raw);
      }
      while (cells.length < idx) cells.push('');
      cells[idx] = val;
      auto = idx + 1;
    }
    rows.push(cells);
  }
  return rows;
}
