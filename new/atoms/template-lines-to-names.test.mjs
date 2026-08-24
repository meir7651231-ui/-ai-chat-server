import { templateLinesToNames } from './template-lines-to-names.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const nid = (i) => 'id' + i;
// 1) שורה מלאה: trim + eyes + done:false + rate
const r1 = templateLinesToNames([{ name: ' צבע ', qty: 3, rate: 120 }], nid);
ok(eq(r1, [{ id: 'id0', name: 'צבע', eyes: 3, done: false, rate: 120 }]), 'דוגמה 1: שורה מלאה שגויה — ' + JSON.stringify(r1));
// 2) rate לא-חיובי ⇒ אין מפתח rate
const r2 = templateLinesToNames([{ name: 'א', qty: 1, rate: 0 }, { name: 'ב', qty: 1, rate: -5 }], nid);
ok(!('rate' in r2[0]) && !('rate' in r2[1]), 'דוגמה 2: rate לא-חיובי נכנס');
// 3) ריקי-שם מסולקים
const r3 = templateLinesToNames([{ name: '  ', qty: 1, rate: 9 }, { name: '', qty: 2, rate: 9 }], nid);
ok(r3.length === 0, 'דוגמה 3: ריק-שם לא סולק');
// 4) qty שבור ⇒ 0; מחרוזת-מספר ⇒ מספר
const r4 = templateLinesToNames(
  [{ name: 'א', qty: 'ab', rate: 0 }, { name: 'ב', rate: 0 }, { name: 'ג', qty: '4', rate: 0 }],
  nid,
);
ok(r4[0].eyes === 0 && r4[1].eyes === 0 && r4[2].eyes === 4, 'דוגמה 4: המרת-qty שגויה');
// 5) מזהים לפי מקום-אחרי-סינון
const r5 = templateLinesToNames(
  [{ name: '', qty: 1, rate: 0 }, { name: 'א', qty: 1, rate: 0 }, { name: 'ב', qty: 1, rate: 0 }],
  nid,
);
ok(r5.length === 2 && r5[0].id === 'id0' && r5[1].id === 'id1', 'דוגמה 5: הריק צרך מזהה');
if (f) process.exit(1);
console.log('✓ template-lines-to-names: 5 דוגמאות-חוזה — ירוק');
