import { pushDiff as __pure_pushDiff } from './push-diff.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_push_diff_T = {
  k1: 400,
};
const pushDiff = (...a) => __pure_pushDiff(...a, ...Array(Math.max(0, 9 - a.length)).fill(undefined), __d_push_diff_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const DB = { tag: 'db' };
const scopedCol = (c) => 'orgs/demo/' + c;

// זיוף-Firestore: יומן-אירועים גלובלי (סדר set/delete/commit/pushMeta חוצה-batches)
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
const noEnc = () => { throw new Error('encryptDoc נקרא בלי dek'); };
const noMeta = () => { throw new Error('pushMeta נקרא בלי meta'); };

// 1) set+delete, dek=null, אכיפה כבויה, בלי meta — toPlain מנקה undefined ומנתק הפניה
{
  const { fs, log } = mkFs();
  const data = { name: 'לוי', amount: 250, note: undefined };
  await pushDiff(
    { sets: [{ col: 'families', id: 'f1', data }], deletes: [{ col: 'rooms', id: 'r9' }] },
    null, new Map(), DB, scopedCol, fs, noEnc, noMeta
  );
  const sets = log.filter((e) => e.ev === 'set');
  const dels = log.filter((e) => e.ev === 'delete');
  const commits = log.filter((e) => e.ev === 'commit');
  ok(sets.length === 1 && dels.length === 1 && commits.length === 1, 'דוגמה 1: מספר set/delete/commit שגוי');
  ok(eq(sets[0].ref, { db: DB, col: 'orgs/demo/families', id: 'f1' }), 'דוגמה 1: הפניית-set שגויה');
  ok(eq(sets[0].body, { name: 'לוי', amount: 250 }) && !('note' in sets[0].body),
    'דוגמה 1: toPlain לא ניקה undefined');
  ok(sets[0].body !== data, 'דוגמה 1: ההפניה לא נותקה (toPlain)');
  ok(eq(dels[0].ref, { db: DB, col: 'orgs/demo/rooms', id: 'r9' }), 'דוגמה 1: הפניית-delete שגויה');
}

// 2) הצפנה — encryptDoc מקבל עותק-נקי, הגוף = המעטפה בלבד
{
  const { fs, log } = mkFs();
  const encCalls = [];
  const encryptDoc = async (p, dek) => { encCalls.push({ p, dek }); return { enc: JSON.stringify(p), iv: 'IV' }; };
  await pushDiff(
    { sets: [{ col: 'families', id: 'f1', data: { name: 'לוי', amount: 250, note: undefined } }], deletes: [] },
    'DEK', new Map(), DB, scopedCol, fs, encryptDoc, noMeta
  );
  ok(encCalls.length === 1 && encCalls[0].dek === 'DEK' && eq(encCalls[0].p, { name: 'לוי', amount: 250 }),
    'דוגמה 2: encryptDoc לא קיבל את העותק-הנקי + ה-dek');
  const body = log.find((e) => e.ev === 'set').body;
  ok(eq(body, { enc: JSON.stringify({ name: 'לוי', amount: 250 }), iv: 'IV' }), 'דוגמה 2: הגוף ≠ המעטפה בלבד');
}

// 3) אכיפה + skey — רק אוסף-נאכף; docSkey מקבל את data הגולמי ואת המפה
{
  const { fs, log } = mkFs();
  const skeyCalls = [];
  const map = new Map([['sp1', 'K1']]);
  const sup = {
    enforceOn: true,
    keyedCols: ['supporters', 'events'],
    docSkey: (col, data, m) => { skeyCalls.push({ col, data, m }); return col + '#' + data.forWho; },
    stripAuditMeta: null,
  };
  const raw = { forWho: 'sp1', amount: 100 };
  await pushDiff(
    { sets: [{ col: 'supporters', id: 's1', data: raw }, { col: 'rooms', id: 'r1', data: { name: 'חדר' } }], deletes: [] },
    null, map, DB, scopedCol, fs, noEnc, noMeta, sup
  );
  const sets = log.filter((e) => e.ev === 'set');
  ok(eq(sets[0].body, { skey: 'supporters#sp1', forWho: 'sp1', amount: 100 }), 'דוגמה 3: גוף-נאכף שגוי');
  ok(Object.keys(sets[0].body)[0] === 'skey', 'דוגמה 3: skey אינו השדה הראשון');
  ok(skeyCalls.length === 1 && skeyCalls[0].data === raw && skeyCalls[0].m === map,
    'דוגמה 3: docSkey לא קיבל את data הגולמי + supKeyBySpId');
  ok(!('skey' in sets[1].body), 'דוגמה 3: skey דלף לאוסף לא-נאכף');
}

// 4) חיתוך-אצווה: 401 פעולות ⇒ 400+1, commit ראשון לפני batch שני
{
  const { fs, log } = mkFs();
  const sets = Array.from({ length: 401 }, (_, i) => ({ col: 'families', id: 'f' + i, data: { n: i } }));
  await pushDiff({ sets, deletes: [] }, null, new Map(), DB, scopedCol, fs, noEnc, noMeta);
  const b1 = log.filter((e) => e.ev === 'set' && e.n === 1).length;
  const b2 = log.filter((e) => e.ev === 'set' && e.n === 2).length;
  ok(b1 === 400 && b2 === 1, 'דוגמה 4: חיתוך ' + b1 + '+' + b2 + ' ≠ 400+1');
  ok(log.filter((e) => e.ev === 'commit').length === 2, 'דוגמה 4: מספר commits ≠ 2');
  ok(log.findIndex((e) => e.ev === 'commit' && e.n === 1) < log.findIndex((e) => e.ev === 'open' && e.n === 2),
    'דוגמה 4: ה-batch השני נפתח לפני ה-commit הראשון');
}

// 5) meta בלי אכיפה — pushMeta אחרי ה-commit האחרון, בלי קילוף
{
  const { fs, log } = mkFs();
  const metaCalls = [];
  const pushMeta = async (m, dek) => { metaCalls.push({ m, dek }); log.push({ ev: 'meta' }); };
  await pushDiff(
    { sets: [{ col: 'families', id: 'f1', data: { a: 1 } }], deletes: [], meta: { seq: 12, receiptSeq: 7 } },
    null, new Map(), DB, scopedCol, fs, noEnc, pushMeta
  );
  ok(metaCalls.length === 1 && eq(metaCalls[0].m, { seq: 12, receiptSeq: 7 }) && metaCalls[0].dek === null,
    'דוגמה 5: pushMeta לא קיבל את ה-meta כלשונו + ה-dek');
  ok(log.findIndex((e) => e.ev === 'meta') > log.findIndex((e) => e.ev === 'commit'),
    'דוגמה 5: ה-meta נכתב לפני ה-commit האחרון');
}

// 6) meta עם אכיפה — stripAuditMeta מקלף את הלוג
{
  const { fs } = mkFs();
  const metaCalls = [];
  const sup = {
    enforceOn: true, keyedCols: [],
    docSkey: null,
    stripAuditMeta: (m) => ({ seq: m.seq }),
  };
  await pushDiff(
    { sets: [], deletes: [], meta: { seq: 12, auditlog: [{ op: 'x' }] } },
    null, new Map(), DB, scopedCol, fs, noEnc, async (m) => metaCalls.push(m), sup
  );
  ok(metaCalls.length === 1 && eq(metaCalls[0], { seq: 12 }), 'דוגמה 6: הלוג לא קולף מה-meta');
}

process.exit(f);
