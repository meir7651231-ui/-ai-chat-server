import { studentHistoryText } from './student-history-text.mjs';

let f = 0;
const chk = (n, got, want) => {
  if (got !== want) { console.error(`✗ ${n}:\n  ${JSON.stringify(got)}\n≠ ${JSON.stringify(want)}`); f = 1; }
};

const full = { yearLabel: '2026/27', courseName: 'ציור', group: 'א', summary: { presents: 10, absences: 2, statusLabel: 'פעיל' } };
const bare = { yearLabel: '', courseName: 'נגינה', group: '', summary: { presents: 0, absences: 0, statusLabel: 'הסתיים' } };

// 1. שורה מלאה
chk('דוגמה-1', studentHistoryText([full]), '[2026/27] ציור · א — נוכחות 10, חיסורים 2 · פעיל');
// 2. בלי שנה ובלי קבוצה — אפס יתומים
chk('דוגמה-2', studentHistoryText([bare]), 'נגינה — נוכחות 0, חיסורים 0 · הסתיים');
// 3. שתי שורות ב-\n, סדר נשמר
chk('דוגמה-3', studentHistoryText([full, bare]),
  '[2026/27] ציור · א — נוכחות 10, חיסורים 2 · פעיל\nנגינה — נוכחות 0, חיסורים 0 · הסתיים');
// 4. מערך ריק ⇒ מחרוזת ריקה
chk('דוגמה-4', studentHistoryText([]), '');
// 5. קבוצה בלי שנה
chk('דוגמה-5',
  studentHistoryText([{ yearLabel: '', courseName: 'ציור', group: 'ב', summary: { presents: 3, absences: 1, statusLabel: 'מושהה' } }]),
  'ציור · ב — נוכחות 3, חיסורים 1 · מושהה');

if (f) process.exit(1);
console.log('✓ student-history-text: 5 דוגמאות-חוזה — ירוק');
