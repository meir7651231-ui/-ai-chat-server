import { mapsSearchUrl as __pure_mapsSearchUrl } from './maps-search-url.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_mapsSearchUrl_MAPS_SEARCH_URL_T = {
  k1: "https://www.google.com/maps/search/?api=1&query=",
};
const mapsSearchUrl = (...a) => __pure_mapsSearchUrl(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_mapsSearchUrl_MAPS_SEARCH_URL_T);
const C = [
  [['הרצל 10', 'תל אביב'], 'https://www.google.com/maps/search/?api=1&query=%D7%94%D7%A8%D7%A6%D7%9C%2010%2C%20%D7%AA%D7%9C%20%D7%90%D7%91%D7%99%D7%91'],
  [['Main St 5'], 'https://www.google.com/maps/search/?api=1&query=Main%20St%205'],
  [['', ' '], null],
  [['a|b', 'עיר'], 'https://www.google.com/maps/search/?api=1&query=a%20b%2C%20%D7%A2%D7%99%D7%A8'],
];
let f = 0;
for (const [args, w] of C) {
  const g = mapsSearchUrl(...args);
  if (g !== w) { console.error(`✗ mapsSearchUrl(${JSON.stringify(args)}) = ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ maps-search-url: 4 דוגמאות-חוזה — ירוק');
