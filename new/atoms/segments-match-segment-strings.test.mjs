// בדיקת-צילום · segments-match-segment-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SEGMENTS_MATCH_SEGMENT_T } from './segments-match-segment-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SEGMENTS_MATCH_SEGMENT_T), "{\"k1\":\"atrisk\",\"k2\":\"goldsilent\",\"k3\":\"hok\",\"k4\":\"gave12m\",\"k5\":\"noemail\"}");
console.log('OK segments-match-segment-strings');
