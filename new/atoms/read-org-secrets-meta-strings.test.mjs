// בדיקת-צילום · read-org-secrets-meta-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { READ_ORG_SECRETS_META_T } from './read-org-secrets-meta-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(READ_ORG_SECRETS_META_T), "{\"k1\":\"orgSecretsMeta\"}");
console.log('OK read-org-secrets-meta-strings');
