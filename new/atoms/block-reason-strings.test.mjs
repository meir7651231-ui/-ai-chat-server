// בדיקת-צילום · block-reason-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { BLOCK_REASON_T } from './block-reason-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(BLOCK_REASON_T), "{\"k1\":\"שבת\",\"k2\":\"יום שישי (שעתיים לפני שבת)\",\"k3\":\"תשעה באב (נדחה)\",\"k4\":\"Tishri\",\"k5\":\"Nisan\",\"k6\":\"חול המועד\",\"k7\":10,\"k8\":21,\"k9\":20}");
console.log('OK block-reason-strings');
