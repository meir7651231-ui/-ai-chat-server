import { supEnforceActive } from './sup-enforce-active.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) אכיפה פעילה ⇒ true
{
  ok(supEnforceActive(true) === true, 'שקע true ⇒ true (הצד-הדוחף יזריק skey)');
}
// 2) דורמנטי ⇒ false (ביט-זהה להיום)
{
  ok(supEnforceActive(false) === false, 'שקע false ⇒ false (ברירת-המחדל של הקופסה)');
}
// 3) עובר כמות-שהוא — עיוור לתוכן (טוהר חוק-5)
{
  ok(supEnforceActive(7) === 7, 'ערך-זקיף 7 ⇒ 7 (אותו ערך בדיוק)');
  const o = { on: true };
  ok(supEnforceActive(o) === o, 'אובייקט ⇒ אותה רפרנס (===)');
}
// 4) דטרמיניסטי וחסר-מצב
{
  ok(supEnforceActive(true) === supEnforceActive(true), 'קריאות חוזרות ⇒ אותו פלט');
  ok(supEnforceActive(false) === supEnforceActive(false), 'אפס דליפה בין קריאות');
}
if (f) process.exit(1);
console.log('✓ sup-enforce-active: 4 דוגמאות-חוזה — ירוק (תא-המצב = חיווט-קופסה)');
