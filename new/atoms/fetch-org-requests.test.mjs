import { fetchOrgRequests } from './fetch-org-requests.mjs';
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

// 1) שתי בקשות ⇒ מיפוי uid+שדות (כולל פרופיל-האשף)
const fs1 = mkFs([
  { id: 'uidA', data: () => ({ orgName: 'חסד-לציון', phone: '031234567', industry: 'chesed' }) },
  { id: 'uidB', data: () => ({ orgName: 'בית-מדרש', size: 'small' }) },
]);
eq(await fetchOrgRequests(DB, fs1),
  [{ uid: 'uidA', orgName: 'חסד-לציון', phone: '031234567', industry: 'chesed' },
   { uid: 'uidB', orgName: 'בית-מדרש', size: 'small' }],
  'מיפוי הבקשות שגוי');

// 2) אוסף-ריק ⇒ []
eq(await fetchOrgRequests(DB, mkFs([])), [], 'אוסף-ריק אינו []');

// 3) חיווט: אוסף-שורש platformRequests
eq(fs1.calls.collection[0], [DB, 'platformRequests'], 'נתיב-האוסף שגוי');

// 4) כשל-קריאה ⇒ זורק
let threw = false;
try {
  await fetchOrgRequests(DB, { ...mkFs([]), getDocs: async () => { throw new Error('permission-denied'); } });
} catch (e) { threw = /permission-denied/.test(e.message); }
ok(threw, 'כשל-קריאה לא זרק');

// 5) המזהה נכנס ל-uid
eq(await fetchOrgRequests(DB, mkFs([{ id: 'u3', data: () => ({ orgName: 'אור' }) }])),
  [{ uid: 'u3', orgName: 'אור' }], 'שדה-המזהה שגוי');

if (f) process.exit(1);
console.log('✓ fetch-org-requests: 5 דוגמאות-חוזה — ירוק');
