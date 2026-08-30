// בדיקת-צילום · site-campaign-progress-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SITE_CAMPAIGN_PROGRESS_T } from './site-campaign-progress-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SITE_CAMPAIGN_PROGRESS_T), "{\"k1\":\"number\",\"k2\":100,\"k3\":10,\"k4\":86400000}");
console.log('OK site-campaign-progress-strings');
