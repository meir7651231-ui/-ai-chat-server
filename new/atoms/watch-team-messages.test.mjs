import { watchTeamMessages as __pure_watchTeamMessages } from './watch-team-messages.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_watchTeamMessages_WATCH_TEAM_MESSAGES_T = {
  k1: "teamChats",
  k2: "messages",
};
const watchTeamMessages = (...a) => __pure_watchTeamMessages(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_watchTeamMessages_WATCH_TEAM_MESSAGES_T);
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
const ret = watchTeamMessages('kehila', (msgs) => seen.push(msgs), fs);

// 1) collection(db,'teamChats','kehila','messages') + onSnapshot על ההפניה
chk('1 נתיב-אוסף + האזנה',
  colCalls.length === 1 && colCalls[0][0] === db &&
  JSON.stringify(colCalls[0].slice(1)) === JSON.stringify(['teamChats', 'kehila', 'messages']) &&
  snapCalls.length === 1 && snapCalls[0][0] === colRef);

// 2) הערך המוחזר = ה-unsubscribe של onSnapshot
chk('2 מחזיר את unsubscribe של onSnapshot', ret === unsub);

// 3) צילום עם 2 הודעות ⇒ גופי-data בסדר-המסמכים, בלי id
const next = snapCalls[0][1];
next({ docs: [
  { id: 't1', data: () => ({ sender: 'a@b.com', name: 'ענת', text: 'בוקר טוב', at: '2026-08-24T08:00:00.000Z' }) },
  { id: 't2', data: () => ({ sender: 'c@d.com', name: 'דנה', text: 'מגיעה', at: '2026-08-24T08:02:00.000Z' }) },
] });
chk('3 גופי-הודעות בסדר, בלי id',
  seen.length === 1 && JSON.stringify(seen[0]) === JSON.stringify([
    { sender: 'a@b.com', name: 'ענת', text: 'בוקר טוב', at: '2026-08-24T08:00:00.000Z' },
    { sender: 'c@d.com', name: 'דנה', text: 'מגיעה', at: '2026-08-24T08:02:00.000Z' },
  ]) && seen[0].every((m) => !('id' in m)));

// 4) צילום ריק ⇒ cb([])
next({ docs: [] });
chk('4 צילום ריק ⇒ מערך ריק', seen.length === 2 && JSON.stringify(seen[1]) === JSON.stringify([]));

// 5) error-callback שקט
let quiet = true;
try { snapCalls[0][2](new Error('permission-denied')); } catch { quiet = false; }
chk('5 שגיאת-האזנה נבלעת בשקט', quiet && seen.length === 2);

if (f) process.exit(1);
console.log('✓ watch-team-messages: 5 דוגמאות-חוזה (נתיב+גופים+כשל-רך) — ירוק');
