import { ENROLL_NEW_FAMILY, resolveEnrollFamily } from './resolve-enroll-family.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקע-normName לבדיקה כמתועד בחוזה: lowercase + הסרת רווחים ומקפים
const normName = (s) => String(s).toLowerCase().replace(/[\s\-]/g, '');

const F = [{ id: 'f1', name: 'כהן' }, { id: 'f2', name: 'לוי-מזרחי' }];

ok(ENROLL_NEW_FAMILY === '__new', 'הסנטינל אינו __new');
// 1 — id קיים מנצח
{
  const r = resolveEnrollFamily(F, 'f2', '', normName);
  ok(r.fam === F[1] && r.create === false, 'דוגמה 1: ' + JSON.stringify(r));
}
// 2 — '__new' עם שם שמתאחד בנרמול ⇒ הקיימת, בלי כפילות
{
  const r = resolveEnrollFamily(F, '__new', 'לוי מזרחי', normName);
  ok(r.fam === F[1] && r.create === false, 'דוגמה 2: ' + JSON.stringify(r));
}
// 3 — שם חדש באמת ⇒ יצירה
{
  const r = resolveEnrollFamily(F, '__new', 'אברהם', normName);
  ok(r.fam === null && r.create === true, 'דוגמה 3: ' + JSON.stringify(r));
}
// 4 — שם-ריק אחרי trim ⇒ לא יוצרים
{
  const r = resolveEnrollFamily(F, '__new', '   ', normName);
  ok(r.fam === null && r.create === false, 'דוגמה 4: ' + JSON.stringify(r));
}
// 5 — id לא-מוכר שאינו הסנטינל
{
  const r = resolveEnrollFamily(F, 'f9', 'אברהם', normName);
  ok(r.fam === null && r.create === false, 'דוגמה 5: ' + JSON.stringify(r));
}
// 6 — רשימה ריקה ⇒ תמיד יצירה
{
  const r = resolveEnrollFamily([], '__new', 'כהן', normName);
  ok(r.fam === null && r.create === true, 'דוגמה 6: ' + JSON.stringify(r));
}

if (f) process.exit(1);
console.log('✓ resolve-enroll-family: 6 דוגמאות-חוזה — ירוק');
