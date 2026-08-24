import { supporterPurposes } from './supporter-purposes.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// 1) איחוד ייחודי, forWho ראשון
ok(eq(supporterPurposes({ forWho: 'ישיבה', donations: [{ purpose: 'אברכים' }, { purpose: 'ישיבה' }] }), ['ישיבה', 'אברכים']), 'דוגמה 1');
// 2) trim — רווחים-בלבד = ריק
ok(eq(supporterPurposes({ forWho: '  ', donations: [{ purpose: ' חסד ' }] }), ['חסד']), 'דוגמה 2');
// 3) אובייקט ריק
ok(eq(supporterPurposes({}), []), 'דוגמה 3');
// 4) ריקים וחסרים לא נאספים
ok(eq(supporterPurposes({ donations: [{ purpose: '' }, {}] }), []), 'דוגמה 4');
// 5) forWho בלבד
ok(eq(supporterPurposes({ forWho: 'צדקה' }), ['צדקה']), 'דוגמה 5');
// 6) סדר-הכנסה, לא מיון
ok(eq(supporterPurposes({ donations: [{ purpose: 'ב' }, { purpose: 'א' }, { purpose: 'ב' }] }), ['ב', 'א']), 'דוגמה 6');
if (f) process.exit(1);
console.log('✓ supporter-purposes: 6 דוגמאות-חוזה — ירוק');
