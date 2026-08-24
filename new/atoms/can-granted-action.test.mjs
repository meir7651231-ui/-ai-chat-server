import { canGrantedAction } from './can-granted-action.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const never = () => { throw new Error('השקע נקרא'); };
const admin = () => true;
const notAdmin = () => false;
// 1) מנהל ⇒ true, קיצור-חישוב — השקע לא נקרא
ok(canGrantedAction({}, 'a@b.c', true, 'x.del', never) === true, 'מנהל ≠ true / השקע נקרא');
// 2) אדמין דרך השקע
ok(canGrantedAction({}, 'a@b.c', false, 'x.del', admin) === true, 'אדמין ≠ true');
// 3) הדלקה-פר-עובד
ok(canGrantedAction({ features: { 'x.del': true } }, 'w@b.c', false, 'x.del', notAdmin) === true, 'דגל-true ≠ true');
// 4) מחרוזת 'true' לא נחשבת
ok(canGrantedAction({ features: { 'x.del': 'true' } }, 'w@b.c', false, 'x.del', notAdmin) === false, "מחרוזת-'true' עברה");
// 5) features חסר
ok(canGrantedAction({}, 'w@b.c', false, 'x.del', notAdmin) === false, 'features-חסר ≠ false');
// 6) דגל false
ok(canGrantedAction({ features: { 'x.del': false } }, 'w@b.c', false, 'x.del', notAdmin) === false, 'דגל-false ≠ false');
if (f) process.exit(1);
console.log('✓ can-granted-action: 6 דוגמאות-חוזה — ירוק');
