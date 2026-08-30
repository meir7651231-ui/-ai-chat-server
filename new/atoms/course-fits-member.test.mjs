import { courseFitsMember as __pure_courseFitsMember } from './course-fits-member.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_courseFitsMember_COURSE_FITS_MEMBER_T = {
  k1: "all",
};
const courseFitsMember = (...a) => __pure_courseFitsMember(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_courseFitsMember_COURSE_FITS_MEMBER_T);
const yes = () => true;
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
chk('1 מגדר לא תואם', courseFitsMember({ gender: 'f' }, 'm', null, undefined, yes) === false);
chk("2 'all' פתוח", courseFitsMember({ gender: 'all' }, 'm', null, undefined, yes) === true);
chk('3 מגדר לא ידוע', courseFitsMember({ gender: 'f' }, undefined, null, undefined, yes) === true);
const cAge = { ageMin: 6, ageMax: 12 };
chk('4a גיל 5 מתחת', courseFitsMember(cAge, 'm', 5, undefined, yes) === false);
chk('4b גיל 6 גבול', courseFitsMember(cAge, 'm', 6, undefined, yes) === true);
chk('4c גיל 12 גבול', courseFitsMember(cAge, 'm', 12, undefined, yes) === true);
chk('4d גיל 13 מעל', courseFitsMember(cAge, 'm', 13, undefined, yes) === false);
chk('5 גיל null מדלג', courseFitsMember(cAge, 'm', null, undefined, yes) === true);
chk('6 כיתה פוסלת', courseFitsMember({}, 'm', 8, 'ג', () => false) === false);
let got = null;
courseFitsMember({ gradeMin: 'א' }, 'm', 8, 'ג', (c, g) => { got = [c.gradeMin, g]; return true; });
chk('7 השקע מקבל (c,grade)', got && got[0] === 'א' && got[1] === 'ג');
if (f) process.exit(1);
console.log('✓ course-fits-member: 7 דוגמאות-חוזה (שקע gradeFits) — ירוק');
