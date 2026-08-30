import { icsFeedUrl as __pure_icsFeedUrl } from './ics-feed-url.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_icsFeedUrl_ICS_FEED_URL_T = {
  k1: "https://us-central1-",
  k2: ".cloudfunctions.net/icsFeed?org=",
  k3: "&key=",
};
const icsFeedUrl = (...a) => __pure_icsFeedUrl(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_icsFeedUrl_ICS_FEED_URL_T);
let f = 0;
const chk = (name, got, want) => { if (got !== want) { console.error(`✗ ${name} ⇒ ${got} ≠ ${want}`); f = 1; } };
chk('1 בסיס', icsFeedUrl('my-proj', 'demo', 'abc123'),
  'https://us-central1-my-proj.cloudfunctions.net/icsFeed?org=demo&key=abc123');
chk('2 רווח-ב-slug', icsFeedUrl('p', 'a b', 't'),
  'https://us-central1-p.cloudfunctions.net/icsFeed?org=a%20b&key=t');
chk('3 ‏slug-עברי', icsFeedUrl('p', 'ארגון', 't'),
  'https://us-central1-p.cloudfunctions.net/icsFeed?org=%D7%90%D7%A8%D7%92%D7%95%D7%9F&key=t');
chk('4 ‏token-כמו-שהוא', icsFeedUrl('p', 's', 'a1b2c3d4').endsWith('&key=a1b2c3d4'), true);
if (f) process.exit(1);
console.log('✓ ics-feed-url: 4 דוגמאות-חוזה — ירוק');
