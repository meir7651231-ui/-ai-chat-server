// בדיקת-צילום · write-org-secrets-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { WRITE_ORG_SECRETS_T } from './write-org-secrets-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(WRITE_ORG_SECRETS_T), "{\"k1\":\"orgSecrets\",\"k2\":\"orgSecretsMeta\"}");
console.log('OK write-org-secrets-strings');
