import { filterAssignments } from './filter-assignments.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

const db = {
  families: [{ id: 'f1', name: 'משפחת פרץ' }, { id: 'f2', name: 'משפחת גל' }, { id: 'f3', name: 'משפחת כהן' }],
  shopProducts: [{ id: 'p1', name: 'חבילת פסח' }, { id: 'p2', name: 'חבילת חורף' }],
  shopAssignments: [
    { id: 'a1', famId: 'f1', productId: 'p1', status: 'active', since: '2026-01-01' },
    { id: 'a2', famId: 'f2', productId: 'p1', status: 'active', since: '2026-03-01' },
    { id: 'a3', famId: 'f3', productId: 'p2', status: 'done', since: '2026-02-01' },
  ],
};
// שקעים מקומיים לבדיקה (הבדיקה מייבאת רק את האטום שלה)
const PEND = { a1: 1, a2: 2, a3: 0 };
const PROG = { a1: 0.5, a2: 0, a3: 1 };
const HOLS = [{ iso: '2026-04-02', name: 'פסח' }];
const seen = { upcalls: [], pendHolidays: [] };
const upcomingHolidays = (from, days) => { seen.upcalls.push([from, days]); return HOLS; };
const pendingCount = (d, a, holidays) => { seen.pendHolidays.push(holidays); return PEND[a.id]; };
const progressOf = (d, a) => PROG[a.id];
const smartFilter = (q, items, getTerms) =>
  !q ? items.slice() : items.filter((it) => getTerms(it).some((t) => String(t).includes(q)));
const S = [upcomingHolidays, 30, pendingCount, smartFilter, progressOf];
const ids = (rows) => rows.map((r) => r.id);
const run = (q, status, pendingOnly, productId, sort, todayIso) =>
  filterAssignments(db, q, status, pendingOnly, productId, sort, todayIso, ...S);

// 1 — sort='pending': ממתינים לפי since עולה, ממומש-כולו אחרון
eq(ids(run('', '', false, '', 'pending', undefined)), ['a1', 'a2', 'a3'], 'דוגמה 1 · pending');
// בלי todayIso ⇒ holidays=undefined מושחל
ok(seen.pendHolidays.every((h) => h === undefined), 'דוגמה 1 · holidays אמור להיות undefined');
// 2 — סינון סטטוס
eq(ids(run('', 'active', false, '', 'pending', undefined)), ['a1', 'a2'], 'דוגמה 2 · status');
// 3 — סינון חבילה
eq(ids(run('', '', false, 'p2', 'pending', undefined)), ['a3'], 'דוגמה 3 · productId');
// 4 — pendingOnly
eq(ids(run('', '', true, '', 'pending', undefined)), ['a1', 'a2'], 'דוגמה 4 · pendingOnly');
// 5 — sort='name' עברית עולה
eq(ids(run('', '', false, '', 'name', undefined)), ['a2', 'a3', 'a1'], 'דוגמה 5 · name');
// 6 — sort='progress' עולה
eq(ids(run('', '', false, '', 'progress', undefined)), ['a2', 'a1', 'a3'], 'דוגמה 6 · progress');
// 7 — q על שם-החבילה + השחלת-החגים כלשונה
eq(ids(run('חורף', '', false, '', 'pending', undefined)), ['a3'], 'דוגמה 7 · q=חורף');
seen.upcalls.length = 0; seen.pendHolidays.length = 0;
eq(ids(run('', '', true, '', 'pending', '2026-03-20')), ['a1', 'a2'], 'דוגמה 7 · pendingOnly עם todayIso');
eq(seen.upcalls, [['2026-03-20', 30]], 'דוגמה 7 · קריאת upcomingHolidays');
ok(seen.pendHolidays.length > 0 && seen.pendHolidays.every((h) => h === HOLS), 'דוגמה 7 · holidays לא הושחל כלשונו');

if (f) process.exit(1);
console.log('✓ filter-assignments: 7 דוגמאות-חוזה — ירוק');
