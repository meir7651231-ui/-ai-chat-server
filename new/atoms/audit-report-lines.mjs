/** חוט · audit-report-lines — שורות דוח-תקינות לייצוא. חוזה: audit-report-lines.contract.md
 *  חולץ כלשונו מ-maor/src/lib/audit.ts:222-227 (תורגם TS→JS). אפס תלויות. */
export function auditReportLines(orgName, issues, nowLabel, T) {
    const L = [T.k1 + (orgName || T.k2), T.k3 + nowLabel, ''];
    for (const i of issues)
        L.push('[' + i.cat + '] ' + i.title);
    return L;
}
