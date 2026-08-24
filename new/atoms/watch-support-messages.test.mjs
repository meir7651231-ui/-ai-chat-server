import { watchSupportMessages } from './watch-support-messages.mjs';
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
const ret = watchSupportMessages('u77', (msgs) => seen.push(msgs), fs);

// 1) collection(db,'supportChats','u77','messages') + onSnapshot על ההפניה
chk('1 נתיב-אוסף + האזנה',
  colCalls.length === 1 && colCalls[0][0] === db &&
  JSON.stringify(colCalls[0].slice(1)) === JSON.stringify(['supportChats', 'u77', 'messages']) &&
  snapCalls.length === 1 && snapCalls[0][0] === colRef);

// 2) הערך המוחזר = ה-unsubscribe של onSnapshot
chk('2 מחזיר את unsubscribe של onSnapshot', ret === unsub);

// 3) צילום עם 2 הודעות ⇒ גופי-data בלבד, בלי id
const next = snapCalls[0][1];
next({ docs: [
  { id: 'm1', data: () => ({ from: 'user', text: 'שלום', at: '2026-08-24T09:00:00.000Z' }) },
  { id: 'm2', data: () => ({ from: 'admin', text: 'היי', at: '2026-08-24T09:05:00.000Z' }) },
] });
chk('3 גופי-הודעות בלבד (בלי id)',
  seen.length === 1 && JSON.stringify(seen[0]) === JSON.stringify([
    { from: 'user', text: 'שלום', at: '2026-08-24T09:00:00.000Z' },
    { from: 'admin', text: 'היי', at: '2026-08-24T09:05:00.000Z' },
  ]) && seen[0].every((m) => !('id' in m)));

// 4) צילום ריק ⇒ cb([])
next({ docs: [] });
chk('4 צילום ריק ⇒ מערך ריק', seen.length === 2 && JSON.stringify(seen[1]) === JSON.stringify([]));

// 5) error-callback שקט
let quiet = true;
try { snapCalls[0][2](new Error('permission-denied')); } catch { quiet = false; }
chk('5 שגיאת-האזנה נבלעת בשקט', quiet && seen.length === 2);

if (f) process.exit(1);
console.log('✓ watch-support-messages: 5 דוגמאות-חוזה (נתיב+גופים-בלי-id+כשל-רך) — ירוק');
