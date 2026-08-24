import { enrollmentsForSession } from './enrollments-for-session.mjs';
// שקעים אמיתיים כסמנטיקת-maor (מקומיים לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const sessionsOf = (c) => (c.sessions && c.sessions.length ? c.sessions : [{ day: c.weekday, time: c.time, label: '' }]);
const groupLabelOf = (ss, i) => ss.label || 'קבוצה ' + (i + 1);
const db = { enrollments: [
  { id: 'e1', courseId: 'c1', group: 'א' },
  { id: 'e2', courseId: 'c1', group: 'ב' },
  { id: 'e3', courseId: 'c1' },
  { id: 'e4', courseId: 'c2', group: 'א' },
] };
const ids = (r) => r.map((e) => e.id).join(',');
let f = 0;
const chk = (name, got, want) => { if (got !== want) { console.error(`✗ ${name}: ${got} ≠ ${want}`); f = 1; } };
// 1 — מפגש-יחיד ⇒ כל שיבוצי-החוג
chk('דוגמה 1', ids(enrollmentsForSession(db, { id: 'c1', weekday: 2, time: '16:00' }, 0, sessionsOf, groupLabelOf)), 'e1,e2,e3');
// 2 — קבוצת 'א' + חסרי-שיוך
const c2 = { id: 'c1', sessions: [{ label: 'א' }, { label: 'ב' }] };
chk('דוגמה 2', ids(enrollmentsForSession(db, c2, 0, sessionsOf, groupLabelOf)), 'e1,e3');
// 3 — קבוצת 'ב' + חסרי-שיוך
chk('דוגמה 3', ids(enrollmentsForSession(db, c2, 1, sessionsOf, groupLabelOf)), 'e2,e3');
// 4 — אינדקס מעבר-לטווח נצמד לאחרון
chk('דוגמה 4', ids(enrollmentsForSession(db, c2, 5, sessionsOf, groupLabelOf)), 'e2,e3');
// 5 — תווית נגזרת 'קבוצה 2' כשאין label
const db5 = { enrollments: [{ id: 'g1', courseId: 'c9', group: 'קבוצה 2' }] };
chk('דוגמה 5', ids(enrollmentsForSession(db5, { id: 'c9', sessions: [{}, {}] }, 1, sessionsOf, groupLabelOf)), 'g1');
if (f) process.exit(1);
console.log('✓ enrollments-for-session: 5 דוגמאות-חוזה — ירוק');
