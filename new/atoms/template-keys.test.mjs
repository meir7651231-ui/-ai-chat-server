import { templateKeys } from './template-keys.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

// 1) הגדרות-המקור המלאות — הרשימה ההיסטורית
const DEFS = [
  { key: 'wa.delivery' }, { key: 'wa.payment' }, { key: 'wa.birthday' },
  { key: 'wa.dialer' }, { key: 'wa.paylink' },
];
eq(templateKeys(DEFS), ['wa.delivery', 'wa.payment', 'wa.birthday', 'wa.dialer', 'wa.paylink'],
  'רשימת-המפתחות ההיסטורית סטתה');

// 2) סדר-ההגדרה נשמר
eq(templateKeys([{ key: 'a' }, { key: 'b' }]), ['a', 'b'], 'הסדר לא נשמר');

// 3) ריק ⇒ ריק
eq(templateKeys([]), [], 'מערך-ריק לא החזיר ריק');

// 4) כפילות לא מסוננת
eq(templateKeys([{ key: 'x' }, { key: 'x' }]), ['x', 'x'], 'כפילות סוננה');

if (f) process.exit(1);
console.log('✓ template-keys: 4 דוגמאות-חוזה — ירוק');
