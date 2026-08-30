import { mapsRouteUrl as __pure_mapsRouteUrl } from './maps-route-url.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_mapsRouteUrl_MAPS_ROUTE_URL_T = {
  k1: "&waypoints=",
  k2: "https://www.google.com/maps/search/?api=1&query=",
  k3: "https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=",
};
const mapsRouteUrl = (...a) => __pure_mapsRouteUrl(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_mapsRouteUrl_MAPS_ROUTE_URL_T);
const C = [
  [[], null],
  [['', '  '], null],
  [['הרצל 10, חיפה'], 'https://www.google.com/maps/search/?api=1&query=%D7%94%D7%A8%D7%A6%D7%9C%2010%2C%20%D7%97%D7%99%D7%A4%D7%94'],
  [['A 1', 'B 2', 'C 3'], 'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=C%203&waypoints=A%201%7CB%202'],
  [['a|b', 'יעד'], 'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=%D7%99%D7%A2%D7%93&waypoints=a%20b'],
];
let f = 0;
for (const [stops, w] of C) {
  const g = mapsRouteUrl(stops);
  if (g !== w) { console.error(`✗ mapsRouteUrl(${JSON.stringify(stops)}) = ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ maps-route-url: 5 דוגמאות-חוזה — ירוק');
