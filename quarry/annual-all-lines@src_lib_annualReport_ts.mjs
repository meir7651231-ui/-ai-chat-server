/** 🪨 טיוטת-חוט (דרגת-מחצבה) · annualAllLines — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/annualReport.ts:87-108 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): annualAllLines, donationsOfYear, annualReportLines
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function annualAllLines(orgName, orgTaxId, year, supporters, site) {
    const out = [];
    let count = 0;
    for (const sp of supporters) {
        if (donationsOfYear(sp.donations, year).length === 0)
            continue;
        if (count > 0)
            out.push('', '\f', '');
        out.push(...annualReportLines({ orgName, orgTaxId, supporterName: sp.name, payerId: sp.idNum, year, donations: sp.donations, site }));
        count++;
    }
    if (count === 0)
        out.push('אין תורמים עם תרומות בשנת ' + year + '.');
    return out;
}
/** הורדת-קובץ עם BOM (עברית ב-Notepad) — כמו הקבלות. */
