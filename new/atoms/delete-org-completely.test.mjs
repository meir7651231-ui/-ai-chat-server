import { deleteOrgCompletely } from './delete-org-completely.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

/** פיירסטור-מזויף בזיכרון: store = מפה נתיב-אוסף ⇒ מספר-מסמכים. */
function fakeFs(store, { failRootDelete = false } = {}) {
  const wiped = [];           // אוספים שנסרקו (בסדר)
  const directDeletes = [];   // נתיבי deleteDoc ישיר (doc)
  const sets = [];            // קריאות setDoc
  const db = { __db: true };
  const doc = (d, ...segs) => ({ path: segs.join('/') });
  const collection = (d, path) => ({ path });
  const getDocs = async (col) => {
    wiped.push(col.path);
    const n = store.get(col.path) ?? 0;
    return { docs: Array.from({ length: n }, (_, i) => ({ ref: { path: col.path + '/#' + i } })) };
  };
  const deleteDoc = (ref) => {
    if (!ref.path.includes('/#')) {
      directDeletes.push(ref.path);
      if (failRootDelete && ref.path.startsWith('orgSecrets/')) return Promise.reject(new Error('missing'));
    }
    return Promise.resolve();
  };
  const setDoc = async (ref, data) => { sets.push([ref.path, data]); };
  return { fs: { db, doc, collection, getDocs, deleteDoc, setDoc }, wiped, directDeletes, sets };
}

// 1) ריק לגמרי ⇒ 6 (3 שורש + 2 יחיד + מצבת)
{
  const { fs } = fakeFs(new Map());
  chk('1 ריק ⇒ 6', (await deleteOrgCompletely('e0', [], fs)) === 6);
}

// 2–5) תרחיש מלא s1
{
  const store = new Map([
    ['orgs/s1/families', 2],
    ['orgs/s1/donations', 1],
    ['teamChats/s1/messages', 1],
    ['platformOrgs/s1/joinRequests', 2],
  ]);
  const { fs, wiped, directDeletes, sets } = fakeFs(store);
  const n = await deleteOrgCompletely('s1', ['families'], fs);
  chk('2 מונה = 12', n === 12);
  chk('3 סדר-האוספים', JSON.stringify(wiped) === JSON.stringify([
    'orgs/s1/families', 'orgs/s1/donations', 'orgs/s1/auditlog',
    'orgs/s1/incomingPayments', 'orgs/s1/smsOutbox', 'orgs/s1/mailOutbox',
    'teamChats/s1/messages', 'platformOrgs/s1/joinRequests',
  ]));
  chk('4 שש מחיקות-ישירות', JSON.stringify(directDeletes) === JSON.stringify([
    'orgSecrets/s1', 'orgSecretsMeta/s1', 'icsFeeds/s1',
    'teamChats/s1', 'orgs/s1/meta/org', 'orgs/s1/_enc/envelope',
  ]));
  chk('5 מצבת', sets.length === 1 && sets[0][0] === 'platformOrgs/s1'
    && sets[0][1].deleted === true && /^\d{4}-\d{2}-\d{2}T.*Z$/.test(sets[0][1].deletedAt));
}

// 6) כשל deleteDoc על orgSecrets נבלע — עדיין 6
{
  const { fs } = fakeFs(new Map(), { failRootDelete: true });
  chk('6 כשל-שורש נבלע', (await deleteOrgCompletely('e0', [], fs)) === 6);
}

if (f) process.exit(1);
console.log('✓ delete-org-completely: 6 דוגמאות-חוזה (פיירסטור-מזויף) — ירוק');
