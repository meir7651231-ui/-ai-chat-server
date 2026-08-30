// בדיקת-צילום · favicon-data-uri-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FAVICON_DATA_URI_T } from './favicon-data-uri-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FAVICON_DATA_URI_T), "{\"k1\":\"</text></svg>\",\"k2\":\"data:image/svg+xml,\"}");
console.log('OK favicon-data-uri-strings');
