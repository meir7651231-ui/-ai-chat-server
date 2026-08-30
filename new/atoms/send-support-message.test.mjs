import { sendSupportMessage as __pure_sendSupportMessage } from './send-support-message.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_send_support_message_T = {
  k1: "supportChats",
  k2: "messages",
  k3: "user",
  k4: 120,
};
const sendSupportMessage = (...a) => __pure_sendSupportMessage(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_send_support_message_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
const J = JSON.stringify;
const sanitize = (t) => (t ?? '').trim(); // שקע-חיטוי לבדיקה

const mkFs = () => {
  const db = { __db: true };
  const colRef = { __col: true };
  const docRef = { __doc: true };
  const sentinel = { __increment: true };
  const calls = { collection: [], addDoc: [], doc: [], setDoc: [], increment: [] };
  return {
    calls, colRef, docRef, sentinel, db,
    fs: {
      db,
      collection: (...a) => { calls.collection.push(a); return colRef; },
      addDoc: async (...a) => { calls.addDoc.push(a); },
      doc: (...a) => { calls.doc.push(a); return docRef; },
      setDoc: async (...a) => { calls.setDoc.push(a); },
      increment: (...a) => { calls.increment.push(a); return sentinel; },
    },
  };
};

// 1) טקסט מתאיין ⇒ אפס כתיבות
{
  const m = mkFs();
  const out = await sendSupportMessage('u1', {}, '   ', m.fs, sanitize);
  chk('1 ריק-אחרי-חיטוי: אפס addDoc/setDoc + undefined',
    out === undefined && m.calls.addDoc.length === 0 && m.calls.setDoc.length === 0);
}

// 2+3+4) שליחה מלאה
{
  const m = mkFs();
  await sendSupportMessage('u7', { email: 'a@b.c', orgName: 'קהילה' }, ' שלום ', m.fs, sanitize);
  chk('2 collection(db,supportChats,u7,messages) פעם אחת',
    m.calls.collection.length === 1 && m.calls.collection[0][0] === m.db &&
    J(m.calls.collection[0].slice(1)) === J(['supportChats', 'u7', 'messages']));
  const msg = m.calls.addDoc[0][1];
  chk('2 addDoc(colRef,{from:user,text מחוטא,at})',
    m.calls.addDoc.length === 1 && m.calls.addDoc[0][0] === m.colRef &&
    msg.from === 'user' && msg.text === 'שלום' && typeof msg.at === 'string');
  chk('3 doc(db,supportChats,u7)',
    m.calls.doc.length === 1 && m.calls.doc[0][0] === m.db &&
    J(m.calls.doc[0].slice(1)) === J(['supportChats', 'u7']));
  const [ref, metaDoc, opts] = m.calls.setDoc[0];
  chk('3 setDoc: מפתחות מדויקים + סנטינל-increment + merge',
    m.calls.setDoc.length === 1 && ref === m.docRef &&
    J(Object.keys(metaDoc)) === J(['email', 'orgName', 'lastText', 'lastAt', 'lastFrom', 'unreadAdmin']) &&
    metaDoc.email === 'a@b.c' && metaDoc.orgName === 'קהילה' &&
    metaDoc.lastText === 'שלום' && metaDoc.lastFrom === 'user' &&
    metaDoc.unreadAdmin === m.sentinel && J(m.calls.increment[0]) === J([1]) &&
    J(opts) === J({ merge: true }));
  chk('4 at===lastAt ו-ISO תקין',
    msg.at === metaDoc.lastAt && !Number.isNaN(Date.parse(msg.at)));
}

// 5) חיתוך-120: email-130 ⇒ 120 · text-150 מלא בהודעה, lastText 120
{
  const m = mkFs();
  const email130 = 'e'.repeat(130);
  const text150 = 'x'.repeat(150);
  await sendSupportMessage('u1', { email: email130 }, text150, m.fs, sanitize);
  const msg = m.calls.addDoc[0][1];
  const metaDoc = m.calls.setDoc[0][1];
  chk('5 email⇒120 · text מלא · lastText⇒120',
    metaDoc.email === 'e'.repeat(120) && msg.text.length === 150 && metaDoc.lastText === 'x'.repeat(120));
}

// 6) meta ריק ⇒ שדות ''
{
  const m = mkFs();
  await sendSupportMessage('u1', {}, 'הי', m.fs, sanitize);
  const metaDoc = m.calls.setDoc[0][1];
  chk('6 meta ריק ⇒ email/orgName ריקים', metaDoc.email === '' && metaDoc.orgName === '');
}

// 7) addDoc נדחה ⇒ מבעבע, setDoc לא נקרא
{
  const m = mkFs();
  m.fs.addDoc = async () => { throw new Error('offline'); };
  let bubbled = '';
  try { await sendSupportMessage('u1', {}, 'הי', m.fs, sanitize); } catch (e) { bubbled = e.message; }
  chk('7 שגיאה מבעבעת + אפס setDoc', bubbled === 'offline' && m.calls.setDoc.length === 0);
}

if (f) process.exit(1);
console.log('✓ send-support-message: 7 דוגמאות-חוזה (שקעי-fs + שקע-חיטוי) — ירוק');
