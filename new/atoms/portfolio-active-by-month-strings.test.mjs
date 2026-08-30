// בדיקת-צילום · portfolio-active-by-month-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PORTFOLIO_ACTIVE_BY_MONTH_T } from './portfolio-active-by-month-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PORTFOLIO_ACTIVE_BY_MONTH_T), "{\"k1\":12}");
console.log('OK portfolio-active-by-month-strings');
