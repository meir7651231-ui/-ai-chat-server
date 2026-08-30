import { watchIncomingPayments as __pure_watchIncomingPayments } from './watch-incoming-payments.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_watchIncomingPayments_WATCH_INCOMING_PAYMENTS_T = {
  k1: "incomingPayments",
  k2: "status",
  k3: "pending",
};
const watchIncomingPayments = (...a) => __pure_watchIncomingPayments(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_watchIncomingPayments_WATCH_INCOMING_PAYMENTS_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const colRef = { __col: true };
const whereSentinel = { __where: true };
const q = { __q: true };
const unsub = () => 'unsubbed';
const calls = { scopedCol: [], collection: [], where: [], query: [], onSnapshot: [] };
const fs = {
  requireDb: () => db,
  scopedCol: (...a) => { calls.scopedCol.push(a); return 'incomingPayments'; },
  collection: (...a) => { calls.collection.push(a); return colRef; },
  where: (...a) => { calls.where.push(a); return whereSentinel; },
  query: (...a) => { calls.query.push(a); return q; },
  onSnapshot: (...a) => { calls.onSnapshot.push(a); return unsub; },
};

const seen = [];
const ret = watchIncomingPayments((rows) => seen.push(rows), fs);

// 1) ההקמה: scopedCol('incomingPayments') · collection(db, נתיב) · where · query
chk('1 הקמה — scopedCol+collection+where+query',
  calls.scopedCol.length === 1 && calls.scopedCol[0][0] === 'incomingPayments' &&
  calls.collection.length === 1 && calls.collection[0][0] === db &&
  calls.collection[0][1] === 'incomingPayments' &&
  calls.where.length === 1 &&
  JSON.stringify(calls.where[0]) === JSON.stringify(['status', '==', 'pending']) &&
  calls.query.length === 1 && calls.query[0][0] === colRef && calls.query[0][1] === whereSentinel &&
  calls.onSnapshot[0][0] === q);

// 2) הערך המוחזר = ה-unsubscribe של onSnapshot
chk('2 מחזיר את unsubscribe של onSnapshot', ret === unsub);

// 3) צילום עם 2 מסמכים ⇒ שורות {id, ...data}
const next = calls.onSnapshot[0][1];
next({ docs: [
  { id: 'p1', data: () => ({ amount: 350, status: 'pending' }) },
  { id: 'p2', data: () => ({ amount: 1200, status: 'pending' }) },
] });
chk('3 שורות עם id משוטח',
  seen.length === 1 && JSON.stringify(seen[0]) === JSON.stringify([
    { id: 'p1', amount: 350, status: 'pending' },
    { id: 'p2', amount: 1200, status: 'pending' },
  ]));

// 4) צילום ריק ⇒ cb([])
next({ docs: [] });
chk('4 צילום ריק ⇒ מערך ריק', seen.length === 2 && JSON.stringify(seen[1]) === JSON.stringify([]));

// 5) error-callback שקט — אין זריקה, cb לא נקרא
let quiet = true;
try { calls.onSnapshot[0][2](new Error('permission-denied')); } catch { quiet = false; }
chk('5 שגיאת-האזנה נבלעת בשקט', quiet && seen.length === 2);

// 6) requireDb זורק ⇒ no-op-unsub, בלי onSnapshot ובלי cb
const snapCallsBefore = calls.onSnapshot.length;
let noop;
let threw = false;
try {
  noop = watchIncomingPayments(() => { seen.push('לא-אמור'); }, { ...fs, requireDb: () => { throw new Error('אין ענן'); } });
} catch { threw = true; }
chk('6 כשל-הקמה ⇒ no-op-unsub שקט',
  !threw && typeof noop === 'function' && noop() === undefined &&
  calls.onSnapshot.length === snapCallsBefore && seen.length === 2);

if (f) process.exit(1);
console.log('✓ watch-incoming-payments: 6 דוגמאות-חוזה (הקמה+צילומים+כשל-רך כפול) — ירוק');
