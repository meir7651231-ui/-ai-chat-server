import { supEnforceOn } from './sup-enforce-on.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) הדלקה מפורשת בלבד
{
  ok(supEnforceOn({ supporterEnforce: true }) === true, 'true מפורש ⇒ דלוק');
}
// 2) מפתח חסר ⇒ כבוי (off-by-default, הפוך מדגל-פיצ'ר)
{
  ok(supEnforceOn({}) === false, 'חסר ⇒ כבוי');
}
// 3) כיבוי מפורש
{
  ok(supEnforceOn({ supporterEnforce: false }) === false, 'false ⇒ כבוי');
}
// 4) truthy שאינו true נדחה (=== קפדני)
{
  ok(supEnforceOn({ supporterEnforce: 1 }) === false, '1 ⇒ כבוי');
}
// 5) מחרוזת אינה הדלקה
{
  ok(supEnforceOn({ supporterEnforce: 'true' }) === false, "'true' ⇒ כבוי");
}
if (f) process.exit(1);
console.log('✓ sup-enforce-on: 5 דוגמאות-חוזה — ירוק (off-by-default; רק true מפורש)');
