import { readOrgSecretsMeta as __pure_readOrgSecretsMeta } from './read-org-secrets-meta.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_read_org_secrets_meta_T = {
  k1: "orgSecretsMeta",
};
const readOrgSecretsMeta = (...a) => __pure_readOrgSecretsMeta(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_read_org_secrets_meta_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const ref = { __ref: true };
const mkFs = (snap) => {
  const docCalls = [];
  const getCalls = [];
  return {
    docCalls, getCalls,
    fs: {
      db,
      doc: (...args) => { docCalls.push(args); return ref; },
      getDoc: async (r) => { getCalls.push(r); return snap; },
    },
  };
};

// 1) עדות-נתיב
const m1 = mkFs({ exists: () => false, data: () => null });
await readOrgSecretsMeta('kehila', m1.fs);
chk("1 ‏doc(db,'orgSecretsMeta','kehila') פעם אחת + getDoc עם ההפניה",
  m1.docCalls.length === 1 && m1.docCalls[0][0] === db &&
  JSON.stringify(m1.docCalls[0].slice(1)) === JSON.stringify(['orgSecretsMeta', 'kehila']) &&
  m1.getCalls.length === 1 && m1.getCalls[0] === ref);

// 2) לא קיים ⇒ {}
const out2 = await readOrgSecretsMeta('s', mkFs({ exists: () => false, data: () => ({ smtpUrl: true }) }).fs);
chk('2 לא-קיים ⇒ {}', JSON.stringify(out2) === '{}');

// 3) קיים ⇒ המסמך כמות-שהוא
const meta = { smtpUrl: true, smsApiKey: false, updatedAt: '2026-08-04T05:00:00.000Z' };
const out3 = await readOrgSecretsMeta('s', mkFs({ exists: () => true, data: () => meta }).fs);
chk('3 המסמך מוחזר כמות-שהוא', out3 === meta &&
  out3.smtpUrl === true && out3.smsApiKey === false && out3.updatedAt === '2026-08-04T05:00:00.000Z');

// 4) getDoc נדחה ⇒ {} (נבלע)
const out4 = await readOrgSecretsMeta('s', { db, doc: () => ref, getDoc: async () => { throw new Error('permission-denied'); } });
chk('4 דחיית-getDoc נבלעת ⇒ {}', JSON.stringify(out4) === '{}');

// 5) doc זורק סינכרונית ⇒ {} (נבלע)
const out5 = await readOrgSecretsMeta('s', { db, doc: () => { throw new Error('ענן לא אותחל'); }, getDoc: async () => null });
chk('5 זריקה סינכרונית נבלעת ⇒ {}', JSON.stringify(out5) === '{}');

if (f) process.exit(1);
console.log('✓ read-org-secrets-meta: 5 דוגמאות-חוזה (שקעי-fs + failure-safe) — ירוק');
