// בדיקת-צילום · pull-audit-ring-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PULL_AUDIT_RING_T } from './pull-audit-ring-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PULL_AUDIT_RING_T), "{\"k1\":\"auditlog\"}");
console.log('OK pull-audit-ring-strings');
