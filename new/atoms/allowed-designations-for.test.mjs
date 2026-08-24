import { allowedDesignationsFor } from './allowed-designations-for.mjs';
// מימושי-שקע לבדיקה (בקופסה יחווטו האטומים האמיתיים):
const isOrgManager = (email, org) => (org.manager ?? '').trim().toLowerCase() === email.trim().toLowerCase();
const overrideOf = (email, org) => org.memberConfigs?.[email.trim().toLowerCase()] ?? {};
const org = {
  manager: 'boss@x.co',
  memberConfigs: { 'emp@x.co': { designations: ['חתן', 'כללי'] }, 'emp2@x.co': { designations: [] } },
};
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(allowedDesignationsFor('boss@x.co', org, isOrgManager, overrideOf) === null, 'מנהל ⇒ null');
ok(JSON.stringify(allowedDesignationsFor('emp@x.co', org, isOrgManager, overrideOf)) === '["חתן","כללי"]', 'עובד עם רשימה ⇒ הרשימה');
ok(allowedDesignationsFor('emp2@x.co', org, isOrgManager, overrideOf) === null, 'רשימה ריקה ⇒ null');
ok(allowedDesignationsFor('ghost@x.co', org, isOrgManager, overrideOf) === null, 'בלי כרטיס ⇒ null');
if (f) process.exit(1);
console.log('✓ allowed-designations-for: 4 דוגמאות-חוזה — ירוק');
