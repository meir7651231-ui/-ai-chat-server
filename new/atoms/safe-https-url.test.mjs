import { safeHttpsUrl as __pure_safeHttpsUrl } from './safe-https-url.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_safeHttpsUrl_SAFE_HTTPS_URL_T = {
  k1: "https:",
};
const safeHttpsUrl = (...a) => __pure_safeHttpsUrl(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_safeHttpsUrl_SAFE_HTTPS_URL_T);
const C=[['https://example.com','https://example.com/'],['  https://a.b/c?x=1  ','https://a.b/c?x=1'],['http://example.com',null],['javascript:alert(1)',null],['not a url',null],['',null]];
let f=0; for(const [a,w] of C){const g=safeHttpsUrl(a); if(g!==w){console.error(`✗ ${JSON.stringify(a)} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);f=1;}}
if(f)process.exit(1); console.log('✓ safe-https-url: 6 דוגמאות-חוזה — ירוק');
