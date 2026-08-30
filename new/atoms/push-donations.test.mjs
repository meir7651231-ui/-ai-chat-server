import { pushDonations as __pure_pushDonations } from './push-donations.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_push_donations_T = {
  k1: 400,
};
const pushDonations = (...a) => __pure_pushDonations(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_push_donations_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const DB = { tag: 'db' };
const scopedDonations = () => 'orgs/demo/donations';

// זיוף-Firestore: יומן-אירועים גלובלי (סדר set/delete/commit חוצה-batches)
const mkFs = () => {
  const log = [];
  let batchN = 0;
  const fs = {
    doc: (db, col, id) => ({ db, col, id }),
    writeBatch: (db) => {
      const n = ++batchN;
      log.push({ ev: 'open', n, db });
      return {
        set: (ref, body) => log.push({ ev: 'set', n, ref, body }),
        delete: (ref) => log.push({ ev: 'delete', n, ref }),
        commit: async () => log.push({ ev: 'commit', n }),
      };
    },
  };
  return { fs, log };
};

// 1) set יחיד, dek=null — batch יחיד, גוף {pkey, supporterId, ...donation}
{
  const { fs, log } = mkFs();
  await pushDonations(
    { sets: [{ id: 'R-7', supporterId: 'sp1', pkey: 'P1', donation: { amount: 180, date: '2026-01-05' } }], deletes: [] },
    null, DB, scopedDonations, fs, () => { throw new Error('encryptDoc נקרא בלי dek'); }
  );
  const sets = log.filter((e) => e.ev === 'set');
  const commits = log.filter((e) => e.ev === 'commit');
  ok(sets.length === 1 && commits.length === 1, 'דוגמה 1: מספר set/commit שגוי');
  ok(eq(sets[0].ref, { db: DB, col: 'orgs/demo/donations', id: 'R-7' }), 'דוגמה 1: הפניית-doc שגויה');
  ok(eq(sets[0].body, { pkey: 'P1', supporterId: 'sp1', amount: 180, date: '2026-01-05' }), 'דוגמה 1: גוף-המסמך שגוי');
  ok(Object.keys(sets[0].body)[0] === 'pkey', 'דוגמה 1: pkey אינו השדה הראשון');
}

// 2) delete
{
  const { fs, log } = mkFs();
  await pushDonations({ sets: [], deletes: ['R-9'] }, null, DB, scopedDonations, fs, null);
  const dels = log.filter((e) => e.ev === 'delete');
  ok(dels.length === 1 && eq(dels[0].ref, { db: DB, col: 'orgs/demo/donations', id: 'R-9' }), 'דוגמה 2: delete שגוי');
}

// 3) הצפנה — pkey מחוץ למעטפה, encryptDoc בלי pkey
{
  const { fs, log } = mkFs();
  const encCalls = [];
  const encryptDoc = async (p, dek) => { encCalls.push({ p, dek }); return { enc: JSON.stringify(p), iv: 'IV' }; };
  await pushDonations(
    { sets: [{ id: 'R-7', supporterId: 'sp1', pkey: 'P1', donation: { amount: 180, date: '2026-01-05' } }], deletes: [] },
    'DEK', DB, scopedDonations, fs, encryptDoc
  );
  ok(encCalls.length === 1 && encCalls[0].dek === 'DEK', 'דוגמה 3: encryptDoc לא נקרא עם ה-dek');
  ok(eq(encCalls[0].p, { supporterId: 'sp1', amount: 180, date: '2026-01-05' }), 'דוגמה 3: pkey דלף לתוך המעטפה');
  const body = log.find((e) => e.ev === 'set').body;
  ok(eq(body, { pkey: 'P1', enc: JSON.stringify({ supporterId: 'sp1', amount: 180, date: '2026-01-05' }), iv: 'IV' }),
    'דוגמה 3: הגוף המוצפן שגוי (pkey חייב להישאר plaintext מחוץ למעטפה)');
}

// 4) חיתוך-אצווה: 401 sets ⇒ 400+1, commit ראשון לפני batch שני
{
  const { fs, log } = mkFs();
  const sets = Array.from({ length: 401 }, (_, i) => ({ id: 'R-' + i, supporterId: 'sp', pkey: 'P', donation: { amount: i } }));
  await pushDonations({ sets, deletes: [] }, null, DB, scopedDonations, fs, null);
  const b1 = log.filter((e) => e.ev === 'set' && e.n === 1).length;
  const b2 = log.filter((e) => e.ev === 'set' && e.n === 2).length;
  ok(b1 === 400 && b2 === 1, 'דוגמה 4: חיתוך ' + b1 + '+' + b2 + ' ≠ 400+1');
  ok(log.filter((e) => e.ev === 'commit').length === 2, 'דוגמה 4: מספר commits ≠ 2');
  const iCommit1 = log.findIndex((e) => e.ev === 'commit' && e.n === 1);
  const iOpen2 = log.findIndex((e) => e.ev === 'open' && e.n === 2);
  ok(iCommit1 < iOpen2, 'דוגמה 4: ה-batch השני נפתח לפני commit הראשון');
}

// 5) diff ריק ⇒ אפס batches
{
  const { fs, log } = mkFs();
  await pushDonations({ sets: [], deletes: [] }, null, DB, scopedDonations, fs, null);
  ok(log.length === 0, 'דוגמה 5: diff ריק פתח batch');
}

process.exit(f);
