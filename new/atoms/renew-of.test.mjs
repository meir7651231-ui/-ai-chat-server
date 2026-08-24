import { renewOf } from './renew-of.mjs';
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error('✗ ' + msg + ` ⇒ ${JSON.stringify(a)}`); f = 1; } };

// 1-2) החלטות מפורשות
eq(renewOf({ renew: 'yes' }), 'yes', 'yes לא הוחזר');
eq(renewOf({ renew: 'hold' }), 'hold', 'hold לא הוחזר');

// 3) חסר ⇒ טרם הוחלט
eq(renewOf({}), '', 'חסר לא הפך לריק');

// 4) null ⇒ ריק (??)
eq(renewOf({ renew: null }), '', 'null לא הפך לריק');

// 5) ריק מפורש נשאר ריק
eq(renewOf({ renew: '' }), '', 'ריק מפורש שונה');

if (f) process.exit(1);
console.log('✓ renew-of: 5 דוגמאות-חוזה — ירוק');
