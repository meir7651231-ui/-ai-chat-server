// בדיקת-צילום · parse-vcards-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PARSE_VCARDS_T } from './parse-vcards-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PARSE_VCARDS_T), "{\"k1\":\"TEL\",\"k2\":\"EMAIL\",\"k3\":\"ORG\",\"k4\":\"null\",\"k5\":\"TITLE\",\"k6\":\"ADR\",\"k7\":\"NOTE\"}");
console.log('OK parse-vcards-strings');
