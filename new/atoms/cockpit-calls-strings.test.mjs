// בדיקת-צילום · cockpit-calls-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { COCKPIT_CALLS_T } from './cockpit-calls-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COCKPIT_CALLS_T), "{\"k1\":\"תורם/ת מרכזי/ת\",\"k2\":\"תורם/ת מהותי/ת\",\"k3\":\"תורם/ת\",\"k4\":\"call:\",\"k5\":\"call\",\"k6\":\"יעד-קשר להיום\",\"k7\":\"יעד-קשר עבר לפני \",\"k8\":\" יום\",\"k9\":\"due\",\"k10\":\" · שקט/ה \",\"k11\":\"risk\",\"k12\":5000,\"k13\":1000,\"k14\":1000000}");
console.log('OK cockpit-calls-strings');
