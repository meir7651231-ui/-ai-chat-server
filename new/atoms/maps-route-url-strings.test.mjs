// בדיקת-צילום · maps-route-url-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { MAPS_ROUTE_URL_T } from './maps-route-url-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MAPS_ROUTE_URL_T), "{\"k1\":\"&waypoints=\",\"k2\":\"https://www.google.com/maps/search/?api=1&query=\",\"k3\":\"https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=\"}");
console.log('OK maps-route-url-strings');
