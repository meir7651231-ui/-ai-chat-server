import { receiptLines as __pure_receiptLines } from './receipt-lines.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_receiptLines_RECEIPT_LINES_T = {
  k1: "העתק נאמן למקור",
  k2: "מקור",
  k3: "מאור החסד",
  k4: "מס׳ עמותה/מלכ\"ר: ",
  k5: "קבלה על תרומה — לפי סעיף 46 לפקודת מס הכנסה",
  k6: "קבלה מס׳: ",
  k7: "קוד-אימות: ",
  k8: "תאריך: ",
  k9: "התקבל בתודה מאת: ",
  k10: "ת\"ז / ח\"פ: ",
  k11: "סכום: ",
  k12: "במילים: ",
  k13: "אמצעי תשלום: ",
  k14: "עבור: ",
  k15: "תרומה זו מוכרת לצורכי מס לפי סעיף 46 לפקודת מס הכנסה.",
  k16: "קבלה זו מהווה אסמכתא לתרומה שהתקבלה.",
  k17: "בכבוד רב,",
  k18: "חתימה וחותמת",
  k19: "אתר: ",
  k20: "אישור תשלום — ",
  k21: "קבלה — ",
  k22: "אישור מס׳: ",
  k23: "התקבל מאת: ",
  k24: "סה\"כ עסקה: ₪",
  k25: " · שולם עד כה: ₪",
  k26: " · יתרה: ₪",
  k27: "תשלום הבא: ",
  k28: "תודה על תמיכתכם",
  k29: 10,
};
const receiptLines = (...a) => __pure_receiptLines(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_receiptLines_RECEIPT_LINES_T);
// מימושי-שקע לבדיקה — כמוגדר בחוזה:
const hebDateFull = (iso) => (isNaN(new Date(iso.slice(0, 10) + 'T12:00:00').getTime()) ? '' : 'י"ב באב התשפ"ו');
const amountInWords = () => 'מאה ושמונים שקלים חדשים';
const verifyCode = () => 'AAA-BBB';
const hebrewLocaleDate = () => '1.9.2026';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// דוגמה 1 — קבלת-§46:
const A = receiptLines(
  { rid: 'D-0007', amount: 1234, date: '2026-08-05', payer: 'דוד לוי', forWhat: 'תרומה כללית', taxReceipt: true, orgName: 'מאור', orgTaxId: '580123456', payerId: '012345678', method: 'מזומן', signatory: 'הרב כהן', site: 'maor.org', verify: true },
  hebDateFull, amountInWords, verifyCode, hebrewLocaleDate,
);
ok(A.length === 23, '§46 אורך ' + A.length + ' ≠ 23');
ok(A[0] === 'מקור', '§46 [0]: ' + A[0]);
ok(A[1] === 'מאור', '§46 [1]: ' + A[1]);
ok(A[2] === 'מס׳ עמותה/מלכ"ר: 580123456', '§46 [2]: ' + A[2]);
ok(A[4] === 'קבלה על תרומה — לפי סעיף 46 לפקודת מס הכנסה', '§46 [4]: ' + A[4]);
ok(A[5] === 'קבלה מס׳: D-0007', '§46 [5]: ' + A[5]);
ok(A[6] === 'קוד-אימות: AAA-BBB', '§46 [6]: ' + A[6]);
ok(A[7] === 'תאריך: י"ב באב התשפ"ו · 5.8.2026', '§46 [7]: ' + A[7]);
ok(A[10] === 'ת"ז / ח"פ: 012345678', '§46 [10]: ' + A[10]);
ok(A[11] === 'סכום: ₪1,234', '§46 [11]: ' + A[11]);
ok(A[12] === 'במילים: מאה ושמונים שקלים חדשים', '§46 [12]: ' + A[12]);
ok(A[20] === 'הרב כהן  ______________________', '§46 [20]: ' + A[20]);
ok(A[22] === 'אתר: maor.org', '§46 [22]: ' + A[22]);

// דוגמה 2 — קבלה רגילה עם סיכום-עסקה:
const B = receiptLines(
  { rid: 'R-0042', amount: 400, date: '2026-08-05', payer: 'רות', forWhat: 'כרטיסייה', copy: true, summary: { totalDue: 1000, paidSoFar: 400, balance: 600, nextDate: '2026-09-01' } },
  hebDateFull, amountInWords, verifyCode, hebrewLocaleDate,
);
ok(B.length === 12, 'רגילה אורך ' + B.length + ' ≠ 12');
ok(B[0] === 'העתק נאמן למקור', 'רגילה [0]: ' + B[0]);
ok(B[1] === 'קבלה — מאור החסד', 'רגילה [1]: ' + B[1]);
ok(B[2] === 'קבלה מס׳: R-0042', 'רגילה [2]: ' + B[2]);
ok(B[5] === 'סכום: ₪400', 'רגילה [5]: ' + B[5]);
ok(B[6] === '', 'רגילה [6] (בלי method): ' + JSON.stringify(B[6]));
ok(B[8] === 'סה"כ עסקה: ₪1000 · שולם עד כה: ₪400 · יתרה: ₪600', 'רגילה [8]: ' + B[8]);
ok(B[9] === 'תשלום הבא: י"ב באב התשפ"ו · 1.9.2026', 'רגילה [9]: ' + B[9]);
ok(B[10] === '', 'רגילה [10] (בלי site): ' + JSON.stringify(B[10]));
ok(B[11] === 'תודה על תמיכתכם', 'רגילה [11]: ' + B[11]);

// דוגמה 3 — אישור-חנות S- בלי סימון:
const C = receiptLines(
  { rid: 'S-0003', amount: 20, date: '2026-08-05', payer: 'משפחת כהן', forWhat: 'מימוש קופון', mark: false, currency: '₪' },
  hebDateFull, amountInWords, verifyCode, hebrewLocaleDate,
);
ok(C[0] === 'אישור תשלום — מאור החסד', 'S- [0]: ' + C[0]);
ok(C[1] === 'אישור מס׳: S-0003', 'S- [1]: ' + C[1]);
ok(C[4] === 'סכום: ₪20', 'S- [4]: ' + C[4]);
ok(C[C.length - 1] === 'תודה על תמיכתכם', 'S- אחרונה: ' + C[C.length - 1]);
ok(!C.includes('מקור'), 'S- ‏mark:false ⇒ אין שורת-מקור');

// דוגמה 4 — תאריך שבור:
const D = receiptLines({ rid: 'R-1', amount: 5, date: 'שטויות', payer: 'א', forWhat: 'ב' }, hebDateFull, amountInWords, verifyCode, hebrewLocaleDate);
ok(D.includes('תאריך: שטויות'), 'תאריך-שבור: ' + D.find((l) => l.startsWith('תאריך')));

if (f) process.exit(1);
console.log('✓ receipt-lines: 27 דוגמאות-חוזה — ירוק');
