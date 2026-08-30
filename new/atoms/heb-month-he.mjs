/** חוט · heb-month-he — שם-חודש עברי. חוזה: heb-month-he.contract.md */
// פרוטוקול-חיצוני: תגי-Intl של הדפדפן — שפת-הפלטפורמה, לא דאטה-שלנו
const fmtHM = new Intl.DateTimeFormat('he-u-ca-hebrew', { month: 'long' });
export const hebMonthHe = (d) => (isNaN(d.getTime()) ? '' : fmtHM.format(d));
