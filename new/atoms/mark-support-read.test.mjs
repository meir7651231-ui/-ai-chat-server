import { markSupportRead } from './mark-support-read.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

const mkFs = (setDocImpl) => {
  const calls = { doc: [], setDoc: [] };
  const REF = { __ref: true };
  const fs = {
    db: { __db: true },
    doc: (...a) => { calls.doc.push(a); return REF; },
    setDoc: (...a) => { calls.setDoc.push(a); return setDocImpl ? setDocImpl() : Promise.resolve(); },
  };
  return { fs, calls, REF };
};

// 1) side='admin' ⇒ setDoc פעם אחת עם {unreadAdmin:0}
{
  const { fs, calls } = mkFs();
  await markSupportRead('u42', 'admin', fs);
  ok(calls.setDoc.length === 1, 'setDoc לא נקרא בדיוק פעם אחת (admin)');
  eq(calls.setDoc[0][1], { unreadAdmin: 0 }, 'נתון-admin שגוי');
}

// 2) side='user' ⇒ {unreadUser:0}
{
  const { fs, calls } = mkFs();
  await markSupportRead('u42', 'user', fs);
  eq(calls.setDoc[0][1], { unreadUser: 0 }, 'נתון-user שגוי');
}

// 3) doc נקרא פעם אחת עם (db,'supportChats','u42') ו-setDoc קיבל את ההפניה
{
  const { fs, calls, REF } = mkFs();
  await markSupportRead('u42', 'admin', fs);
  ok(calls.doc.length === 1, 'doc לא נקרא בדיוק פעם אחת');
  ok(calls.doc[0][0] === fs.db && calls.doc[0][1] === 'supportChats' && calls.doc[0][2] === 'u42',
    'ארגומנטי-doc שגויים ⇒ ' + JSON.stringify(calls.doc[0].slice(1)));
  ok(calls.setDoc[0][0] === REF, 'setDoc לא קיבל את הפניית-doc');
}

// 4) אופציית merge:true
{
  const { fs, calls } = mkFs();
  await markSupportRead('u1', 'user', fs);
  eq(calls.setDoc[0][2], { merge: true }, 'אופציית-merge שגויה');
}

// 5) setDoc שנדחה ⇒ נבלע, ההבטחה נפתרת undefined
{
  const { fs } = mkFs(() => Promise.reject(new Error('offline')));
  let threw = false, ret = 'X';
  try { ret = await markSupportRead('u1', 'admin', fs); } catch { threw = true; }
  ok(!threw, 'כשל-כתיבה בעבע החוצה במקום להיבלע');
  ok(ret === undefined, 'ערך-חזרה אחרי כשל אינו undefined');
}

// 6) ערך-חזרה בהצלחה = undefined
{
  const { fs } = mkFs();
  ok((await markSupportRead('u1', 'admin', fs)) === undefined, 'ערך-חזרה בהצלחה אינו undefined');
}

if (f) process.exit(1);
console.log('✓ mark-support-read: 6 דוגמאות-חוזה — ירוק');
