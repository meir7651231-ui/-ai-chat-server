import { undoLast } from './undo-last.mjs';
let f = 0;
const RQ = ['noanswer', 'skip'];
const T = '2026-08-24';
const eq = (a, b, msg) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; }
};

// 1) ביטול תוצאה-סופית — חוזר לחזית, היומן מתרוקן
{
  const out = undoLast({ queue: ['b'], log: [{ id: 'a', outcome: 'donated', at: T }] }, RQ);
  eq(out.queue, ['a', 'b'], 'דוגמה 1: queue');
  eq(out.log, [], 'דוגמה 1: log');
}

// 2) ביטול requeue — מוסר מהסוף וחוזר לחזית
{
  const out = undoLast({ queue: ['b', 'a'], log: [{ id: 'a', outcome: 'noanswer', at: T }] }, RQ);
  eq(out.queue, ['a', 'b'], 'דוגמה 2: queue');
  eq(out.log, [], 'דוגמה 2: log');
}

// 3) המזהה פעמיים בתור — מוסר האחרון (lastIndexOf)
{
  const out = undoLast({ queue: ['a', 'b', 'a'], log: [{ id: 'a', outcome: 'skip', at: T }] }, RQ);
  eq(out.queue, ['a', 'a', 'b'], 'דוגמה 3: queue');
}

// 4) requeue כשהמזהה לא בתור — התור לא נפגע, רק חזרה לחזית
{
  const out = undoLast({ queue: ['b'], log: [{ id: 'a', outcome: 'noanswer', at: T }] }, RQ);
  eq(out.queue, ['a', 'b'], 'דוגמה 4: queue');
}

// 5) יומן ריק — no-op באותה רפרנס
{
  const c = { queue: ['a'], log: [] };
  if (undoLast(c, RQ) !== c) { console.error('✗ דוגמה 5: לא הוחזר אותו אובייקט'); f = 1; }
}

// 6) רק הרשומה האחרונה נמחקת + immutability
{
  const log = [{ id: 'a', outcome: 'donated', at: T }, { id: 'b', outcome: 'refused', at: T }];
  const c = { queue: ['c'], log };
  const out = undoLast(c, RQ);
  eq(out.log, [{ id: 'a', outcome: 'donated', at: T }], 'דוגמה 6: הרשומה הראשונה נשארת');
  eq(out.queue, ['b', 'c'], 'דוגמה 6: queue');
  eq(c.queue, ['c'], 'דוגמה 6: c.queue המקורי השתנה');
  if (c.log.length !== 2) { console.error('✗ דוגמה 6: c.log המקורי השתנה'); f = 1; }
}

if (f) process.exit(1);
console.log('✓ undo-last: 6 דוגמאות-חוזה — ירוק');
