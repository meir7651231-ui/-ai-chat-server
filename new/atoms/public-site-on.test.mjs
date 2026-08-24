import { publicSiteOn } from './public-site-on.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const fOn = (c, k) => c.features?.[k] !== false;

// 1) דגל דלוק + site פעיל
ok(publicSiteOn({ features: {}, site: { enabled: true } }, fOn) === true, 'דגל+site לא החזיר true');
// 2) בלי site
ok(publicSiteOn({ features: {} }, fOn) === false, 'בלי site החזיר true');
// 3) site כבוי במפורש
ok(publicSiteOn({ features: {}, site: { enabled: false } }, fOn) === false, 'enabled:false החזיר true');
// 4) enabled חסר ⇒ פעיל (רק false מכבה)
ok(publicSiteOn({ features: {}, site: {} }, fOn) === true, 'enabled חסר החזיר false');
// 5) הדגל כבוי
ok(publicSiteOn({ features: { 'shell.publicsite': false }, site: { enabled: true } }, fOn) === false, 'דגל כבוי החזיר true');
// 6) צורת-הקריאה לשקע + קיצור-חישוב
const calls = [];
const spy = (c, k) => { calls.push(k); return false; };
const cfg6 = { features: {} };
Object.defineProperty(cfg6, 'site', { get() { ok(false, 'site נבדק למרות שהדגל כבוי (אין קיצור-&&)'); return {}; } });
publicSiteOn(cfg6, spy);
ok(calls.length === 1 && calls[0] === 'shell.publicsite', 'השקע לא נקרא עם המפתח המדויק');

if (f) process.exit(1);
console.log('✓ public-site-on: 6 דוגמאות-חוזה — ירוק (חוזה-הדגלים: רק false מכבה)');
