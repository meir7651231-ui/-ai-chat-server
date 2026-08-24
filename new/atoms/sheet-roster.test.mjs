import { sheetRoster } from './sheet-roster.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) active+frozen נכנסים; ended+wait בחוץ
{
  const list = [
    { courseId: 'c1', status: 'active' },
    { courseId: 'c1', status: 'frozen' },
    { courseId: 'c1', status: 'ended' },
    { courseId: 'c1', status: 'wait' },
  ];
  const out = sheetRoster(list, 'c1');
  ok(out.length === 2, 'חייבים בדיוק 2 — פעיל+מוקפא (בפועל: ' + out.length + ')');
  ok(out[0].status === 'active' && out[1].status === 'frozen', 'ended/wait אסור שייכנסו לגיליון');
}
// 2) חוג אחר מסונן
{
  ok(sheetRoster([{ courseId: 'c2', status: 'active' }], 'c1').length === 0, 'שיבוץ של חוג אחר דלף לגיליון');
}
// 3) סטטוס חסר נכלל (שיבוץ-עבר)
{
  const e = { courseId: 'c1' };
  const out = sheetRoster([e], 'c1');
  ok(out.length === 1 && out[0] === e, 'שיבוץ בלי status חייב להיכלל — פעיל');
}
// 4) מערך ריק ⇒ [] חדש
{
  const out = sheetRoster([], 'c1');
  ok(Array.isArray(out) && out.length === 0, 'מערך ריק חייב להחזיר []');
}
// 5) סדר נשמר + זהות-הפניה
{
  const a = { courseId: 'c1', status: 'active' };
  const b = { courseId: 'c2', status: 'active' };
  const c = { courseId: 'c1', status: 'frozen' };
  const out = sheetRoster([a, b, c], 'c1');
  ok(out.length === 2 && out[0] === a && out[1] === c, 'הסדר המקורי והאיברים-עצמם חייבים להישמר');
}
if (f) process.exit(1);
console.log('✓ sheet-roster: 5 דוגמאות-חוזה — ירוק (טהור)');
