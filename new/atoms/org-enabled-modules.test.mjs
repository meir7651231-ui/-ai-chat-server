import { orgEnabledModules } from './org-enabled-modules.mjs';

// מימוש-שקע לבדיקה: מרשם-מודולים קטן.
const allModules = ['families', 'courses', 'supporters'];

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const J = JSON.stringify;

ok(J(orgEnabledModules({ modules: { courses: false } }, allModules)) === J(['families', 'supporters']),
  'courses:false מסונן');
ok(J(orgEnabledModules({}, allModules)) === J(allModules), 'בלי modules ⇒ הכול דלוק');
ok(J(orgEnabledModules({ modules: {} }, allModules)) === J(allModules), 'modules ריק ⇒ הכול דלוק');
ok(J(orgEnabledModules({ modules: { courses: true } }, allModules)) === J(allModules), 'true אינו משנה');
ok(J(orgEnabledModules({ modules: { families: false, courses: false, supporters: false } }, allModules)) === J([]),
  'הכול false ⇒ []');

if (f) process.exit(1);
console.log('✓ org-enabled-modules: 5 דוגמאות-חוזה — ירוק');
