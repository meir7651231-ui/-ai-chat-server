import { orgLink as __pure_orgLink } from './org-link.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_orgLink_ORG_LINK_T = {
  k1: "?org=",
};
const orgLink = (...a) => __pure_orgLink(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_orgLink_ORG_LINK_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) שורש רגיל
ok(orgLink('https://maor.app', '/', 'demo') === 'https://maor.app/?org=demo', 'דוגמה 1');
// 2) basePath של GitHub Pages
ok(
  orgLink('https://x.github.io', '/maor-system/', 'or-rishon') ===
    'https://x.github.io/maor-system/?org=or-rishon',
  'דוגמה 2',
);
// 3) localhost
ok(orgLink('http://localhost:5173', '/', 'test-org') === 'http://localhost:5173/?org=test-org', 'דוגמה 3');
// 4) אפס-נירמול — שרשור בלבד
ok(orgLink('', '', 'a') === '?org=a', 'דוגמה 4');
// 5) עיוור לריק (חוק-5)
ok(orgLink('https://maor.app', '', '') === 'https://maor.app?org=', 'דוגמה 5');
if (f) process.exit(1);
console.log('✓ org-link: 5 דוגמאות-חוזה — ירוק');
