import { writeCloudEnvelope } from './write-cloud-envelope.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const ref = { __ref: true };

// 1+2+3) נתיב + env כלשונו + סדר-await
{
  const env = { $enc: 2, wrapped: 'AAA=', salt: 'BBB=' };
  const docCalls = [];
  const setCalls = [];
  let setResolved = false;
  const fs = {
    doc: (...a) => { docCalls.push(a); return ref; },
    setDoc: (...a) => {
      setCalls.push(a);
      return new Promise((res) => setTimeout(() => { setResolved = true; res(); }, 10));
    },
  };
  const p = writeCloudEnvelope(env, db, () => 'orgs/demo/_enc/envelope', fs);
  const notEarly = !setResolved; // לפני-הפתרון — ההבטחה עוד תלויה
  await p;
  chk('1 נתיב: doc(db, scopedEnv()) + setDoc על ההפניה',
    docCalls.length === 1 && docCalls[0][0] === db && docCalls[0][1] === 'orgs/demo/_enc/envelope' &&
    setCalls.length === 1 && setCalls[0][0] === ref);
  chk('2 env נכתב כלשונו (אותה הפניה)', setCalls[0][1] === env);
  chk('3 נפתר רק אחרי setDoc', notEarly && setResolved);
}

// 4) setDoc דוחה ⇒ זריקה (לא בולעים — פעולת-בעלים)
{
  let threw = null;
  try {
    await writeCloudEnvelope({ $enc: 2 }, db, () => 'p', {
      doc: () => ref,
      setDoc: () => Promise.reject(new Error('permission-denied')),
    });
  } catch (e) { threw = e; }
  chk('4 כשל-כתיבה זורק', threw instanceof Error && threw.message === 'permission-denied');
}

if (f) process.exit(1);
console.log('✓ write-cloud-envelope: 4 דוגמאות-חוזה (נתיב+כלשונו+await+זריקה) — ירוק');
