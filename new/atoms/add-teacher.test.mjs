import { ADD_TEACHER } from './add-teacher.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(ADD_TEACHER === '__add', "ערך ≠ '__add' (התקבל: " + JSON.stringify(ADD_TEACHER) + ')');
ok(typeof ADD_TEACHER === 'string', 'לא מחרוזת');
ok(ADD_TEACHER.length === 5, 'אורך ≠ 5');
ok(ADD_TEACHER.startsWith('__'), "לא מתחיל ב-'__'");
if (f) process.exit(1);
console.log('✓ add-teacher: 4 דוגמאות-חוזה — ירוק');
