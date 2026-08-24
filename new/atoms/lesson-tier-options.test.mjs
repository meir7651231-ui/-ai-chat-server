import { lessonTierOptions } from './lesson-tier-options.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) רק מחיר מלא
const r1 = lessonTierOptions({ lessonPrice: 100 });
ok(r1.length === 1 && r1[0].v === '' && r1[0].t === 'מחיר מלא · ₪100', 'דוגמה 1 נשברה');
// 2) חוג ריק ⇒ ₪0
const r2 = lessonTierOptions({});
ok(r2.length === 1 && r2[0].t === 'מחיר מלא · ₪0', 'דוגמה 2 נשברה');
// 3) שם-רמה מותאם
const r3 = lessonTierOptions({ lessonPrice: 100, lessonPrice1: 80, price1Name: 'אח שני' });
ok(r3.length === 2 && r3[1].v === '1' && r3[1].t === 'אח שני · ₪80', 'דוגמה 3 נשברה');
// 4) שם חסר ⇒ ברירת-מחדל
const r4 = lessonTierOptions({ lessonPrice: 100, lessonPrice2: 60 });
ok(r4.length === 2 && r4[1].v === '2' && r4[1].t === 'הנחה 2 · ₪60', 'דוגמה 4 נשברה');
// 5) כל הרמות — סדר קבוע
const r5 = lessonTierOptions({ lessonPrice: 100, lessonPrice1: 80, lessonPrice2: 60, lessonPrice3: 40 });
ok(r5.length === 4 && r5.map((x) => x.v).join(',') === ',1,2,3', 'דוגמה 5 נשברה');
ok(r5[3].t === 'הנחה 3 · ₪40', 'תווית רמה 3 נשברה');
// 6) מחיר-רמה 0 לא נכנס
const r6 = lessonTierOptions({ lessonPrice: 100, lessonPrice2: 0 });
ok(r6.length === 1, 'דוגמה 6 נשברה — מחיר 0 נכנס לרשימה');
if (f) process.exit(1);
console.log('✓ lesson-tier-options: 6 דוגמאות-חוזה — ירוק');
