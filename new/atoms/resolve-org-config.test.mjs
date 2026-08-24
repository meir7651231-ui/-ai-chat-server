/** בדיקת-חוזה · resolve-org-config — אפס-שינוי · שימור-slug · השלמת-firebase · עדיפות-ענן. */
import { resolveOrgConfig } from './resolve-org-config.mjs';
import assert from 'node:assert';
const passThru = (raw) => (raw && typeof raw === 'object' ? { ...raw } : null);
const st = { slug: 'root', name: 'סטטי', firebase: { apiKey: 'K' }, modules: {} };

// 1) ענן לא-שמיש ⇒ אותה-רפרנס
assert.strictEqual(resolveOrgConfig(st, null, passThru), st);
assert.strictEqual(resolveOrgConfig(st, 'junk', passThru), st);
// 2) slug של הכתובת מנצח
const m = resolveOrgConfig(st, { slug: 'evil', name: 'ענן' }, passThru);
assert.strictEqual(m.slug, 'root');
assert.strictEqual(m.name, 'ענן');
// 3) firebase מהסטטי כשהענן בלי
assert.deepStrictEqual(m.firebase, { apiKey: 'K' });
// 3b) הענן מגדיר ⇒ הענן גובר
const m2 = resolveOrgConfig(st, { firebase: { apiKey: 'CLOUD' } }, passThru);
assert.deepStrictEqual(m2.firebase, { apiKey: 'CLOUD' });
console.log('✓ resolve-org-config');
