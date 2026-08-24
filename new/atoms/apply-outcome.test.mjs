import { applyOutcome } from './apply-outcome.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);
const cur = (c) => (c.queue.length ? c.queue[0] : null);
const RQ = ['noanswer', 'skip'];
const T = '2026-08-24T10:00:00';

// 1) תוצאה סופית — יוצא מהתור, נרשם ליומן בלי note
const c1 = { queue: ['a', 'b'], log: [] };
const o1 = applyOutcome(c1, 'donated', '', T, cur, RQ);
eq(o1.queue, ['b'], 'סופית: התור שגוי');
eq(o1.log, [{ id: 'a', outcome: 'donated', at: T }], 'סופית: היומן שגוי');
ok(!('note' in o1.log[0]), 'note ריק נרשם בכל-זאת');

// 2) חזרה-לתור — עובר לסוף
const o2 = applyOutcome({ queue: ['a', 'b'], log: [] }, 'noanswer', '', T, cur, RQ);
eq(o2.queue, ['b', 'a'], 'requeue: לא עבר לסוף-התור');

// 3) הערה קטומה
const o3 = applyOutcome({ queue: ['a'], log: [] }, 'callback', '  לחזור מחר  ', T, cur, RQ);
ok(o3.log[0].note === 'לחזור מחר', 'ההערה לא נקטמה');

// 4) הערת-רווחים בלבד ⇒ אין שדה note
const o4 = applyOutcome({ queue: ['a'], log: [] }, 'done', '   ', T, cur, RQ);
ok(!('note' in o4.log[0]), 'הערת-רווחים נרשמה');

// 5) תור ריק ⇒ no-op (אותה רפרנס)
const c5 = { queue: [], log: [] };
ok(applyOutcome(c5, 'donated', '', T, cur, RQ) === c5, 'תור ריק לא החזיר את אותו קמפיין');

// 6) immutability — הקמפיין הנכנס לא שוכתב
eq(c1.queue, ['a', 'b'], 'c הנכנס שוכתב (queue)');
eq(c1.log, [], 'c הנכנס שוכתב (log)');

// 7) היומן נצבר
const o7 = applyOutcome({ queue: ['b'], log: [{ id: 'a', outcome: 'donated', at: T }] }, 'skip', '', 'T2', cur, RQ);
ok(o7.log.length === 2 && o7.log[0].id === 'a' && o7.log[1].id === 'b', 'היומן לא נצבר בסדר');

if (f) process.exit(1);
console.log('✓ apply-outcome: 7 דוגמאות-חוזה — ירוק');
