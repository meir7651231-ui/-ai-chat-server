// בדיקת-צילום · pricing-default-mode — ביט-אחר-ביט.
import { DEFAULT_QUOTE_MODE } from './pricing-default-mode.mjs';
import assert from 'node:assert';
assert.strictEqual(DEFAULT_QUOTE_MODE, 'subscription');
console.log('OK pricing-default-mode');
