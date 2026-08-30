// בדיקת-צילום · campaign-progress-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { CAMPAIGN_PROGRESS_T } from './campaign-progress-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CAMPAIGN_PROGRESS_T), "{\"k1\":100}");
console.log('OK campaign-progress-strings');
