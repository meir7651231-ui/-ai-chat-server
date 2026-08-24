import { fetchOrgLeads } from './fetch-org-leads.mjs';
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

// 1) שני לידים ⇒ מיפוי id+שדות
const fs1 = mkFs([
  { id: 'L1', data: () => ({ name: 'דוד', phone: '0521112223' }) },
  { id: 'L2', data: () => ({ name: 'שרה', at: '2026-08-01' }) },
]);
eq(await fetchOrgLeads(DB, fs1),
  [{ id: 'L1', name: 'דוד', phone: '0521112223' }, { id: 'L2', name: 'שרה', at: '2026-08-01' }],
  'מיפוי הלידים שגוי');

// 2) אוסף-ריק ⇒ []
eq(await fetchOrgLeads(DB, mkFs([])), [], 'אוסף-ריק אינו []');

// 3) חיווט: אוסף-שורש בלי slug
eq(fs1.calls.collection[0], [DB, 'platformLeads'], 'נתיב-האוסף שגוי');

// 4) כשל-קריאה ⇒ זורק
let threw = false;
try {
  await fetchOrgLeads(DB, { ...mkFs([]), getDocs: async () => { throw new Error('permission-denied'); } });
} catch (e) { threw = /permission-denied/.test(e.message); }
ok(threw, 'כשל-קריאה לא זרק');

// 5) המזהה מוזרק ראשון
eq(await fetchOrgLeads(DB, mkFs([{ id: 'L9', data: () => ({ name: 'גד' }) }])),
  [{ id: 'L9', name: 'גד' }], 'הזרקת-id שגויה');

if (f) process.exit(1);
console.log('✓ fetch-org-leads: 5 דוגמאות-חוזה — ירוק');
