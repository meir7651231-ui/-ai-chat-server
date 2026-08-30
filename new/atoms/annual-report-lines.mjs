/** חוט · annual-report-lines — שורות דוח-שנתי-לתורם.
 *  חוזה: annual-report-lines.contract.md · שקעים: donationsOfYear, money
 *  חולץ כלשונו מ-maor/src/lib/annualReport.ts (קריאות-השכן שוקעו). */
export function annualReportLines(inp, donationsOfYear, money, T) {
  const rows = donationsOfYear(inp.donations, inp.year);
  const ils = rows.filter((d) => d.cur !== '$').reduce((a, d) => a + (Number.isFinite(d.amount) ? d.amount : 0), 0);
  const usd = rows.filter((d) => d.cur === '$').reduce((a, d) => a + (Number.isFinite(d.amount) ? d.amount : 0), 0);
  const out = [
    '='.repeat(46),
    T.k1 + inp.year,
    '='.repeat(46),
    '',
    T.k2 + inp.orgName,
    ...(inp.orgTaxId ? [T.k3 + inp.orgTaxId] : []),
    T.k4 + inp.supporterName + (inp.payerId ? T.k5 + inp.payerId : ''),
    '',
    '-'.repeat(46),
  ];
  if (rows.length === 0) {
    out.push(T.k6 + inp.year + '.');
  } else {
    for (const d of rows) {
      out.push(
        d.date + '  ' + money(d.amount, d.cur).padStart(12) + (d.rid ? T.k7 + d.rid : '') + (d.designation ? '  · ' + d.designation : ''),
      );
    }
  }
  out.push('-'.repeat(46));
  out.push(T.k8 + rows.length + T.k9 + inp.year);
  if (ils > 0) out.push(T.k10 + money(ils));
  if (usd > 0) out.push(T.k11 + money(usd, '$'));
  if (inp.orgTaxId) {
    out.push('');
    out.push(T.k12);
    out.push(T.k13);
  }
  if (inp.site) {
    out.push('');
    out.push(inp.site);
  }
  return out;
}
