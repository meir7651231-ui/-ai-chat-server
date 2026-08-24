import { setCloudScope } from './set-cloud-scope.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) ארגון-פלטפורמה
{
  const s = setCloudScope('kehila', false);
  ok(s.slug === 'kehila' && s.cloudRoot === false, 'ארגון-פלטפורמה: הערך אינו {kehila,false}');
  ok(Object.keys(s).length === 2, 'האובייקט חייב להכיל בדיוק slug+cloudRoot');
}
// 2) מצב-השורש הבטוח
{
  const s = setCloudScope('default', true);
  ok(s.slug === 'default' && s.cloudRoot === true, 'מצב-השורש: הערך אינו {default,true}');
}
// 3) שתי קריאות ⇒ אובייקטים נפרדים בהפניה, שווים בתוכן
{
  const a = setCloudScope('demo', true);
  const b = setCloudScope('demo', true);
  ok(a !== b, 'אותו אובייקט הוחזר פעמיים — מצב דולף בין קריאות');
  ok(a.slug === b.slug && a.cloudRoot === b.cloudRoot, 'תוכן שתי הקריאות חייב להיות זהה');
}
// 4) הערכים עוברים כמות-שהם (אפס נרמול)
{
  const s = setCloudScope('or-rishon', true);
  ok(s.slug === 'or-rishon', 'ה-slug שונה בדרך — האטום חייב להעביר כמות-שהוא');
}
if (f) process.exit(1);
console.log('✓ set-cloud-scope: 4 דוגמאות-חוזה — ירוק (טהור; ההשמה = חיווט-קופסה)');
