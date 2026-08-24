import { progress } from './progress.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const RQ = ['noanswer', 'skip'];
const T = '2026-08-24T10:00:00';
const L = (id, outcome) => ({ id, outcome, at: T });

// 1) בסיס: אחד נסגר, שניים נותרו
const p1 = progress({ total: 3, queue: ['b', 'c'], log: [L('a', 'donated')] }, RQ);
ok(p1.total === 3 && p1.remaining === 2 && p1.finalized === 1, 'בסיס: total/remaining/finalized שגויים');
ok(p1.counts.donated === 1, 'בסיס: donated≠1');
ok(['noanswer', 'refused', 'callback', 'done', 'skip'].every((k) => p1.counts[k] === 0), 'בסיס: מפתח לא-אפסי');

// 2) התיקון (20.8): לא-ענה פר-אדם, לא פר-ניסיון
const p2 = progress({ total: 1, queue: ['a'], log: [L('a', 'noanswer'), L('a', 'noanswer'), L('a', 'noanswer')] }, RQ);
ok(p2.counts.noanswer === 1, 'פר-אדם: 3 ניסיונות של אותו מזהה נספרו ' + p2.counts.noanswer);
ok(p2.remaining === 1 && p2.finalized === 0, 'פר-אדם: remaining/finalized שגויים');

// 3) שני אנשים שלא ענו — ייחודי פר-מזהה
const p3 = progress({ total: 2, queue: ['a', 'b'], log: [L('a', 'noanswer'), L('b', 'noanswer'), L('a', 'noanswer')] }, RQ);
ok(p3.counts.noanswer === 2, 'שני-אנשים: noanswer≠2');

// 4) סופית נספרת פר-רשומה
const p4 = progress({ total: 2, queue: [], log: [L('a', 'donated'), L('b', 'donated')] }, RQ);
ok(p4.counts.donated === 2 && p4.finalized === 2, 'סופית: donated/finalized שגויים');

// 5) קמפיין ריק — כל המפתחות קיימים ואפס
const p5 = progress({ total: 0, queue: [], log: [] }, RQ);
ok(p5.total === 0 && p5.remaining === 0 && p5.finalized === 0, 'ריק: מדדים שגויים');
ok(Object.keys(p5.counts).length === 6 && Object.values(p5.counts).every((v) => v === 0), 'ריק: counts לא 6×0');

// 6) קיטום finalized ל-0 + תור ייחודי (Set)
const p6 = progress({ total: 0, queue: ['a'], log: [] }, RQ);
ok(p6.finalized === 0, 'קיטום: finalized שלילי');
ok(progress({ total: 2, queue: ['a', 'a'], log: [] }, RQ).remaining === 1, 'Set: כפילות בתור נספרה פעמיים');

if (f) process.exit(1);
console.log('✓ progress: 6 דוגמאות-חוזה — ירוק (ספירה פר-אדם 20.8 שמורה)');
