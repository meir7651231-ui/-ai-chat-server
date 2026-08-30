/** בדיקת-חוזה · make-normalize-config — זבל/allowlists/דגלי-true/firebase/emoji/motion. */
import { makeNormalizeConfig as __pure_makeNormalizeConfig } from './make-normalize-config.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_makeNormalizeConfig_MAKE_NORMALIZE_CONFIG_T = {
  k1: "use strict",
  k2: "object",
  k3: "string",
  k4: "boolean",
  k5: 500,
  k6: 12,
  k7: 120,
};
const makeNormalizeConfig = (...a) => __pure_makeNormalizeConfig(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_makeNormalizeConfig_MAKE_NORMALIZE_CONFIG_T);
import assert from 'node:assert';

const deps = {
  DEFAULT_CONFIG: { slug: 'default', orgName: 'מאור החסד', theme: 'or-rishon' },
  INTEGRATION_KEYS: ['whatsapp', 'payments', 'ai'],
  INTEGRATION_SETTING_KEYS: { payments: ['payUrl'] },
  MOTION_KEYS: ['calm', 'snappy', 'bold'],
  TEMPLATE_KEYS: ['waFamily', 'waDonor'],
  normalizeSite: (raw) => (raw && raw.enabled === true ? { enabled: true } : undefined),
  normalizeTelephony: (raw) => (raw && raw.enabled === true ? { enabled: true, numbers: [] } : undefined),
};
const nc = makeNormalizeConfig(deps);

// 1) זבל => null; בסיס מברירת-המחדל
for (const junk of [null, 'x', [], {}, { random: 1 }]) assert.strictEqual(nc(junk), null, JSON.stringify(junk));
const c1 = nc({ slug: 'demo' });
assert.strictEqual(c1.orgName, 'מאור החסד');
assert.deepStrictEqual([c1.modules, c1.features, c1.terms], [{}, {}, {}]);

// 2) דגלי true-מפורש
const c2 = nc({ slug: 'demo', cloudRoot: 'yes', donationSplit: 1, supporterEnforce: true });
assert.ok(!('cloudRoot' in c2) && !('donationSplit' in c2));
assert.strictEqual(c2.supporterEnforce, true);

// 3) allowlist-הרחבות: typo נזרק, הגדרה-זרה נזרקת, payUrl שורד עם trim
const c3 = nc({ slug: 'demo', integrations: {
  whatsapp: { enabled: true, evil: 'x' },
  payments: { enabled: false, payUrl: '  https://pay.co  ', hack: 'z' },
  typo: { enabled: true }, ai: 'not-object',
} });
assert.deepStrictEqual(c3.integrations, { whatsapp: { enabled: true }, payments: { enabled: false, payUrl: 'https://pay.co' } });

// 4) firebase: חלקי נמחק; מלא נשמר
assert.ok(!('firebase' in nc({ slug: 'd', firebase: { apiKey: 'K' } })));
const fb = { apiKey: 'K', authDomain: 'a', projectId: 'p', appId: 'i' };
assert.deepStrictEqual(nc({ slug: 'd', firebase: fb }).firebase, fb);

// 5) emoji נגזם ל-12; motion allowlist; accentCustom true-בלבד
const c5 = nc({ slug: 'd', emoji: 'א'.repeat(20), motion: 'hacker', accentCustom: 'yes' });
assert.strictEqual(c5.emoji.length, 12);
assert.ok(!('motion' in c5) && !('accentCustom' in c5));
assert.strictEqual(nc({ slug: 'd', motion: 'bold' }).motion, 'bold');
assert.strictEqual(nc({ slug: 'd', accentCustom: true }).accentCustom, true);

// 6) תבניות: מפתח-זר/ערך-לא-מחרוזת נזרקים
const c6 = nc({ slug: 'd', templates: { waFamily: 'שלום {name}', evil: 'x', waDonor: 7 } });
assert.deepStrictEqual(c6.templates, { waFamily: 'שלום {name}' });

// 7) site/telephony דרך השקעים
const c7 = nc({ slug: 'd', site: { enabled: true }, telephony: { enabled: true } });
assert.deepStrictEqual(c7.site, { enabled: true });
assert.deepStrictEqual(c7.telephony, { enabled: true, numbers: [] });
assert.ok(!('site' in nc({ slug: 'd', site: { enabled: false } })));
console.log('OK make-normalize-config');
