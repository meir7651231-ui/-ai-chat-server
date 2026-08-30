// בדיקת-צילום · strip-audit-meta-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { STRIP_AUDIT_META_T } from './strip-audit-meta-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(STRIP_AUDIT_META_T), "{\"k1\":\"audit\"}");
console.log('OK strip-audit-meta-strings');
