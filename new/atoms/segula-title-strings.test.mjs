// בדיקת-צילום · segula-title-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SEGULA_TITLE_T } from './segula-title-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SEGULA_TITLE_T), "{\"k1\":\"🎯 סיום סגולה\",\"k2\":\"🕯 סגולה\",\"k3\":\" · יום \"}");
console.log('OK segula-title-strings');
