// בדיקת-צילום · finder-axis-value-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FINDER_AXIS_VALUE_T } from './finder-axis-value-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FINDER_AXIS_VALUE_T), "{\"k1\":\"city\",\"k2\":\"comm\",\"k3\":\"marital\",\"k4\":\"לא ידוע\",\"k5\":\"status\",\"k6\":\"cred\",\"k7\":\"kids\",\"k8\":\"עם ילדים\",\"k9\":\"בלי ילדים\",\"k10\":\"enrolled\",\"k11\":\"משתתפות ב\",\"k12\":\"nav.courses\",\"k13\":\"חוגים\",\"k14\":\"לא משתתפות\",\"k15\":\"sefach\",\"k16\":\"קיים\",\"k17\":\"חסר\",\"k18\":\"lang\"}");
console.log('OK finder-axis-value-strings');
