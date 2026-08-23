/** 🪨 טיוטת-חוט (דרגת-מחצבה) · parseXlsxSheet — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/xlsx.ts:55-106 (52 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): parseXlsxSheet, unzipSync, readSharedStrings, strFromU8, colRefToIndex, unescapeXml
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function parseXlsxSheet(bytes) {
    let files;
    try {
        files = unzipSync(bytes);
    }
    catch {
        return [];
    }
    const shared = files['xl/sharedStrings.xml']
        ? readSharedStrings(strFromU8(files['xl/sharedStrings.xml']))
        : [];
    // הגיליון בעל המספר הנמוך ביותר (sheet1.xml הוא הראשון בפועל בכל היצואים).
    const sheetPath = Object.keys(files)
        .filter((n) => /^xl\/worksheets\/sheet\d+\.xml$/.test(n))
        .sort()[0];
    if (!sheetPath)
        return [];
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
            if (t === 'inlineStr') {
                // שרשור כל ה-<t> בתוך <is> (טקסט-עשיר מוטבע)
                const isRe = /<t[^>]*>([\s\S]*?)<\/t>/g;
                let im;
                while ((im = isRe.exec(inner)))
                    val += im[1];
                val = unescapeXml(val);
            }
            else {
                const vM = /<v>([\s\S]*?)<\/v>/.exec(inner);
                const raw = vM ? vM[1] : '';
                val = t === 's' ? (shared[Number(raw)] ?? '') : unescapeXml(raw);
            }
            while (cells.length < idx)
                cells.push('');
            cells[idx] = val;
            auto = idx + 1;
        }
        rows.push(cells);
    }
    return rows;
}
