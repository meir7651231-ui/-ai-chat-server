import { sessionsOf } from './sessions-of.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) מערך לא-ריק ⇒ מוחזר הוא-עצמו (זהות-הפניה), כסדרו
{
  const sessions = [
    { day: 2, time: '16:30', label: 'קבוצה א׳' },
    { day: 4, time: '17:00', label: 'קבוצה ב׳' },
  ];
  const out = sessionsOf({ weekday: 1, time: '10:00', sessions });
  ok(out === sessions, 'מערך-מפגשים קיים חייב לחזור בזהות-הפניה, לא עותק');
  ok(out.length === 2 && out[0].label === 'קבוצה א׳' && out[1].day === 4, 'סדר/תוכן המערך השתבשו');
}
// 2) sessions=[] ⇒ נפילה למפגש-יחיד מהשדות הראשיים
{
  const out = sessionsOf({ weekday: 5, time: '09:15', sessions: [] });
  ok(out.length === 1, 'מערך-ריק חייב ליפול למפגש-יחיד');
  ok(out[0].day === 5 && out[0].time === '09:15' && out[0].label === '', 'המפגש-הנבנה אינו {day:5,time:09:15,label:""}');
}
// 3) sessions חסר ⇒ אותה נפילה
{
  const out = sessionsOf({ weekday: 0, time: '20:00' });
  ok(out.length === 1 && out[0].day === 0 && out[0].time === '20:00' && out[0].label === '', 'sessions חסר: הנפילה לא נבנתה נכון');
}
// 4) מפגש-יחיד במערך ⇒ המערך גובר (לא fallback)
{
  const sessions = [{ day: 3, time: '18:00', label: '' }];
  const out = sessionsOf({ weekday: 9, time: 'XX', sessions });
  ok(out === sessions, 'מערך באורך 1 חייב לחזור כמות-שהוא, לא להיבנות מחדש');
}
// 5) בנפילה — weekday=0 (ראשון) אינו נבלע כ-falsy, time='' עובר כמות-שהוא
{
  const out = sessionsOf({ weekday: 0, time: '', sessions: undefined });
  ok(out[0].day === 0, 'weekday=0 (יום ראשון) נבלע — חייב לעבור כמות-שהוא');
  ok(out[0].time === '', "time ריק חייב לעבור '' — לא להיות מומצא");
}
if (f) process.exit(1);
console.log('✓ sessions-of: 5 דוגמאות-חוזה — ירוק (טהור, אפס שקעים)');
