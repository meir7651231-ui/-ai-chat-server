import { nextSessionDate } from './next-session-date.mjs';
// שקע-sessionsOf מקומי לבדיקה — מחזיר את מערך-המפגשים שהוזן לחוג (הבדיקה מייבאת רק את האטום שלה).
const sessionsOf = (c) => c.sessions;
const NOW = new Date(2026, 7, 24, 12, 0); // 2026-08-24, יום-שני, 12:00
const C = [
  ['דוגמה 1 (שלישי הקרוב)', [{ day: 2, time: '17:00' }], new Date(2026, 7, 25, 17, 0)],
  ['דוגמה 2 (היום — שעה עתידית)', [{ day: 1, time: '17:00' }], new Date(2026, 7, 24, 17, 0)],
  ['דוגמה 3 (היום — שעה שעברה ⇒ שבוע)', [{ day: 1, time: '10:00' }], new Date(2026, 7, 31, 10, 0)],
  ['דוגמה 4 (מרובה — המוקדם מנצח)', [{ day: 4, time: '09:00' }, { day: 2, time: '19:30' }], new Date(2026, 7, 25, 19, 30)],
  ['דוגמה 5 (בלי שעה ⇒ 17:00)', [{ day: 3 }], new Date(2026, 7, 26, 17, 0)],
];
let f = 0;
for (const [name, sessions, want] of C) {
  const g = nextSessionDate({ sessions }, NOW, sessionsOf);
  if (!g || g.getTime() !== want.getTime()) {
    console.error(`✗ ${name}: ${g} ≠ ${want}`);
    f = 1;
  }
}
// 6. אין מפגשים ⇒ null
if (nextSessionDate({ sessions: [] }, NOW, sessionsOf) !== null) {
  console.error('✗ דוגמה 6: מערך-ריק לא החזיר null');
  f = 1;
}
if (f) process.exit(1);
console.log('✓ next-session-date: 6 דוגמאות-חוזה — ירוק');
