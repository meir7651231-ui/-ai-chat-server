// בדיקת-צילום · item-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ITEM_LABEL_T } from './item-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ITEM_LABEL_T), "{\"k1\":\"entity.ayinItem\",\"k2\":\"שם לטיפול\"}");
console.log('OK item-label-strings');
