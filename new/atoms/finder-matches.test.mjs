import { finderMatches } from './finder-matches.mjs';
// שקע-ייחוס פשוט לבדיקה: ערך-הציר = השדה עצמו
const axisValue = (_db, f, k) => String(f[k] ?? '');
const fams = [
  { id: 1, city: 'צפת', status: 'a' },
  { id: 2, city: 'חיפה', status: 'a' },
  { id: 3, city: 'צפת', status: 'b' },
];
const db = { families: fams };

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const ids = (r) => r.map((x) => x.id).join(',');

// 1) locks ריק ⇒ כולן, בסדר-המקור
ok(ids(finderMatches(db, {}, axisValue)) === '1,2,3', 'דוגמה 1: locks ריק לא החזיר את כולן');
// 2) נעילה אחת
ok(ids(finderMatches(db, { city: 'צפת' }, axisValue)) === '1,3', 'דוגמה 2: נעילת-עיר שגויה');
// 3) AND בין נעילות
ok(ids(finderMatches(db, { city: 'צפת', status: 'a' }, axisValue)) === '1', 'דוגמה 3: AND נשבר');
// 4) אין התאמה
ok(finderMatches(db, { city: 'אילת' }, axisValue).length === 0, 'דוגמה 4: נמצאה התאמת-שווא');
// 5) אותם אובייקטים — לא עותקים
ok(finderMatches(db, { city: 'צפת' }, axisValue)[0] === fams[0], 'דוגמה 5: הוחזר עותק במקום רפרנס');

if (f) process.exit(1);
console.log('✓ finder-matches: 5 דוגמאות-חוזה — ירוק');
