// בדיקת-צילום · maps-search-url-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { MAPS_SEARCH_URL_T } from './maps-search-url-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MAPS_SEARCH_URL_T), "{\"k1\":\"https://www.google.com/maps/search/?api=1&query=\"}");
console.log('OK maps-search-url-strings');
