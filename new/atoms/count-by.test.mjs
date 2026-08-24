import { countBy } from './count-by.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const id = (x) => x;
// 1) ספירה + מיון יורד
const r1 = countBy(['תפוח', 'בננה', 'תפוח', 'גזר', 'בננה', 'תפוח'], id);
ok(JSON.stringify(r1) === JSON.stringify([['תפוח', 3], ['בננה', 2], ['גזר', 1]]), '1: ' + JSON.stringify(r1));
// 2) אובייקטים לפי שדה
const r2 = countBy([{ s: 'active' }, { s: 'pending' }, { s: 'active' }], (t) => t.s);
ok(JSON.stringify(r2) === JSON.stringify([['active', 2], ['pending', 1]]), '2: ' + JSON.stringify(r2));
// 3) תיקו — סדר-הופעה נשמר
const r3 = countBy(['ב', 'א', 'ב', 'א'], id);
ok(JSON.stringify(r3) === JSON.stringify([['ב', 2], ['א', 2]]), '3: תיקו לא שמר סדר-הופעה: ' + JSON.stringify(r3));
// 4) ריק
ok(countBy([], id).length === 0, '4: ([]) ≠ []');
if (f) process.exit(1);
console.log('✓ count-by: 4 דוגמאות-חוזה — ירוק');
