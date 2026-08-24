import { fetchOrgJoinRequests } from './fetch-org-join-requests.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

const DB = { tag: 'db' };
const mkFs = (docs) => {
  const calls = { collection: [] };
  return {
    calls,
    collection: (...a) => { calls.collection.push(a); return { kind: 'col' }; },
    getDocs: async () => ({ docs }),
  };
};

// 1) שתי בקשות ⇒ מיפוי uid+שדות
const fs1 = mkFs([
  { id: 'u1', data: () => ({ email: 'a@b.com', name: 'רחל' }) },
  { id: 'u2', data: () => ({ email: 'c@d.com' }) },
]);
eq(await fetchOrgJoinRequests('demo', DB, fs1),
  [{ uid: 'u1', email: 'a@b.com', name: 'רחל' }, { uid: 'u2', email: 'c@d.com' }],
  'מיפוי הבקשות שגוי');

// 2) אוסף-ריק ⇒ []
eq(await fetchOrgJoinRequests('demo', DB, mkFs([])), [], 'אוסף-ריק אינו []');

// 3) חיווט: 4 מקטעי-הנתיב
eq(fs1.calls.collection[0], [DB, 'platformOrgs', 'demo', 'joinRequests'], 'נתיב תת-האוסף שגוי');

// 4) כשל-קריאה ⇒ זורק
let threw = false;
try {
  await fetchOrgJoinRequests('demo', DB, { ...mkFs([]), getDocs: async () => { throw new Error('permission-denied'); } });
} catch (e) { threw = /permission-denied/.test(e.message); }
ok(threw, 'כשל-קריאה לא זרק');

// 5) המזהה נכנס ל-uid
eq(await fetchOrgJoinRequests('demo', DB, mkFs([{ id: 'u9', data: () => ({ email: 'x@y.z' }) }])),
  [{ uid: 'u9', email: 'x@y.z' }], 'שדה-המזהה שגוי');

if (f) process.exit(1);
console.log('✓ fetch-org-join-requests: 5 דוגמאות-חוזה — ירוק');
