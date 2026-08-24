import { orgEnabledFeatures } from './org-enabled-features.mjs';

// מימושי-שקע לבדיקה: מרשם-מודולים קטן + מימוש נאמן-למקור של org-enabled-modules.
const allModules = ['families', 'courses'];
const orgEnabledModules = (orgConfig, mods) => mods.filter((m) => orgConfig.modules?.[m] !== false);

const A = { key: 'families.a', module: 'families' };
const B = { key: 'courses.b', module: 'courses' };
const C = { key: 'core.c', module: 'core', optIn: true };
const D = { key: 'core.d', module: 'core' };
const REG = [A, B, C, D];

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const keys = (cfg) => orgEnabledFeatures(cfg, REG, allModules, orgEnabledModules).map((x) => x.key).join(',');

ok(keys({}) === 'families.a,courses.b,core.d', 'קונפיג ריק: רגילים דלוקים, opt-in בחוץ: ' + keys({}));
ok(keys({ modules: { courses: false } }) === 'families.a,core.d',
  'מודול-אב כבוי מפיל את דגליו: ' + keys({ modules: { courses: false } }));
ok(keys({ modules: { courses: false }, features: { 'courses.b': true } }) === 'families.a,core.d',
  'מודול-אב כבוי גובר על דגל true');
ok(keys({ features: { 'core.c': true } }) === 'families.a,courses.b,core.c,core.d',
  'opt-in נדלק רק ב-true מפורש: ' + keys({ features: { 'core.c': true } }));
ok(keys({ features: { 'families.a': false } }) === 'courses.b,core.d',
  'דגל רגיל: false מכבה');
ok(keys({ features: { 'core.c': 1 } }) === 'families.a,courses.b,core.d',
  'truthy שאינו true אינו מדליק opt-in');
// הפלט = אותם אובייקטים (לא עותקים)
ok(orgEnabledFeatures({}, REG, allModules, orgEnabledModules)[0] === A, 'אותם אובייקטים בפלט');

if (f) process.exit(1);
console.log('✓ org-enabled-features: 7 דוגמאות-חוזה — ירוק');
