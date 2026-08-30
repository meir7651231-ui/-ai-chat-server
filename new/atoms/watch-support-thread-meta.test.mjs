import { watchSupportThreadMeta as __pure_watchSupportThreadMeta } from './watch-support-thread-meta.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_watchSupportThreadMeta_WATCH_SUPPORT_THREAD_META_T = {
  k1: "supportChats",
};
const watchSupportThreadMeta = (...a) => __pure_watchSupportThreadMeta(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_watchSupportThreadMeta_WATCH_SUPPORT_THREAD_META_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const ref = { __ref: true };
const unsub = () => 'unsubbed';
const docCalls = [];
const snapCalls = [];
const fs = {
  db,
  doc: (...a) => { docCalls.push(a); return ref; },
  onSnapshot: (...a) => { snapCalls.push(a); return unsub; },
};

const seen = [];
const ret = watchSupportThreadMeta('u77', (t) => seen.push(t), fs);

// 1) doc(db,'supportChats','u77') + onSnapshot על ההפניה
chk('1 נתיב-מסמך + האזנה',
  docCalls.length === 1 && docCalls[0][0] === db &&
  JSON.stringify(docCalls[0].slice(1)) === JSON.stringify(['supportChats', 'u77']) &&
  snapCalls.length === 1 && snapCalls[0][0] === ref);

// 2) הערך המוחזר = ה-unsubscribe של onSnapshot
chk('2 מחזיר את unsubscribe של onSnapshot', ret === unsub);

// 3) מסמך קיים ⇒ cb(המטא)
const next = snapCalls[0][1];
next({ exists: () => true, data: () => ({ lastText: 'תודה', unreadUser: 2, lastFrom: 'admin' }) });
chk('3 קיים ⇒ cb(מטא)',
  seen.length === 1 &&
  JSON.stringify(seen[0]) === JSON.stringify({ lastText: 'תודה', unreadUser: 2, lastFrom: 'admin' }));

// 4) מסמך לא-קיים ⇒ cb(null)
next({ exists: () => false, data: () => ({ לא: 'אמור-להיקרא' }) });
chk('4 אין-שיחה-עדיין ⇒ cb(null)', seen.length === 2 && seen[1] === null);

// 5) error-callback שקט
let quiet = true;
try { snapCalls[0][2](new Error('permission-denied')); } catch { quiet = false; }
chk('5 שגיאת-האזנה נבלעת בשקט', quiet && seen.length === 2);

if (f) process.exit(1);
console.log('✓ watch-support-thread-meta: 5 דוגמאות-חוזה (נתיב+מטא/null+כשל-רך) — ירוק');
