import { effectiveConfigFor } from './effective-config-for.mjs';
// מימושי-שקע לבדיקה (בקופסה יחווטו האטומים האמיתיים):
const isOrgManager = (email, org) => (org.manager ?? '').trim().toLowerCase() === email.trim().toLowerCase();
const overrideOf = (email, org) => org.memberConfigs?.[email.trim().toLowerCase()] ?? {};
const grantable = new Set(['supporters.delete']);
const org = {
  manager: 'boss@x.co',
  memberConfigs: {
    'emp@x.co': {
      modules: { shop: false, courses: true },
      features: { 'a.x': false, 'supporters.delete': true, 'b.y': true },
    },
  },
};
const orgConfig = { modules: { shop: true, courses: true }, features: { 'a.x': true, 'supporters.delete': false } };
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(effectiveConfigFor('boss@x.co', org, orgConfig, isOrgManager, overrideOf, grantable) === orgConfig, 'מנהל ⇒ אותו אובייקט');
ok(effectiveConfigFor('ghost@x.co', org, orgConfig, isOrgManager, overrideOf, grantable) === orgConfig, 'בלי כרטיס ⇒ אותו אובייקט');
const eff = effectiveConfigFor('emp@x.co', org, orgConfig, isOrgManager, overrideOf, grantable);
ok(eff.modules.shop === false, 'modules.shop כובה');
ok(eff.modules.courses === true, 'true על מודול מתעלמים — נשאר כבארגון');
ok(eff.features['a.x'] === false, "features['a.x'] כובה");
ok(eff.features['supporters.delete'] === true, 'הדלקה פר-עובד — מפתח בסט');
ok(eff.features['b.y'] === undefined, 'true שלא-בסט מתעלמים');
ok(orgConfig.modules.shop === true && orgConfig.features['supporters.delete'] === false, 'הקלט לא השתנה (טהור)');
if (f) process.exit(1);
console.log('✓ effective-config-for: 8 דוגמאות-חוזה — ירוק');
