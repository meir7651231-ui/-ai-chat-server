/** 🪨 טיוטת-חוט (דרגת-מחצבה) · annualReportLines — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/annualReport.ts:46-86 (41 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): annualReportLines, donationsOfYear, isFinite, repeat, money
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function annualReportLines(inp) {
    const rows = donationsOfYear(inp.donations, inp.year);
    const ils = rows.filter((d) => d.cur !== '$').reduce((a, d) => a + (Number.isFinite(d.amount) ? d.amount : 0), 0);
    const usd = rows.filter((d) => d.cur === '$').reduce((a, d) => a + (Number.isFinite(d.amount) ? d.amount : 0), 0);
    const out = [
        '='.repeat(46),
        '        דוח תרומות שנתי — שנת ' + inp.year,
        '='.repeat(46),
        '',
        'הארגון: ' + inp.orgName,
        ...(inp.orgTaxId ? ['מס׳ עמותה/מלכ"ר: ' + inp.orgTaxId] : []),
        'התורם/ת: ' + inp.supporterName + (inp.payerId ? ' · ת"ז ' + inp.payerId : ''),
        '',
        '-'.repeat(46),
    ];
    if (rows.length === 0) {
        out.push('אין תרומות רשומות בשנת ' + inp.year + '.');
    }
    else {
        for (const d of rows) {
            out.push(d.date + '  ' + money(d.amount, d.cur).padStart(12) + (d.rid ? '  קבלה ' + d.rid : '') + (d.designation ? '  · ' + d.designation : ''));
        }
    }
    out.push('-'.repeat(46));
    out.push('סה"כ ' + rows.length + ' תרומות בשנת ' + inp.year);
    if (ils > 0)
        out.push('סה"כ בשקלים: ' + money(ils));
    if (usd > 0)
        out.push('סה"כ בדולרים: ' + money(usd, '$'));
    if (inp.orgTaxId) {
        out.push('');
        out.push('לארגון אישור מוסד ציבורי לעניין תרומות לפי סעיף 46 לפקודת מס הכנסה.');
        out.push('דוח-ריכוז זה אינו קבלה — הקבלות המקוריות צוינו לצד כל תרומה.');
    }
    if (inp.site) {
        out.push('');
        out.push(inp.site);
    }
    return out;
}
/** דוח-מרוכז לכל התורמים של שנה — מקטע לכל תורם/ת עם מפריד-עמוד. */
