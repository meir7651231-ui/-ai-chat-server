import { fetchProviderRows } from './fetch-provider-rows.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

const DB = { tag: 'db' };
const scopedCol = (c) => 'orgs/demo/' + c;
const mkFs = (docs) => {
  const calls = { collection: [], where: [] };
  return {
    calls,
    collection: (...a) => { calls.collection.push(a); return { kind: 'col', path: a[1] }; },
    where: (...a) => { calls.where.push(a); return { kind: 'where', a }; },
    query: (col, w) => ({ kind: 'query', col, w }),
    getDocs: async () => ({ docs }),
  };
};

// 1) שני מסמכים — גם handled נכלל
const fs1 = mkFs([
  { id: 'r1', data: () => ({ amount: 120, status: 'handled' }) },
  { id: 'r2', data: () => ({ amount: 75, status: 'pending' }) },
]);
eq(await fetchProviderRows('nedarim', DB, scopedCol, fs1),
  [{ id: 'r1', amount: 120, status: 'handled' }, { id: 'r2', amount: 75, status: 'pending' }],
  'מיפוי שני מסמכים (כולל handled) שגוי');

// 2) אוסף-ריק ⇒ []
eq(await fetchProviderRows('nedarim', DB, scopedCol, mkFs([])), [], 'אוסף-ריק אינו []');

// 3) חיווט: הנתיב הסקופי + תנאי ה-provider
eq(fs1.calls.collection[0], [DB, 'orgs/demo/incomingPayments'], 'נתיב-האוסף שגוי');
eq(fs1.calls.where[0], ['provider', '==', 'nedarim'], 'תנאי-הסינון שגוי');

// 4) כשל-קריאה ⇒ זורק (לא בולע)
let threw = false;
try {
  await fetchProviderRows('nedarim', DB, scopedCol, { ...mkFs([]), getDocs: async () => { throw new Error('permission-denied'); } });
} catch (e) { threw = /permission-denied/.test(e.message); }
ok(threw, 'כשל-קריאה לא זרק');

// 5) המזהה מוזרק ראשון
eq(await fetchProviderRows('x', DB, scopedCol, mkFs([{ id: 'r9', data: () => ({ sum: 2 }) }])),
  [{ id: 'r9', sum: 2 }], 'הזרקת-id שגויה');

if (f) process.exit(1);
console.log('✓ fetch-provider-rows: 5 דוגמאות-חוזה — ירוק');
