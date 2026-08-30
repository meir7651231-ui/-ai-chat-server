// בדיקת-צילום · tour-steps-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { TOUR_STEPS_T } from './tour-steps-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(TOUR_STEPS_T), "{\"k1\":\"מאתר המשפחות\",\"k2\":\"מאתר ה\",\"k3\":\"nav.families\",\"k4\":\"משפחות\",\"k5\":\"מאתר החוגים\",\"k6\":\"nav.courses\",\"k7\":\"חוגים\",\"k8\":\"חיזוי חוגים\",\"k9\":\"חיזוי \",\"k10\":\"מצא חוג\",\"k11\":\"מצא \",\"k12\":\"entity.course\",\"k13\":\"חוג\"}");
console.log('OK tour-steps-strings');
