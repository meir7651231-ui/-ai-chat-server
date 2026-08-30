import { inactiveRoomCourses as __pure_inactiveRoomCourses } from './inactive-room-courses.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_inactiveRoomCourses_INACTIVE_ROOM_COURSES_T = {
  k1: "entity.room",
  k2: "חדר",
  k3: " לא קיים",
};
const inactiveRoomCourses = (...a) => __pure_inactiveRoomCourses(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_inactiveRoomCourses_INACTIVE_ROOM_COURSES_T);
// שקע-termOf כחוזה-config של maor (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const termOf = (cfg, key, fallback) => cfg?.terms?.[key] ?? fallback;

let f = 0;
const chk = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`✗ ${name}: ${g} ≠ ${w}`); f = 1; }
};

const iso = '2026-08-24';
const cMissing = { id: 'c1', roomId: 'rX' };
const cInactive = { id: 'c2', roomId: 'r1' };
const cActive = { id: 'c3', roomId: 'r2' };
const cEnded = { id: 'c4', roomId: 'r1', end: '2026-08-01' };
const cNoRoom = { id: 'c5' };
const cEndsToday = { id: 'c6', roomId: 'r1', end: '2026-08-24' };
const rooms = [
  { id: 'r1', name: 'סטודיו ב', active: false },
  { id: 'r2', name: 'אולם ראשי', active: true },
];

// 1) חדר לא קיים — fallback 'חדר'
chk('חדר-חסר', inactiveRoomCourses({ courses: [cMissing], rooms }, iso, { terms: {} }, termOf),
  [{ course: cMissing, roomName: 'חדר לא קיים' }]);
// 2) מונח פר-ארגון דרך השקע
chk('מונח-ארגוני', inactiveRoomCourses({ courses: [cMissing], rooms }, iso, { terms: { 'entity.room': 'אולם' } }, termOf),
  [{ course: cMissing, roomName: 'אולם לא קיים' }]);
// 3) חדר לא-פעיל — שם החדר
chk('חדר-לא-פעיל', inactiveRoomCourses({ courses: [cInactive], rooms }, iso, { terms: {} }, termOf),
  [{ course: cInactive, roomName: 'סטודיו ב' }]);
// 4) חדר פעיל — לא אזהרה
chk('חדר-פעיל', inactiveRoomCourses({ courses: [cActive], rooms }, iso, { terms: {} }, termOf), []);
// 5) חוג שהסתיים — מדולג גם כשחדרו לא-פעיל
chk('חוג-שהסתיים', inactiveRoomCourses({ courses: [cEnded], rooms }, iso, { terms: {} }, termOf), []);
// 6) בלי roomId — מדולג · מסתיים-היום (iso ≤ end) — נכלל
chk('בלי-חדר+מסתיים-היום', inactiveRoomCourses({ courses: [cNoRoom, cEndsToday], rooms }, iso, { terms: {} }, termOf),
  [{ course: cEndsToday, roomName: 'סטודיו ב' }]);

if (f) process.exit(1);
console.log('✓ inactive-room-courses: 6 דוגמאות-חוזה — ירוק');
