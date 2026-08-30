// בדיקת-צילום · site-campaign-progress-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SITE_CAMPAIGN_PROGRESS_T } from './site-campaign-progress-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SITE_CAMPAIGN_PROGRESS_T), "{\"k1\":\"number\"}");
console.log('OK site-campaign-progress-strings');
