import { annualReportLines as __pure_annualReportLines } from './annual-report-lines.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_annualReportLines_ANNUAL_REPORT_LINES_T = {
  k1: "        דוח תרומות שנתי — שנת ",
  k2: "הארגון: ",
  k3: "מס׳ עמותה/מלכ\"ר: ",
  k4: "התורם/ת: ",
  k5: " · ת\"ז ",
  k6: "אין תרומות רשומות בשנת ",
  k7: "  קבלה ",
  k8: "סה\"כ ",
  k9: " תרומות בשנת ",
  k10: "סה\"כ בשקלים: ",
  k11: "סה\"כ בדולרים: ",
  k12: "לארגון אישור מוסד ציבורי לעניין תרומות לפי סעיף 46 לפקודת מס הכנסה.",
  k13: "דוח-ריכוז זה אינו קבלה — הקבלות המקוריות צוינו לצד כל תרומה.",
};
const annualReportLines = (...a) => __pure_annualReportLines(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_annualReportLines_ANNUAL_REPORT_LINES_T);
// מימושי-שקע לבדיקה — נאמנים למקור (annualReport.ts):
const donationsOfYear = (donations, year) =>
  donations.filter((d) => (d.date || '').startsWith(year + '-')).sort((a, b) => a.date.localeCompare(b.date));
const money = (amount, cur) => (cur === '$' ? '$' : '₪') + amount.toLocaleString('he-IL');
const donations = [
  { date: '2026-03-01', amount: 180, rid: 'D-7' },
  { date: '2026-01-15', amount: 100, cur: '$' },
  { date: '2025-12-31', amount: 999 },
];
const L = annualReportLines(
  { orgName: 'מאור', orgTaxId: '580123456', supporterName: 'דוד לוי', payerId: '012345678', year: '2026', donations, site: 'maor.org' },
  donationsOfYear, money,
);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(L.length === 20, 'אורך ' + L.length + ' ≠ 20');
ok(L[0] === '='.repeat(46), "[0] ≠ 46 סימני '='");
ok(L[1] === '        דוח תרומות שנתי — שנת 2026', '[1] כותרת: ' + L[1]);
ok(L[5] === 'מס׳ עמותה/מלכ"ר: 580123456', '[5]: ' + L[5]);
ok(L[6] === 'התורם/ת: דוד לוי · ת"ז 012345678', '[6]: ' + L[6]);
ok(L[9] === '2026-01-15          $100', '[9]: ' + JSON.stringify(L[9]));
ok(L[10] === '2026-03-01          ₪180  קבלה D-7', '[10]: ' + JSON.stringify(L[10]));
ok(L[12] === 'סה"כ 2 תרומות בשנת 2026', '[12]: ' + L[12]);
ok(L[13] === 'סה"כ בשקלים: ₪180', '[13]: ' + L[13]);
ok(L[14] === 'סה"כ בדולרים: $100', '[14]: ' + L[14]);
ok(L[19] === 'maor.org', '[19]: ' + L[19]);
// אפס-תרומות, בלי taxId/site:
const E = annualReportLines({ orgName: 'מאור', supporterName: 'רות', year: '2027', donations }, donationsOfYear, money);
ok(E.includes('אין תרומות רשומות בשנת 2027.'), 'חסרה שורת אין-תרומות');
ok(!E.some((l) => l.includes('סעיף 46')), 'בלי taxId ⇒ בלי פסקת-§46');
if (f) process.exit(1);
console.log('✓ annual-report-lines: 13 דוגמאות-חוזה — ירוק');
