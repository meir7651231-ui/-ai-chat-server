// בדיקת-צילום · tier-of-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { TIER_OF_T } from './tier-of-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(TIER_OF_T), "{\"k1\":\"titan\",\"k2\":\"טיטאן\",\"k3\":\"#fdf3dd\",\"k4\":\"lion\",\"k5\":\"לביאה\",\"k6\":\"pale\",\"k7\":\"טעון שיפור\",\"k8\":\"#fdf1d4\",\"k9\":\"red\",\"k10\":\"סיכון נטישה\",\"k11\":\"#fdeaea\"}");
console.log('OK tier-of-strings');
