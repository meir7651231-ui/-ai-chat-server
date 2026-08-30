// בדיקת-צילום · beneficiary-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { BENEFICIARY_LABEL_T } from './beneficiary-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(BENEFICIARY_LABEL_T), "{\"k1\":\"entity.familyOf\",\"k2\":\"משפחת\",\"k3\":\"entity.family\",\"k4\":\"משפחה\",\"k5\":\" לא ידועה\"}");
console.log('OK beneficiary-label-strings');
