import { roomsNow as __pure_roomsNow } from './rooms-now.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_rooms_now_T = {
  k1: 60,
};
const roomsNow = (...a) => __pure_roomsNow(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_rooms_now_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const sessionsOf = (c) => c.sessions || [];
const now = new Date('2026-08-24T10:15:00'); // יום שני, getDay()=1

const r1 = { id: 'r1', active: true };            // slot ברירת-מחדל 60
const r2 = { id: 'r2', active: false };           // מושבת — לא מוחזר
const r3 = { id: 'r3', active: true, slot: 30 };  // משבצות 30 דק׳
const c1 = { id: 'c1', roomId: 'r1', sessions: [{ day: 1, time: '10:00' }] };
const c3 = { id: 'c3', roomId: 'r3', sessions: [{ day: 1, time: '09:40' }] };
const db = { rooms: [r1, r2, r3], courses: [c1, c3] };

// 1) מושבת לא מוחזר
const out = roomsNow(db, now, sessionsOf);
chk('1 שני חדרים בלבד (r2 מושבת הושמט)',
  out.length === 2 && out[0].room === r1 && out[1].room === r3);

// 2) r1 תפוס ע"י c1 — ‏10:15 בתוך [10:00,11:00)
chk('2 r1 תפוס עם c1', out[0].busyWith === c1);

// 3) r3 פנוי — slot 30: ‏09:40+30=10:10 ≤ 10:15
chk('3 r3 פנוי (המשבצת נגמרה)', out[1].busyWith === undefined);

// 4) גבולות: בדיוק בתחילת המפגש = תפוס; בדיוק בסופו = פנוי
const at10 = roomsNow(db, new Date('2026-08-24T10:00:00'), sessionsOf);
chk('4א ‏10:00 בדיוק ⇒ r1 תפוס', at10[0].busyWith === c1);
const at11 = roomsNow(db, new Date('2026-08-24T11:00:00'), sessionsOf);
chk('4ב ‏11:00 בדיוק ⇒ r1 פנוי (קצה פתוח)', at11[0].busyWith === undefined);

// 5) יום אחר / מפגש בלי time — מדולגים
const db5 = {
  rooms: [r1],
  courses: [{ id: 'c9', roomId: 'r1', sessions: [{ day: 2, time: '10:00' }, { day: 1 }] }],
};
chk('5 ‏day אחר ובלי time ⇒ פנוי', roomsNow(db5, now, sessionsOf)[0].busyWith === undefined);

if (f) process.exit(1);
console.log('✓ rooms-now: 5 דוגמאות-חוזה — ירוק');
