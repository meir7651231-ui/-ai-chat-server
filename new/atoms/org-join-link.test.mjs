import { orgJoinLink } from './org-join-link.mjs';

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

ok(orgJoinLink('https://x.org', '/', 'maor', 'ab12cd34') === 'https://x.org/?org=maor&join=ab12cd34',
  'קישור עם basePath /');
ok(orgJoinLink('https://x.org', '', 'maor', 'ab12cd34') === 'https://x.org?org=maor&join=ab12cd34',
  'basePath ריק');
ok(orgJoinLink('https://meir.github.io', '/maor-system/', 'demo', 'z9') === 'https://meir.github.io/maor-system/?org=demo&join=z9',
  'basePath של gh-pages');
ok(orgJoinLink('', '', '', '') === '?org=&join=', 'הכול ריק ⇒ שלד-הקישור');

if (f) process.exit(1);
console.log('✓ org-join-link: 4 דוגמאות-חוזה — ירוק');
