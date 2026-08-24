import { fetchOrgCloudConfig } from './fetch-org-cloud-config.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

const DB = { tag: 'db' };
const mkFs = (snap) => {
  const calls = { doc: [] };
  return { calls, doc: (...a) => { calls.doc.push(a); return { kind: 'doc' }; }, getDoc: async () => snap };
};

// 1) מסמך קיים ⇒ התוכן
const fs1 = mkFs({ exists: () => true, data: () => ({ orgName: 'מאור', enabled: true }) });
eq(await fetchOrgCloudConfig('demo', DB, fs1), { orgName: 'מאור', enabled: true }, 'מסמך-קיים שגוי');

// 2) לא-קיים ⇒ null
eq(await fetchOrgCloudConfig('demo', DB, mkFs({ exists: () => false, data: () => ({}) })), null, 'לא-קיים אינו null');

// 3) חיווט-הנתיב: platformOrgs/{slug}
eq(fs1.calls.doc[0], [DB, 'platformOrgs', 'demo'], 'נתיב-המסמך שגוי');

// 4) getDoc דוחה ⇒ null (נבלע)
eq(await fetchOrgCloudConfig('demo', DB, { doc: () => ({}), getDoc: async () => { throw new Error('permission-denied'); } }),
  null, 'כשל-getDoc לא נבלע');

// 5) doc עצמו זורק ⇒ null
eq(await fetchOrgCloudConfig('demo', DB, { doc: () => { throw new Error('bad'); }, getDoc: async () => ({}) }),
  null, 'כשל-doc לא נבלע');

if (f) process.exit(1);
console.log('✓ fetch-org-cloud-config: 5 דוגמאות-חוזה — ירוק');
