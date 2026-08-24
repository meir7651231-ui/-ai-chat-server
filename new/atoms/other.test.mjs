import { OTHER } from './other.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(OTHER === '__other', "הערך " + JSON.stringify(OTHER) + " ≠ '__other'");
ok(typeof OTHER === 'string', 'לא מחרוזת');
ok(OTHER.startsWith('__'), "לא מתחיל בקידומת-הזקיף '__'");
if (f) process.exit(1);
console.log('✓ other: 3 דוגמאות-חוזה — ירוק (כפילות-2-המודולים סגורה)');
