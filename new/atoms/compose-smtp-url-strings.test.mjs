// בדיקת-צילום · compose-smtp-url-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { COMPOSE_SMTP_URL_T } from './compose-smtp-url-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COMPOSE_SMTP_URL_T), "{\"k1\":\"smtps\",\"k2\":\"smtp\"}");
console.log('OK compose-smtp-url-strings');
