import { guardExport } from './guard-export.mjs';
let f = 0;
const check = (msg, cond) => {
  if (!cond) {
    console.error(`✗ ${msg}`);
    f = 1;
  }
};
// 1. ברירת-מחדל — מותר
check('(false, undefined) ⇒ true', guardExport(false, undefined) === true);
// 2. חסום בלי התרעה — false, לא קורס
check('(true, undefined) ⇒ false', guardExport(true, undefined) === false);
// 3. חסום עם התרעה — false + spy פעם אחת בדיוק
let calls3 = 0;
check('(true, spy) ⇒ false', guardExport(true, () => calls3++) === false);
check('spy נקרא בדיוק פעם אחת בחסימה', calls3 === 1);
// 4. מותר עם התרעה — true + spy לא נקרא
let calls4 = 0;
check('(false, spy) ⇒ true', guardExport(false, () => calls4++) === true);
check('spy לא נקרא כשמותר', calls4 === 0);
if (f) process.exit(1);
console.log('✓ guard-export: 4 דוגמאות-חוזה — ירוק (שער יציאת-המידע)');
