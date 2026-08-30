import { fetchNedarimDonors as __pure_fetchNedarimDonors } from './fetch-nedarim-donors.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_fetch_nedarim_donors_T = {
  k1: "nedarimDonors",
};
const fetchNedarimDonors = (...a) => __pure_fetchNedarimDonors(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_fetch_nedarim_donors_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

const DB = { tag: 'db' };
const scopedCol = (c) => 'orgs/root/' + c;
const mkFs = (docs) => {
  const calls = { collection: [] };
  return {
    calls,
    collection: (...a) => { calls.collection.push(a); return { kind: 'col', path: a[1] }; },
    getDocs: async () => ({ docs }),
  };
};

// 1) שני מסמכים ⇒ מיפוי toremId+שדות
const fs1 = mkFs([
  { id: 't100', data: () => ({ name: 'ראובן', phone: '0501234567' }) },
  { id: 't200', data: () => ({ name: 'שמעון' }) },
]);
eq(await fetchNedarimDonors(DB, scopedCol, fs1),
  [{ toremId: 't100', name: 'ראובן', phone: '0501234567' }, { toremId: 't200', name: 'שמעון' }],
  'מיפוי שני מסמכים שגוי');

// 2) אוסף-ריק ⇒ []
eq(await fetchNedarimDonors(DB, scopedCol, mkFs([])), [], 'אוסף-ריק אינו []');

// 3) חיווט: הנתיב הסקופי, בלי query/where
eq(fs1.calls.collection[0], [DB, 'orgs/root/nedarimDonors'], 'נתיב-האוסף שגוי');

// 4) כשל-קריאה ⇒ זורק
let threw = false;
try {
  await fetchNedarimDonors(DB, scopedCol, { ...mkFs([]), getDocs: async () => { throw new Error('net-down'); } });
} catch (e) { threw = /net-down/.test(e.message); }
ok(threw, 'כשל-קריאה לא זרק');

// 5) המזהה נכנס ל-toremId (לא id)
eq(await fetchNedarimDonors(DB, scopedCol, mkFs([{ id: 't7', data: () => ({ name: 'לוי' }) }])),
  [{ toremId: 't7', name: 'לוי' }], 'שדה-המזהה שגוי');

if (f) process.exit(1);
console.log('✓ fetch-nedarim-donors: 5 דוגמאות-חוזה — ירוק');
