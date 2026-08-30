// בדיקת-צילום · sup-tier-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SUP_TIER_T } from './sup-tier-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUP_TIER_T), "{\"k1\":\"זהב\",\"k2\":\"#fdf3dd\",\"k3\":\"כסף\",\"k4\":\"#eef1f5\",\"k5\":\"ארד\",\"k6\":\"#f6ead1\",\"k7\":\"רדומה\",\"k8\":\"#eceae2\"}");
console.log('OK sup-tier-strings');
