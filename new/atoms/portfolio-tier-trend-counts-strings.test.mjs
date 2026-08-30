// בדיקת-צילום · portfolio-tier-trend-counts-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PORTFOLIO_TIER_TREND_COUNTS_T } from './portfolio-tier-trend-counts-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PORTFOLIO_TIER_TREND_COUNTS_T), "{\"k1\":\"down\"}");
console.log('OK portfolio-tier-trend-counts-strings');
