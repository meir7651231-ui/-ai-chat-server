// בדיקת-צילום · find-caller-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FIND_CALLER_T } from './find-caller-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FIND_CALLER_T), "{\"k1\":\"family\",\"k2\":\"families\",\"k3\":\"member\",\"k4\":\"supporter\",\"k5\":\"supporters\",\"k6\":\"volunteer\",\"k7\":\"shop7\",\"k8\":\"coordinator\",\"k9\":\"tzedaka\"}");
console.log('OK find-caller-strings');
