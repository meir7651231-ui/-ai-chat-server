import { duplicateCourse as __pure_duplicateCourse } from './duplicate-course.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_duplicateCourse_DUPLICATE_COURSE_T = {
  k1: " (עותק)",
};
const duplicateCourse = (...a) => __pure_duplicateCourse(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_duplicateCourse_DUPLICATE_COURSE_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const c = { id: 'c1', name: 'ציור', start: '2026-01-01', end: '2026-06-30', roomId: 'r9', price: 120 };
const d = duplicateCourse(c, 'c2', { start: '2026-09-01', end: '2027-01-31' });
ok(d.id === 'c2', "id ⇒ 'c2'");
ok(d.name === 'ציור (עותק)', "name ⇒ 'ציור (עותק)'");
ok(d.start === '2026-09-01' && d.end === '2027-01-31', 'תאריכים חדשים');
ok(d.roomId === 'r9' && d.price === 120, 'שדות-אחרים נשמרים');
ok(c.id === 'c1' && c.name === 'ציור' && c.start === '2026-01-01', 'המקור לא השתנה (טהור)');
ok(duplicateCourse(d, 'c3', { start: '2027-02-01', end: '2027-06-30' }).name === 'ציור (עותק) (עותק)', 'שכפול-של-עותק מסומן פעמיים');
if (f) process.exit(1);
console.log('✓ duplicate-course: 6 דוגמאות-חוזה — ירוק');
