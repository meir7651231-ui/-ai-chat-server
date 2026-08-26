/** חוט · dialer-campaign-csv-rows — Golden. חוזה: dialer-campaign-csv-rows.contract.md
 * מוצא: dialer.ts:121 (campaignCsvRows) + OUTCOME_LABELS:15 (inline). חוק-4 verbatim.
 * שורות-CSV לסיכום (שורה פר-ניסיון, כרונולוגי). nameOf = פרמטר-caller (לא שקע-אטום). טהור.
 */
export function campaignCsvRows(c, nameOf) {
  const OUTCOME_LABELS = { donated: 'תרם/ה', noanswer: 'לא ענה', refused: 'סירב/ה', callback: 'לחזור', done: 'טופל', skip: 'דילוג' };
  const rows = [['שם', 'תוצאה', 'הערה', 'מתי']];
  for (const e of c.log) {
    rows.push([nameOf(e.id), OUTCOME_LABELS[e.outcome], e.note ?? '', e.at]);
  }
  return rows;
}
