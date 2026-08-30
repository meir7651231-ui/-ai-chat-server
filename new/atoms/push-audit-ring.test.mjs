import { pushAuditRing as __pure_pushAuditRing } from './push-audit-ring.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_push_audit_ring_T = {
  k1: "auditlog",
  tbl1: 500,
};
const pushAuditRing = (...a) => __pure_pushAuditRing(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_push_audit_ring_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// זיוף-Firestore: מתעד קריאות doc/setDoc; setDoc יכול להידחות לפי תסריט
const fake = (opts = {}) => {
  const calls = { doc: [], setDoc: [] };
  const fs = {
    doc: (...args) => { calls.doc.push(args); return { __ref: args }; },
    setDoc: async (ref, body) => {
      calls.setDoc.push({ ref, body });
      if (opts.reject) throw new Error(opts.reject);
    },
  };
  return { fs, calls };
};
const scopedCol = (c) => 'orgs/demo/' + c;
const DB = { __db: true };

// 1) uid ריק ⇒ יציאה שקטה, אפס קריאות
{
  const { fs, calls } = fake();
  let enc = 0;
  await pushAuditRing([{ at: '2026-08-01', op: 'א' }], null, '', DB, scopedCol, fs, async () => { enc++; });
  ok(calls.doc.length === 0 && calls.setDoc.length === 0 && enc === 0, 'uid ריק: נעשו קריאות למרות אי-חיבור');
}
// 2) דחיפה רגילה בלי dek — נתיב סקופי + גוף plaintext כסדרו
{
  const { fs, calls } = fake();
  const entries = [{ at: '2026-08-01', op: 'א' }, { at: '2026-08-02', op: 'ב' }];
  await pushAuditRing(entries, null, 'u1', DB, scopedCol, fs, null);
  ok(calls.doc.length === 1, 'doc לא נקרא פעם אחת');
  const [db, col, uid] = calls.doc[0];
  ok(db === DB && col === 'orgs/demo/auditlog' && uid === 'u1', 'doc(db, orgs/demo/auditlog, u1) — חיווט שגוי');
  ok(calls.setDoc.length === 1, 'setDoc לא נקרא פעם אחת');
  const body = calls.setDoc[0].body;
  ok(Array.isArray(body.entries) && body.entries.length === 2 && body.entries[0].op === 'א' && body.entries[1].op === 'ב', 'גוף-המסמך אינו {entries:[שתיהן כסדרן]}');
}
// 3) תקרת-הטבעת: 502 ⇒ בדיוק 500 האחרונות
{
  const { fs, calls } = fake();
  const entries = Array.from({ length: 502 }, (_, i) => ({ at: 'a', n: i + 1 }));
  await pushAuditRing(entries, null, 'u1', DB, scopedCol, fs, null);
  const ring = calls.setDoc[0].body.entries;
  ok(ring.length === 500, 'הטבעת לא נגזמה ל-500 (בפועל ' + ring.length + ')');
  ok(ring[0].n === 3 && ring[499].n === 502, 'נגזמו הלא-נכונות: הראשונה בגוף חייבת להיות רשומה #3');
}
// 4) dek ⇒ encryptDoc על הטבעת-הגזומה, והמעטפה היא מה שנכתב
{
  const { fs, calls } = fake();
  const encCalls = [];
  const encryptDoc = async (body, dek) => { encCalls.push({ body, dek }); return { __enc: true, of: body }; };
  const entries = [{ at: '2026-08-03', op: 'ג' }];
  await pushAuditRing(entries, 'DEK', 'u1', DB, scopedCol, fs, encryptDoc);
  ok(encCalls.length === 1 && encCalls[0].dek === 'DEK', 'encryptDoc לא נקרא עם ה-dek');
  ok(encCalls[0].body.entries.length === 1 && encCalls[0].body.entries[0].op === 'ג', 'encryptDoc לא קיבל את {entries:הטבעת}');
  ok(calls.setDoc[0].body.__enc === true && calls.setDoc[0].body.of === encCalls[0].body, 'setDoc לא כתב את המעטפה שהחזיר encryptDoc');
}
// 5) setDoc דוחה ⇒ זריקה (לא נבלעת)
{
  const { fs } = fake({ reject: 'permission-denied' });
  let threw = null;
  try { await pushAuditRing([{ at: 'a' }], null, 'u1', DB, scopedCol, fs, null); }
  catch (e) { threw = e.message; }
  ok(threw === 'permission-denied', 'כשל-setDoc נבלע במקום להיזרק');
}
if (f) process.exit(1);
console.log('✓ push-audit-ring: 5 דוגמאות-חוזה — ירוק (זיוף-Firestore, אפס ענן)');
