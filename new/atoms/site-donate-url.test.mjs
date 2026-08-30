import { siteDonateUrl as __pure_siteDonateUrl } from './site-donate-url.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_siteDonateUrl_SITE_DONATE_URL_T = {
  k1: "string",
};
const siteDonateUrl = (...a) => __pure_siteDonateUrl(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_siteDonateUrl_SITE_DONATE_URL_T);
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// 1) הישיר גובר
eq(siteDonateUrl({ site: { donateUrl: 'https://pay.me/x' } }), 'https://pay.me/x', 'הישיר לא הוחזר');

// 2) ריק אינו נחשב — נפילה ל-payUrl
eq(siteDonateUrl({ site: { donateUrl: '' }, integrations: { payments: { payUrl: 'https://p.io/q' } } }),
  'https://p.io/q', 'נפילה-ל-payUrl נכשלה');

// 3) שניהם קיימים — הישיר מנצח
eq(siteDonateUrl({ site: { donateUrl: 'https://pay.me/x' }, integrations: { payments: { payUrl: 'https://p.io/q' } } }),
  'https://pay.me/x', 'עדיפות-הישיר נשברה');

// 4) בלי site בכלל
eq(siteDonateUrl({ integrations: { payments: { payUrl: 'https://p.io/q' } } }),
  'https://p.io/q', 'payUrl בלי site לא הוחזר');

// 5) קונפיג ריק
eq(siteDonateUrl({}), null, 'קונפיג ריק לא החזיר null');

// 6) לא-מחרוזת נפסל בשתי התחנות
eq(siteDonateUrl({ site: { donateUrl: 5 }, integrations: { payments: { payUrl: 7 } } }),
  null, 'לא-מחרוזת לא נפסל');

// 7) payments בלי payUrl
eq(siteDonateUrl({ integrations: { payments: {} } }), null, 'payments ריק לא החזיר null');

if (f) process.exit(1);
console.log('✓ site-donate-url: 7 דוגמאות-חוזה — ירוק');
