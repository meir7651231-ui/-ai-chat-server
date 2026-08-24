import { teacherIdOf } from './teacher-id-of.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const cfg = { roles: { teachers: { ' Rivka@X.co ': 't1', 'sara@x.co': 't2' } } };
// 1) מפתח-מפה עם רווחים/רישיות מנורמל
ok(teacherIdOf(cfg, 'rivka@x.co') === 't1', 'דוגמה 1: מפתח-מלוכלך לא נורמל');
// 2) המייל-הנבדק מנורמל
ok(teacherIdOf(cfg, ' SARA@X.CO ') === 't2', 'דוגמה 2: מייל-נבדק לא נורמל');
// 3) אין מיפוי ⇒ null
ok(teacherIdOf(cfg, 'nobody@x.co') === null, 'דוגמה 3: מייל-זר לא null');
// 4) בלי מייל ⇒ null
ok(teacherIdOf(cfg, '') === null, 'דוגמה 4: מייל-ריק לא null');
ok(teacherIdOf(cfg, null) === null, 'דוגמה 4: null לא null');
// 5) אין roles.teachers ⇒ null
ok(teacherIdOf({}, 'sara@x.co') === null, 'דוגמה 5: קונפיג-ריק לא null');
if (f) process.exit(1);
console.log('✓ teacher-id-of: 5 דוגמאות-חוזה — ירוק');
