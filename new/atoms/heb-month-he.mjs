/** חוט · heb-month-he — שם-חודש עברי. חוזה: heb-month-he.contract.md */
const fmtHM = new Intl.DateTimeFormat('he-u-ca-hebrew', { month: 'long' });
export const hebMonthHe = (d) => (isNaN(d.getTime()) ? '' : fmtHM.format(d));
