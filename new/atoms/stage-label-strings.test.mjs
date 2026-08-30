// בדיקת-צילום · stage-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { STAGE_LABEL_T } from './stage-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(STAGE_LABEL_T), "{\"k1\":\"חדש\",\"k2\":\"בהכנה\",\"k3\":\"רישום\",\"k4\":\"מסירה\",\"k5\":\"הושלם\",\"k6\":\"ayin.stage.\"}");
console.log('OK stage-label-strings');
