/** בדיקת-קצה: חוט watch-all-support-threads דרך האטום בלבד (חוק-4).
 *  DoD (דיבר 12): node watch-all-support-threads.test.mjs ⇒ exit 0. */
import { watchAllSupportThreads } from './watch-all-support-threads.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const colRef = { __col: true };
const unsub = () => 'unsubbed';
const colCalls = [];
const snapCalls = [];
const fs = {
  db,
  collection: (...a) => { colCalls.push(a); return colRef; },
  onSnapshot: (...a) => { snapCalls.push(a); return unsub; },
};

const seen = [];
const ret = watchAllSupportThreads((threads) => seen.push(threads), fs);

// 1) collection(db,'supportChats') + onSnapshot על ההפניה
chk('1 נתיב-אוסף חלק-אחד + האזנה',
  colCalls.length === 1 && colCalls[0][0] === db &&
  JSON.stringify(colCalls[0].slice(1)) === JSON.stringify(['supportChats']) &&
  snapCalls.length === 1 && snapCalls[0][0] === colRef);

// 2) הערך המוחזר = ה-unsubscribe של onSnapshot
chk('2 מחזיר את unsubscribe של onSnapshot', ret === unsub);

// 3) צילום עם 2 מסמכים ⇒ {uid, ...data} בסדר-המסמכים — ה-uid כן מופיע
const next = snapCalls[0][1];
next({ docs: [
  { id: 'u1', data: () => ({ email: 'a@b.co', lastText: 'שלום', unreadAdmin: 2 }) },
  { id: 'u2', data: () => ({ email: 'c@d.co', lastText: 'היי', unreadAdmin: 0 }) },
] });
chk('3 uid נחשף + גופי-data בסדר',
  seen.length === 1 && JSON.stringify(seen[0]) === JSON.stringify([
    { uid: 'u1', email: 'a@b.co', lastText: 'שלום', unreadAdmin: 2 },
    { uid: 'u2', email: 'c@d.co', lastText: 'היי', unreadAdmin: 0 },
  ]) && seen[0].every((t) => 'uid' in t));

// 4) צילום ריק ⇒ cb([])
next({ docs: [] });
chk('4 צילום ריק ⇒ מערך ריק', seen.length === 2 && JSON.stringify(seen[1]) === JSON.stringify([]));

// 5) error-callback שקט
let quiet = true;
try { snapCalls[0][2](new Error('permission-denied')); } catch { quiet = false; }
chk('5 שגיאת-האזנה נבלעת בשקט', quiet && seen.length === 2);

if (f) process.exit(1);
console.log('✓ watch-all-support-threads: 5 דוגמאות-חוזה (נתיב+uid-נחשף+כשל-רך) — ירוק');
