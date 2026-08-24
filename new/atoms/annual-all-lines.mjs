/** חוט · annual-all-lines — דוח-מרוכז שנתי לכל התורמים.
 *  חוזה: annual-all-lines.contract.md · שקעים: donationsOfYear, annualReportLines
 *  חולץ כלשונו מ-maor/src/lib/annualReport.ts (קריאות-השכן שוקעו). */
export function annualAllLines(orgName, orgTaxId, year, supporters, site, donationsOfYear, annualReportLines) {
  const out = [];
  let count = 0;
  for (const sp of supporters) {
    if (donationsOfYear(sp.donations, year).length === 0) continue;
    if (count > 0) out.push('', '\f', '');
    out.push(...annualReportLines({ orgName, orgTaxId, supporterName: sp.name, payerId: sp.idNum, year, donations: sp.donations, site }));
    count++;
  }
  if (count === 0) out.push('אין תורמים עם תרומות בשנת ' + year + '.');
  return out;
}
