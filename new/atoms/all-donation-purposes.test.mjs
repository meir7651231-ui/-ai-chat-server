import { allDonationPurposes } from './all-donation-purposes.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const p = (s) => s.tags; // שקע-הבדיקה (החוזה: שקע p = (s)=>s.tags)
// 1) רשימה ריקה — אפס קריאות-שקע
let calls = 0;
ok(eq(allDonationPurposes([], (s) => { calls++; return p(s); }), []), '[] ⇒ לא []');
ok(calls === 0, 'רשימה ריקה קראה לשקע');
// 2) מיזוג + מיון עברי
ok(eq(allDonationPurposes([{ tags: ['ב', 'א'] }, { tags: ['ג'] }], p), ['א', 'ב', 'ג']), 'מיזוג/מיון עברי נכשל');
// 3) דדופ
ok(eq(allDonationPurposes([{ tags: ['חתן'] }, { tags: ['חתן', 'כלה'] }], p), ['חתן', 'כלה']), 'דדופ נכשל');
// 4) תורם בלי ייעודים
ok(eq(allDonationPurposes([{ tags: [] }], p), []), 'תורם ריק תרם ערכים');
// 5) מיון לטיני
ok(eq(allDonationPurposes([{ tags: ['b'] }, { tags: ['a'] }], p), ['a', 'b']), 'מיון לטיני נכשל');
if (f) process.exit(1);
console.log('✓ all-donation-purposes: 5 דוגמאות-חוזה — ירוק');
