import { weeklyRoomSessions } from './weekly-room-sessions.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const sessionsOf = (c) => c.sessions || [];
const c1 = { id: 'c1', roomId: 'r1', sessions: [{ day: 1 }, { day: 3 }] };
const c2 = { id: 'c2', roomId: 'r1', end: '2026-06-30', sessions: [{ day: 2 }] };
const c3 = { id: 'c3', roomId: 'r2', sessions: [{ day: 4 }] };
const c4 = { id: 'c4', roomId: 'r1', end: '2026-08-24', sessions: [{ day: 5 }] };
const db = { courses: [c1, c2, c3, c4] };

// 1) r1 ב-2026-08-24: c1 (2) + c4 (end==iso ⇒ נכלל, 1) = 3; c2 הסתיים, c3 חדר אחר
chk('1 r1 ⇒ 3 (כולל יום-הסיום עצמו של c4)', weeklyRoomSessions(db, 'r1', '2026-08-24', sessionsOf) === 3);

// 2) r2 ⇒ 1 (רק c3)
chk('2 r2 ⇒ 1', weeklyRoomSessions(db, 'r2', '2026-08-24', sessionsOf) === 1);

// 3) חדר בלי חוגים ⇒ 0; וגם רשימת-חוגים ריקה ⇒ 0
chk('3 r9 ⇒ 0 וגם courses=[] ⇒ 0',
  weeklyRoomSessions(db, 'r9', '2026-08-24', sessionsOf) === 0 &&
  weeklyRoomSessions({ courses: [] }, 'r1', '2026-08-24', sessionsOf) === 0);

// 4) iso=יום-הסיום של c2 ⇒ c2 חוזר להיספר: 2+1+1=4
chk('4 iso=2026-06-30 ⇒ r1 = 4', weeklyRoomSessions(db, 'r1', '2026-06-30', sessionsOf) === 4);

// 5) שקע בהתנהגות sessions-of המלאה: חוג בלי sessions ⇒ נפילה למפגש-יחיד
const fullSessionsOf = (c) => (c.sessions && c.sessions.length ? c.sessions : [{ day: c.weekday }]);
const c5 = { id: 'c5', roomId: 'r3', weekday: 2 };
chk('5 חוג בלי sessions ⇒ 1 דרך הנפילה של השקע',
  weeklyRoomSessions({ courses: [c5] }, 'r3', '2026-08-24', fullSessionsOf) === 1);

if (f) process.exit(1);
console.log('✓ weekly-room-sessions: 5 דוגמאות-חוזה (סינון-חדר+גבול-end+שקע-מפגשים) — ירוק');
