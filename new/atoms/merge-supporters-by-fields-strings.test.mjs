// בדיקת-צילום · merge-supporters-by-fields-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { MERGE_SUPPORTERS_BY_FIELDS_T } from './merge-supporters-by-fields-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MERGE_SUPPORTERS_BY_FIELDS_T), "{\"k1\":\"name\",\"k2\":\"phone\",\"k3\":\"email\",\"k4\":\"idNum\",\"k5\":\"city\",\"k6\":\"address\",\"k7\":\"cat\",\"k8\":\"forWho\",\"k9\":\"notes\"}");
console.log('OK merge-supporters-by-fields-strings');
