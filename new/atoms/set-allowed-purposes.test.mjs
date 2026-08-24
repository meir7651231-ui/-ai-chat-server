import { setAllowedPurposes } from './set-allowed-purposes.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) מערך לא-ריק ⇒ הוא-עצמו בזהות-הפניה, כסדרו
{
  const p = ['חינוך', 'רווחה'];
  const out = setAllowedPurposes(p);
  ok(out === p, 'מערך לא-ריק חייב לחזור בזהות-הפניה, לא עותק');
  ok(out[0] === 'חינוך' && out[1] === 'רווחה', 'סדר-הייעודים השתבש');
}
// 2) מערך-ריק ⇒ null (אין הגבלה — לא "אסור הכול")
{
  ok(setAllowedPurposes([]) === null, 'מערך-ריק חייב להתנרמל ל-null');
}
// 3) null ⇒ null
{
  ok(setAllowedPurposes(null) === null, 'null חייב להישאר null');
}
// 4) undefined ⇒ null
{
  ok(setAllowedPurposes(undefined) === null, 'undefined חייב להתנרמל ל-null');
}
// 5) ערך-הסנטינל _shared_ עובר כמות-שהוא
{
  const p = ['_shared_'];
  ok(setAllowedPurposes(p) === p, 'הסנטינל _shared_ חייב לעבור כמות-שהוא');
}
if (f) process.exit(1);
console.log('✓ set-allowed-purposes: 5 דוגמאות-חוזה — ירוק (טהור; ההשמה = חיווט-קופסה)');
