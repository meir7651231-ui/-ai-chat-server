// בדיקת-צילום · segments-segment-counts-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SEGMENTS_SEGMENT_COUNTS_T } from './segments-segment-counts-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SEGMENTS_SEGMENT_COUNTS_T), "{\"k1\":\"atrisk\",\"k2\":\"בסיכון נטישה\",\"k3\":\"goldsilent\",\"k4\":\"זהב · שקטים 60+ יום\",\"k5\":\"hok\",\"k6\":\"הו״ק פעילות\",\"k7\":\"gave12m\",\"k8\":\"תרמו ב-12 החודשים\",\"k9\":\"noemail\",\"k10\":\"ללא אימייל\"}");
console.log('OK segments-segment-counts-strings');
