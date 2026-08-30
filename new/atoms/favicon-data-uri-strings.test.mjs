// בדיקת-צילום · favicon-data-uri-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { FAVICON_DATA_URI_T } from './favicon-data-uri-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(FAVICON_DATA_URI_T), "{\"k1\":\"</text></svg>\",\"k2\":\"data:image/svg+xml,\",\"k3\":\"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='52' font-size='72' text-anchor='middle' dominant-baseline='central'>\"}");
console.log('OK favicon-data-uri-strings');
