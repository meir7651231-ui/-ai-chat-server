import { readCloudEnvelope } from './read-cloud-envelope.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

const DB = { tag: 'db' };
const scopedEnv = () => 'orgs/demo/_enc/envelope';

// זיוף-Firestore: doc מחזיר אסימון-הפניה, getDoc מחזיר snap לפי תסריט
const mkFs = (snapOrThrow) => {
  const calls = { doc: [], getDoc: [] };
  const fs = {
    doc: (db, path) => { calls.doc.push({ db, path }); return { ref: path }; },
    getDoc: async (ref) => {
      calls.getDoc.push(ref);
      if (snapOrThrow instanceof Error) throw snapOrThrow;
      return snapOrThrow;
    },
  };
  return { fs, calls };
};
const snapOf = (exists, data) => ({ exists: () => exists, data: () => data });

// 1) עדות-נתיב: doc(db, scopedEnv()) ו-getDoc עם ההפניה שהוחזרה
{
  const { fs, calls } = mkFs(snapOf(false));
  await readCloudEnvelope(DB, scopedEnv, fs);
  ok(calls.doc.length === 1 && calls.doc[0].db === DB && calls.doc[0].path === 'orgs/demo/_enc/envelope',
    'דוגמה 1: doc לא נקרא עם (db, הנתיב-הסקופי)');
  ok(calls.getDoc.length === 1 && calls.getDoc[0].ref === 'orgs/demo/_enc/envelope',
    'דוגמה 1: getDoc לא קיבל את הפניית-doc');
}

// 2) המסמך לא קיים ⇒ null
{
  const { fs } = mkFs(snapOf(false));
  ok((await readCloudEnvelope(DB, scopedEnv, fs)) === null, 'דוגמה 2: לא-קיים ≠ null');
}

// 3) מעטפה תקינה ($enc===2) ⇒ מוחזרת עצמה
{
  const env = { $enc: 2, wrapPin: 'W1', salt: 'S' };
  const { fs } = mkFs(snapOf(true, env));
  ok((await readCloudEnvelope(DB, scopedEnv, fs)) === env, 'דוגמה 3: מעטפה תקינה לא הוחזרה כמות-שהיא');
}

// 4) פורמט זר ($enc===1) ⇒ null
{
  const { fs } = mkFs(snapOf(true, { $enc: 1, wrap: 'X' }));
  ok((await readCloudEnvelope(DB, scopedEnv, fs)) === null, 'דוגמה 4: פורמט זר לא נדחה');
}

// 5) data() לא-אובייקט ⇒ null
{
  const { fs } = mkFs(snapOf(true, null));
  ok((await readCloudEnvelope(DB, scopedEnv, fs)) === null, 'דוגמה 5: data()=null לא הוחזר null');
}

// 6) getDoc זורק ⇒ null (failure-safe, לא מחלחל)
{
  const { fs } = mkFs(new Error('permission-denied'));
  let out;
  try { out = await readCloudEnvelope(DB, scopedEnv, fs); }
  catch { ok(false, 'דוגמה 6: השגיאה חלחלה במקום null'); }
  ok(out === null, 'דוגמה 6: כשל-ענן ≠ null');
}

process.exit(f);
