/** חוט · parse-csv — קודם אוטומטית (אפיון-Golden). חוזה: parse-csv.contract.md */
export function parseCsv(text) {
    const t = text.replace(/^\uFEFF/, '');
    // \u05D6\u05D9\u05D4\u05D5\u05D9-\u05DE\u05E4\u05E8\u05D9\u05D3 (\u05D1\u05E7\u05E9\u05EA-\u05D1\u05E2\u05DC\u05D9\u05DD 9.8): \u05E9\u05D5\u05E8\u05D4 \u05E8\u05D0\u05E9\u05D5\u05E0\u05D4 \u05E2\u05DD \u05D9\u05D5\u05EA\u05E8 \u05D8\u05D0\u05D1\u05D9\u05DD \u05DE\u05E4\u05E1\u05D9\u05E7\u05D9\u05DD \u21D2 TSV
    // (\u05D9\u05D9\u05E6\u05D5\u05D0 ExportHistory \u05DE\u05DE\u05E1\u05D5\u05E3-\u05D4\u05E1\u05DC\u05D9\u05E7\u05D4); \u05D0\u05D7\u05E8\u05EA \u05E4\u05E1\u05D9\u05E7\u05D9\u05DD \u2014 \u05D0\u05E4\u05E1 \u05E9\u05D9\u05E0\u05D5\u05D9 \u05DC\u05E7\u05D1\u05E6\u05D9\u05DD \u05E7\u05D9\u05D9\u05DE\u05D9\u05DD.
    const nl = t.indexOf('\n');
    const firstLine = nl < 0 ? t : t.slice(0, nl);
    const delim = (firstLine.split('\t').length - 1) > (firstLine.split(',').length - 1) ? '\t' : ',';
    const rows = [];
    let row = [];
    let cur = '';
    let q = false;
    for (let i = 0; i < t.length; i++) {
        const ch = t[i];
        if (q) {
            if (ch === '"' && t[i + 1] === '"') {
                cur += '"';
                i++;
            }
            else if (ch === '"' && (i + 1 >= t.length || t[i + 1] === delim || t[i + 1] === '\n' || t[i + 1] === '\r')) {
                q = false;
            }
            else {
                cur += ch;
            }
        }
        else if (ch === '"' && cur === '') {
            q = true;
        }
        else if (ch === delim) {
            row.push(cur);
            cur = '';
        }
        else if (ch === '\n' || ch === '\r') {
            if (ch === '\r' && t[i + 1] === '\n')
                i++;
            row.push(cur);
            cur = '';
            if (row.some((c) => c.trim() !== ''))
                rows.push(row);
            row = [];
        }
        else {
            cur += ch;
        }
    }
    if (cur !== '' || row.length) {
        row.push(cur);
        if (row.some((c) => c.trim() !== ''))
            rows.push(row);
    }
    return rows;
}
/**
 * תאריך מכל פורמט נפוץ בקבצי ייבוא → ISO ‏(YYYY-MM-DD), או '' אם לא זוהה:
 * ISO כמו-שהוא · D/M/Y (גם מפרידי נקודה/מקף, גם שנה דו-ספרתית) ·
 * מספר סידורי של אקסל (בסיס 30/12/1899).
 */
