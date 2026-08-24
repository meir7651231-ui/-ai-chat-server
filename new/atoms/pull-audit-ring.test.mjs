import { pullAuditRing } from './pull-audit-ring.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// זיוף-Firestore: docs = [{id, data:()=>...}]; מתעד קריאות collection/getDocs
const fake = (docs, opts = {}) => {
  const calls = { collection: [], getDocs: 0 };
  const fs = {
    collection: (...args) => { calls.collection.push(args); return { __col: args }; },
    getDocs: async () => {
      calls.getDocs++;
      if (opts.reject) throw new Error(opts.reject);
      return { docs };
    },
  };
  return { fs, calls };
};
const scopedCol = (c) => 'orgs/demo/' + c;
const DB = { __db: true };
const d = (id, data) => ({ id, data: () => data });

// 1) עובד/ת (canRead=false) ⇒ null, אפס קריאות
{
  const { fs, calls } = fake([d('u1', { entries: [{ at: 'a' }] })]);
  let dec = 0;
  const r = await pullAuditRing(null, false, DB, scopedCol, fs, async () => { dec++; });
  ok(r === null, 'canRead=false לא החזיר null');
  ok(calls.collection.length === 0 && calls.getDocs === 0 && dec === 0, 'canRead=false: נעשו קריאות-ענן');
}
// 2) מיזוג חוצה-מסמכים + מיון עולה לפי at + חיווט-הנתיב
{
  const { fs, calls } = fake([
    d('u1', { entries: [{ at: '2026-08-03', op: 'ג' }, { at: '2026-08-01', op: 'א' }] }),
    d('u2', { entries: [{ at: '2026-08-02', op: 'ב' }] }),
  ]);
  const r = await pullAuditRing(null, true, DB, scopedCol, fs, null);
  ok(r.length === 3 && r[0].op === 'א' && r[1].op === 'ב' && r[2].op === 'ג', 'המיזוג/המיון שגוי: ' + JSON.stringify(r.map((x) => x.op)));
  ok(calls.collection.length === 1 && calls.collection[0][0] === DB && calls.collection[0][1] === 'orgs/demo/auditlog', 'collection(db, orgs/demo/auditlog) — חיווט שגוי');
}
// 3) מסמך בלי entries-מערך ⇒ מדולג בשקט
{
  const { fs } = fake([
    d('u1', { entries: 'זבל' }),
    d('u2', {}),
    d('u3', { entries: [{ at: '2026-08-05', op: 'ה' }] }),
  ]);
  const r = await pullAuditRing(null, true, DB, scopedCol, fs, null);
  ok(r.length === 1 && r[0].op === 'ה', 'מסמך-פגום לא דולג בשקט');
}
// 4) אוסף-ריק ⇒ [] (לא null)
{
  const { fs } = fake([]);
  const r = await pullAuditRing(null, true, DB, scopedCol, fs, null);
  ok(Array.isArray(r) && r.length === 0, 'אוסף-ריק לא החזיר []');
}
// 5) dek ⇒ decryptDoc פר-מסמך, ה-entries מהפלט-המפוענח
{
  const raw1 = { __enc: 1 }; const raw2 = { __enc: 2 };
  const { fs } = fake([d('u1', raw1), d('u2', raw2)]);
  const decCalls = [];
  const decryptDoc = async (data, dek) => {
    decCalls.push({ data, dek });
    return data === raw1 ? { entries: [{ at: '2026-08-02', op: 'ב' }] } : { entries: [{ at: '2026-08-01', op: 'א' }] };
  };
  const r = await pullAuditRing('DEK', true, DB, scopedCol, fs, decryptDoc);
  ok(decCalls.length === 2 && decCalls[0].data === raw1 && decCalls[0].dek === 'DEK' && decCalls[1].data === raw2, 'decryptDoc לא נקרא פר-מסמך עם ה-dek');
  ok(r.length === 2 && r[0].op === 'א' && r[1].op === 'ב', 'ה-entries לא נאספו מהפלט-המפוענח');
}
// 6) תקרה: 501 ממוזגות ⇒ 500 האחרונות לפי המיון
{
  const mk = (n) => ({ at: String(n).padStart(4, '0'), n });
  const docA = d('u1', { entries: Array.from({ length: 251 }, (_, i) => mk(i + 1)) });
  const docB = d('u2', { entries: Array.from({ length: 250 }, (_, i) => mk(i + 252)) });
  const { fs } = fake([docA, docB]);
  const r = await pullAuditRing(null, true, DB, scopedCol, fs, null);
  ok(r.length === 500, 'לא נגזם ל-500 (בפועל ' + r.length + ')');
  ok(r[0].n === 2 && r[499].n === 501, 'נדחקה הלא-נכונה: הוותיקה-ביותר (n=1) חייבת להידחק');
}
// 7) getDocs דוחה ⇒ זריקה
{
  const { fs } = fake([], { reject: 'net-down' });
  let threw = null;
  try { await pullAuditRing(null, true, DB, scopedCol, fs, null); }
  catch (e) { threw = e.message; }
  ok(threw === 'net-down', 'כשל-getDocs נבלע במקום להיזרק');
}
if (f) process.exit(1);
console.log('✓ pull-audit-ring: 7 דוגמאות-חוזה — ירוק (זיוף-Firestore, אפס ענן)');
