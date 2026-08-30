import { auditReportLines as __pure_auditReportLines } from './audit-report-lines.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_auditReportLines_AUDIT_REPORT_LINES_T = {
  k1: "דוח תקינות נתונים — ",
  k2: "מאור החסד",
  k3: "הופק: ",
};
const auditReportLines = (...a) => __pure_auditReportLines(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_auditReportLines_AUDIT_REPORT_LINES_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) דוח עם ממצא יחיד
const r1 = auditReportLines('מאור', [{ cat: 'כפילות', title: 'תומך כפול' }], '24.8.2026');
ok(r1.length === 4, 'אורך ≠ 4');
ok(r1[0] === 'דוח תקינות נתונים — מאור', 'כותרת שגויה');
ok(r1[1] === 'הופק: 24.8.2026', 'שורת-הופק שגויה');
ok(r1[2] === '', 'שורת-ההפרדה חסרה');
ok(r1[3] === '[כפילות] תומך כפול', 'שורת-ממצא שגויה');
// 2) שם-ארגון ריק ⇒ ברירת-מחדל
ok(auditReportLines('', [], 'x')[0] === 'דוח תקינות נתונים — מאור החסד', 'ברירת-המחדל לא הופעלה');
// 3) אפס ממצאים ⇒ אורך 3
const r3 = auditReportLines('א', [], 'עכשיו');
ok(r3.length === 3 && r3[2] === '', 'אפס-ממצאים: מבנה שגוי');
// 4) שלושה ממצאים — סדר-הקלט נשמר
const r4 = auditReportLines('ב', [
  { cat: 'קבלות', title: 'פער רץ' },
  { cat: 'תאריכים', title: 'עתידי' },
  { cat: 'כפילות', title: 'שם כפול' },
], 'ת');
ok(r4.length === 6, '3 ממצאים: אורך ≠ 6');
ok(r4[3] === '[קבלות] פער רץ' && r4[4] === '[תאריכים] עתידי' && r4[5] === '[כפילות] שם כפול', 'סדר-הממצאים שובש');
if (f) process.exit(1);
console.log('✓ audit-report-lines: 4 דוגמאות-חוזה — ירוק');
