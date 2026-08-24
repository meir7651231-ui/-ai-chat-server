import { overrideOf } from './override-of.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקע-הנירמול כהתנהגות-המקור: trim + lowercase
const ne = (email) => email.trim().toLowerCase();
const card = { modules: { tz: false } };
const org = { memberConfigs: { 'a@x.co': card } };
// 1) שליפה ישירה — אותה רפרנס
ok(overrideOf('a@x.co', org, ne) === card, 'דוגמה 1: לא הוחזר הכרטיס עצמו');
// 2) נירמול דרך השקע
ok(overrideOf('  A@X.Co ', org, ne) === card, 'דוגמה 2: הנירמול לא הופעל');
// 3) מייל בלי כרטיס ⇒ {}
const r3 = overrideOf('b@x.co', org, ne);
ok(r3 && typeof r3 === 'object' && Object.keys(r3).length === 0, 'דוגמה 3: לא {} ריק');
// 4) org בלי memberConfigs ⇒ {}
const r4 = overrideOf('a@x.co', {}, ne);
ok(r4 && typeof r4 === 'object' && Object.keys(r4).length === 0, 'דוגמה 4: לא {} ריק');
// 5) כרטיס null ⇒ {} (?? מגן)
const r5 = overrideOf('c@x.co', { memberConfigs: { 'c@x.co': null } }, ne);
ok(r5 && typeof r5 === 'object' && Object.keys(r5).length === 0, 'דוגמה 5: null דלף');
if (f) process.exit(1);
console.log('✓ override-of: 5 דוגמאות-חוזה — ירוק');
