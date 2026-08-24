/** בדיקת-קצה: קופסת-platform דרך הקופסה בלבד — כל 24 החוטים המחווטים + מגן-הכרעה.
 *  DoD (דיבר 12): node platform.test.mjs ⇒ exit 0, "✓ קופסת-platform". */
import * as P from './platform.mjs';
import { readFileSync } from 'node:fs';
import assert from 'node:assert';
let f = 0;
const chk = (c, m) => { if (!c) { console.error('✗ ' + m); f = 1; } };

// ── סלאג ותעתיק ──
chk(P.slugify('מאור החסד', []) === 'mavr-hchsd', 'slugify עברית');
chk(P.slugify('', []) === 'org', 'slugify ריק ⇒ org');
chk(P.slugify('Test', ['test']) === 'test-2', 'slugify ייחודי');
chk(P.isValidSlug('ab') === true && P.isValidSlug('A') === false, 'isValidSlug');

// ── מרשמים ──
chk(P.ALL_MODULES.length === 9 && P.ALL_MODULES[0] === 'families', 'ALL_MODULES');
chk(P.MODULE_LABELS.shop7 === 'חלוקה', 'MODULE_LABELS');

// ── קונפיג-לידה + קישורים ──
const born = P.allOffConfig('x', 'ארגון');
chk(born.modules.families === false && born.modules.shop7 === false, 'allOffConfig all-off');
chk(born.theme === 'or-rishon' && JSON.stringify(born.features) === '{}', 'allOffConfig ברירת-מחדל');
chk(P.orgLink('https://a.co', '/', 'x') === 'https://a.co/?org=x', 'orgLink');

// ── מייל וקודים ──
chk(P.normEmail(' A@B.CO ') === 'a@b.co', 'normEmail');
chk(P.genJoinCode('x').length === 8 && P.genJoinCode('x') === P.genJoinCode('x'), 'genJoinCode דטרמיניסטי');
chk(P.orgJoinLink('https://a.co', '/', 'x', 'c') === 'https://a.co/?org=x&join=c', 'orgJoinLink');
chk(P.orgJoinFullCode('x', 'abcd') === 'x.abcd', 'orgJoinFullCode');
assert.deepStrictEqual(P.parseJoinFullCode('org.abcd'), { slug: 'org', code: 'abcd' }, 'parseJoinFullCode תקין');
chk(P.parseJoinFullCode('nodot') === null && P.parseJoinFullCode('x.c') === null, 'parseJoinFullCode דחייה (slug<2)');

// ── היררכיית-הרשאות ──
chk(P.isOrgManager('m@o.co', { manager: 'm@o.co' }) === true, 'isOrgManager חיובי');
chk(P.isOrgManager('x@o.co', { manager: '' }) === false, 'isOrgManager ריק');
chk(P.orgEnabledModules({ modules: { shop: false } }).length === 8, 'orgEnabledModules — shop כבוי');
const FEATS = [
  { key: 'supporters.hok', module: 'supporters' },        // רגיל, מודול דלוק
  { key: 'shop.x', module: 'shop' },                       // מודול-אב כבוי
  { key: 'supporters.cockpit', module: 'supporters', optIn: true }, // opt-in לא-מודלק
];
const enF = P.orgEnabledFeatures({ modules: { shop: false }, features: {} }, FEATS);
chk(enF.length === 1 && enF[0].key === 'supporters.hok', 'orgEnabledFeatures תקרה+opt-in');
chk(P.isMember('e@o.co', { members: ['e@o.co'] }) === true, 'isMember');
assert.deepStrictEqual(P.overrideOf('nope@o.co', {}), {}, 'overrideOf ריק');
chk(P.GRANTABLE_STAFF_FEATURES.has('supporters.delete') && P.GRANTABLE_STAFF_FEATURES.size === 10, 'GRANTABLE סט');
chk(P.isGrantableFeature('shop.delete') === true && P.isGrantableFeature('shop.x') === false, 'isGrantableFeature');

// ── effectiveConfigFor: מנהל=מלא · הגבלה-בלבד · הדלקת-grantable ──
const org = {
  manager: 'm@o.co', members: ['e@o.co'],
  memberConfigs: { 'e@o.co': { modules: { shop: false }, features: { 'supporters.delete': true, 'supporters.hok': true } } },
};
const cfg = { modules: { shop: true, families: true }, features: {} };
chk(P.effectiveConfigFor('m@o.co', org, cfg) === cfg, 'effectiveConfigFor מנהל=זהות');
const eff = P.effectiveConfigFor('e@o.co', org, cfg);
chk(eff.modules.shop === false, 'effectiveConfigFor הגבלת-מודול');
chk(eff.features['supporters.delete'] === true, 'effectiveConfigFor הדלקת-grantable');
chk(eff.features['supporters.hok'] === undefined, 'effectiveConfigFor true לא-grantable ⇒ מתעלמים');

// ── allowedDesignationsFor · canIssueReceipt ──
chk(P.allowedDesignationsFor('m@o.co', org) === null, 'allowedDesignationsFor מנהל=null');
chk(P.allowedDesignationsFor('e@o.co', org) === null, 'allowedDesignationsFor בלי-רשימה=null');
chk(P.canIssueReceipt({ superAdmin: false, isManager: false, cloudRoot: false, cloudConnected: false }) === true, 'canIssueReceipt מקומי');
chk(P.canIssueReceipt({ superAdmin: false, isManager: false, cloudRoot: false, cloudConnected: true }) === false, 'canIssueReceipt חסום');

// ── מוטציות-חברות ──
assert.deepStrictEqual(P.approveMember({ members: ['a@o.co'] }, ' E@O.CO '), { members: ['a@o.co', 'e@o.co'] }, 'approveMember');
assert.deepStrictEqual(P.setEmployeeOverride({}, 'e@o.co', { modules: { shop: false } }),
  { memberConfigs: { 'e@o.co': { modules: { shop: false } } } }, 'setEmployeeOverride');
assert.deepStrictEqual(P.removeMember({ members: ['e@o.co', 'a@o.co'], memberConfigs: { 'e@o.co': {} } }, 'e@o.co'),
  { members: ['a@o.co'], memberConfigs: {} }, 'removeMember');

/* 🛡 מגן-הכרעה — קורא את מקור-הקופסה ומאשר הכרעות verbatim (דפוס theme.test) */
const src = readFileSync(new URL('./platform.mjs', import.meta.url), 'utf8');
chk(/theme:\s*'or-rishon'/.test(src), 'מגן: קונפיג-הלידה theme=or-rishon');
chk(!/from '\.\.\/boxes\//.test(src) && !/from '\.\/[^']*\.mjs'/.test(src), 'מגן: אפס import-קופסה (חוק-2)');
chk(/effectiveConfigForAtom\([^)]*GRANTABLE_STAFF_FEATURES/.test(src), 'מגן: תפר-הדלקה-פר-עובד מזריק את GRANTABLE');

if (f) process.exit(1);
console.log('✓ קופסת-platform: 24 חוטים מחווטים · תעתיק/הרשאות/תקרה/הדלקת-grantable/מוטציות — קצה ומגן-הכרעה ירוקים');
