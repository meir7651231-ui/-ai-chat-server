import { fetchIncomingPayments } from './fetch-incoming-payments.mjs';
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

// 1) שני מסמכים ⇒ מיפוי id+שדות
const fs1 = mkFs([
  { id: 'p1', data: () => ({ amount: 120, status: 'pending' }) },
  { id: 'p2', data: () => ({ amount: 75, status: 'pending' }) },
]);
eq(await fetchIncomingPayments(DB, scopedCol, fs1),
  [{ id: 'p1', amount: 120, status: 'pending' }, { id: 'p2', amount: 75, status: 'pending' }],
  'מיפוי שני מסמכים שגוי');

// 2) אוסף-ריק ⇒ []
eq(await fetchIncomingPayments(DB, scopedCol, mkFs([])), [], 'אוסף-ריק אינו []');

// 3) חיווט: הנתיב הסקופי + תנאי ה-where
eq(fs1.calls.collection[0], [DB, 'orgs/demo/incomingPayments'], 'נתיב-האוסף שגוי');
eq(fs1.calls.where[0], ['status', '==', 'pending'], 'תנאי-הסינון שגוי');

// 4) כשל-קריאה ⇒ זורק (לא בולע)
let threw = false;
try {
  await fetchIncomingPayments(DB, scopedCol, { ...mkFs([]), getDocs: async () => { throw new Error('permission-denied'); } });
} catch (e) { threw = /permission-denied/.test(e.message); }
ok(threw, 'כשל-קריאה לא זרק');

// 5) המזהה מוזרק ראשון
eq(await fetchIncomingPayments(DB, scopedCol, mkFs([{ id: 'p9', data: () => ({ sum: 1 }) }])),
  [{ id: 'p9', sum: 1 }], 'הזרקת-id שגויה');

if (f) process.exit(1);
console.log('✓ fetch-incoming-payments: 5 דוגמאות-חוזה — ירוק');
