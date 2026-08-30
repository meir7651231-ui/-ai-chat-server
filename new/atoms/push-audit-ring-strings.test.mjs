// בדיקת-צילום · push-audit-ring-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PUSH_AUDIT_RING_T } from './push-audit-ring-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PUSH_AUDIT_RING_T), "{\"k1\":\"auditlog\",\"tbl1\":500}");
console.log('OK push-audit-ring-strings');
