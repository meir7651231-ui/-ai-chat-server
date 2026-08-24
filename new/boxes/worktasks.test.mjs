/** בדיקת-קצה · קופסת worktasks — מוכיחה את דוגמאות-החוזה דרך הקופסה בלבד.
 *  DoD (נכתב לפני הקוד): node worktasks.test.mjs ⇒ exit 0.
 *  מותר לייבא רק את הקופסה-שלה (חוק-4). */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  identityOf, openTasks, doneToday, isOverdue, stats,
  PRI_LABELS, priLabel, contactDrafts,
} from './worktasks.mjs';

const T = '2026-08-24';
let n = 0;
const ok = (name, cond) => { assert.ok(cond, name); n++; };

// 1) identityOf
ok('id-trim', identityOf(' A@X.co ') === 'a@x.co');
ok('id-empty', identityOf('') === 'מקומי');
ok('id-null', identityOf(null) === 'מקומי');
ok('id-undef', identityOf(undefined) === 'מקומי');

// 2) openTasks — סינון-פתוחות + סינון-זהות + מיון עדיפות⇒יעד⇒יצירה
const tasks = [
  { assignee: 'a@x.co', pri: 2, due: undefined, createdAt: '2026-08-01' },       // p2
  { assignee: 'a@x.co', pri: 1, due: undefined, createdAt: '2026-08-02' },       // p1 no-due
  { assignee: 'a@x.co', pri: 1, due: '2026-08-25', createdAt: '2026-08-03' },    // p1 due25
  { assignee: 'a@x.co', pri: 1, due: '2026-08-20', createdAt: '2026-08-04' },    // p1 due20
  { assignee: 'b@x.co', pri: 1, due: '2026-08-01', createdAt: '2026-08-05' },    // אחר
  { assignee: 'a@x.co', pri: 1, due: '2026-08-01', createdAt: '2026-08-06', doneAt: '2026-08-10' }, // סגורה
];
const open = openTasks(tasks, 'a@x.co');
ok('open-count', open.length === 4);
// מיון: p1+due20 ⇒ p1+due25 ⇒ p1-no-due(9999) ⇒ p2
assert.deepEqual(open.map((t) => t.createdAt), ['2026-08-04', '2026-08-03', '2026-08-02', '2026-08-01']);
n++;
ok('open-nob', open.every((t) => t.assignee === 'a@x.co'));
ok('open-empty', openTasks([], 'a@x.co').length === 0);

// 3) doneToday
const dtasks = [
  { assignee: 'a@x.co', doneAt: '2026-08-24T09:00' },
  { assignee: 'a@x.co', doneAt: '2026-08-23T09:00' },
  { assignee: 'b@x.co', doneAt: '2026-08-24T10:00' },
  { assignee: 'a@x.co' },
];
ok('done-today', doneToday(dtasks, 'a@x.co', T) === 1);
ok('done-today-b', doneToday(dtasks, 'b@x.co', T) === 1);

// 4) isOverdue
ok('over-yes', isOverdue({ due: '2026-08-20' }, T) === true);
ok('over-done', isOverdue({ due: '2026-08-20', doneAt: '2026-08-21' }, T) === false);
ok('over-nodue', isOverdue({}, T) === false);
ok('over-today', isOverdue({ due: T }, T) === false); // due===today אינו לפני-היום

// 5+6) stats
assert.deepEqual(stats([], 'a@x.co', T), { open: 0, overdue: 0, done: 0, doneWeek: 0});
n++;
const s = stats([
  { assignee: 'a@x.co' },                                  // פתוחה בלי-יעד
  { assignee: 'a@x.co', due: '2026-08-20' },               // פתוחה באיחור
  { assignee: 'a@x.co', doneAt: '2026-08-23T09:00' },      // בוצעה השבוע
  { assignee: 'a@x.co', doneAt: '2026-08-10T09:00' },      // בוצעה מזמן
  { assignee: 'b@x.co', due: '2026-08-01' },               // מסוננת
], 'a@x.co', T);
assert.deepEqual(s, { open: 2, overdue: 1, done: 2, doneWeek: 1 });
n++;
// גבול-שבוע
ok('week-6', stats([{ assignee: 'a', doneAt: '2026-08-18' }], 'a', T).doneWeek === 1);
ok('week-7', stats([{ assignee: 'a', doneAt: '2026-08-17' }], 'a', T).doneWeek === 0);
ok('week-future', stats([{ assignee: 'a', doneAt: '2026-08-25' }], 'a', T).doneWeek === 0);
ok('week-future-done', stats([{ assignee: 'a', doneAt: '2026-08-25' }], 'a', T).done === 1);

