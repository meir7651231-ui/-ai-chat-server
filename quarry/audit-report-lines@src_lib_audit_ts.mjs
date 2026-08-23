/** 🪨 טיוטת-חוט (דרגת-מחצבה) · auditReportLines — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/audit.ts:222-227 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): auditReportLines
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function auditReportLines(orgName, issues, nowLabel) {
    const L = ['דוח תקינות נתונים — ' + (orgName || 'מאור החסד'), 'הופק: ' + nowLabel, ''];
    for (const i of issues)
        L.push('[' + i.cat + '] ' + i.title);
    return L;
}
