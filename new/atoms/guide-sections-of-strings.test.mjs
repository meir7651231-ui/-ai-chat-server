// בדיקת-צילום · guide-sections-of-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { GUIDE_SECTIONS_OF_T } from './guide-sections-of-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(GUIDE_SECTIONS_OF_T), "{\"k1\":\"כרטיס משפחה\",\"k2\":\"כרטיס \",\"k3\":\"entity.family\",\"k4\":\"משפחה\",\"k5\":\"חדרים חיים\",\"k6\":\"entity.rooms\",\"k7\":\"חדרים\",\"k8\":\" חיים\",\"k9\":\"על חדר\",\"k10\":\"על \",\"k11\":\"entity.room\",\"k12\":\"חדר\",\"k13\":\"בתוך חוג\",\"k14\":\"בתוך \",\"k15\":\"entity.course\",\"k16\":\"חוג\",\"k17\":\"תדפיס למורה\",\"k18\":\"תדפיס ל\",\"k19\":\"entity.teacher\",\"k20\":\"מורה\",\"k21\":\"＋ תרומה\",\"k22\":\"entity.donation\",\"k23\":\"תרומה\",\"k24\":\"שיוך למשפחה\",\"k25\":\"שיוך ל\"}");
console.log('OK guide-sections-of-strings');