// 7) priLabel / PRI_LABELS
ok('pri1', priLabel(1) === '🔴 דחוף');
ok('pri2', priLabel(2) === '🟡 רגיל');
ok('pri3', priLabel(3) === '⚪ בהמשך');
assert.deepEqual(PRI_LABELS, { 1: '🔴 דחוף', 2: '🟡 רגיל', 3: '⚪ בהמשך' });
n++;

// 8) contactDrafts — עבר-יעד ⇒ טיוטה, דדופ, גבולות
const drafts = contactDrafts(
  [{ id: 's1', name: 'ראובן', nextDate: '2026-08-20' }], [], 'A@x.co', T);
assert.deepEqual(drafts, [{
  assignee: 'a@x.co', title: '📞 להתקשר — ראובן',
  ref: { kind: 'supporter', id: 's1' }, pri: 1, due: '2026-08-24',
}]);
n++;
const sups = [
  { id: 's1', name: 'א', nextDate: '2026-08-24' }, // היום ⇒ נכלל
  { id: 's2', name: 'ב', nextDate: '2026-08-25' }, // מחר ⇒ לא
  { id: 's3', name: 'ג' },                          // אין nextDate ⇒ לא
];
ok('draft-today-in', contactDrafts(sups, [], 'a@x.co', T).map((d) => d.ref.id).join() === 's1');
// דדופ: קיימת-פתוחה על s1 של אותה עובדת ⇒ מדלג; אחר עדיין
const sups2 = [
  { id: 's1', name: 'א', nextDate: '2026-08-20' },
  { id: 's2', name: 'ב', nextDate: '2026-08-20' },
];
ok('dedup', contactDrafts(sups2, [
  { assignee: 'a@x.co', ref: { kind: 'supporter', id: 's1' } },
], 'a@x.co', T).map((d) => d.ref.id).join() === 's2');
ok('dedup-done', contactDrafts(sups2, [
  { assignee: 'a@x.co', doneAt: '2026-08-22', ref: { kind: 'supporter', id: 's1' } },
], 'a@x.co', T).length === 2); // סגורה אינה חוסמת
ok('dedup-other', contactDrafts(sups2, [
  { assignee: 'b@x.co', ref: { kind: 'supporter', id: 's1' } },
], 'a@x.co', T).length === 2); // עובדת-אחרת אינה חוסמת
ok('dedup-family', contactDrafts(sups2, [
  { assignee: 'a@x.co', ref: { kind: 'family', id: 's1' } },
], 'a@x.co', T).length === 2); // ref.kind אחר אינו נספר

// 🛡 מגן-הכרעה: החיווט (איזה-שכן מוזרק לכל חוט) חי בקופסה verbatim.
const src = readFileSync(new URL('./worktasks.mjs', import.meta.url), 'utf8');
for (const wire of [
  'openTasksFor(tasks, identity, taskIdentity)',
  'doneTodayFor(tasks, identity, todayIso, taskIdentity)',
  'taskStatsFor(tasks, identity, todayIso, taskIdentity, taskOverdue)',
  'overdueContactTaskDrafts(supporters, existing, assignee, todayIso, taskIdentity)',
]) {
  if (!src.includes(wire)) { console.error('✗ מגן-חיווט שונה:', wire); process.exit(1); }
  n++;
}

console.log(`✓ קופסת-worktasks: ${n} טענות — 7 חוטים מחווטים, מגן-חיווט verbatim`);
