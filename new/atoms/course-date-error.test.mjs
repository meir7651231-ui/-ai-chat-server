import { courseDateError as __pure_courseDateError } from './course-date-error.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_courseDateError_COURSE_DATE_ERROR_T = {
  k1: "entity.course",
  k2: "חוג",
  k3: "תאריך הסיום מוקדם מתאריך ההתחלה — ה",
  k4: " לא יופיע בלוח. תקנו את התאריכים",
};
const courseDateError = (...a) => __pure_courseDateError(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_courseDateError_COURSE_DATE_ERROR_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
const termHeb = () => 'שיעור';
// 1 — הפוך, בלי config
chk('1 הפוך בלי config', courseDateError('2026-09-01', '2026-08-01', undefined, termHeb) ===
  'תאריך הסיום מוקדם מתאריך ההתחלה — החוג לא יופיע בלוח. תקנו את התאריכים');
// 2 — הפוך עם config ומונח מותאם
chk('2 מונח מותאם', (courseDateError('2026-09-01', '2026-08-01', { terms: {} }, termHeb) || '').includes('— השיעור לא'));
// 3–6 — תקין/שווה/חסר ⇒ null
chk('3 טווח תקין', courseDateError('2026-08-01', '2026-09-01', undefined, termHeb) === null);
chk('4 שווים', courseDateError('2026-08-01', '2026-08-01', undefined, termHeb) === null);
chk('5 start ריק', courseDateError('', '2026-08-01', undefined, termHeb) === null);
chk('6 end ריק', courseDateError('2026-09-01', '', undefined, termHeb) === null);
// 7 — בלי config השקע לא נקרא
let called = 0;
courseDateError('2026-09-01', '2026-08-01', undefined, () => { called++; return 'X'; });
chk('7 termOf לא נקרא בלי config', called === 0);
if (f) process.exit(1);
console.log('✓ course-date-error: 7 דוגמאות-חוזה (שקע termOf) — ירוק');
