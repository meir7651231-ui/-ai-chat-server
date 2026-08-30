import { sendSupportReply as __pure_sendSupportReply } from './send-support-reply.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_send_support_reply_T = {
  k1: "messages",
  k2: "admin",
  k3: 120,
  tbl1: "supportChats",
};
const sendSupportReply = (...a) => __pure_sendSupportReply(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_send_support_reply_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
// זיוף-Firestore: מתעד קריאות + סדר; addDoc יכול להידחות לפי תסריט
const fake = (opts = {}) => {
  const calls = { addDoc: [], setDoc: [], collection: [], doc: [], increment: [], order: [] };
  const fs = {
    db: { __db: true },
    collection: (...args) => { calls.collection.push(args); return { __col: args }; },
    doc: (...args) => { calls.doc.push(args); return { __ref: args }; },
    addDoc: async (col, body) => {
      calls.order.push('addDoc');
      calls.addDoc.push({ col, body });
      if (opts.rejectAdd) throw new Error(opts.rejectAdd);
    },
    setDoc: async (ref, body, options) => {
      calls.order.push('setDoc');
      calls.setDoc.push({ ref, body, options });
    },
    increment: (n) => { calls.increment.push(n); return { __inc: n }; },
  };
  return { fs, calls };
};
// זיוף-sanitize כברירת-מחדל: מדמה את השכן (גזירת רווחי-קצה), רושם קריאות
const mkSanitize = () => {
  const raws = [];
  const sanitize = (raw) => { raws.push(raw); return (raw ?? '').trim(); };
  sanitize.raws = raws;
  return sanitize;
};

// 1) טקסט שנפסל בניקוי ⇒ יציאה שקטה, אפס קריאות-ענן
{
  const { fs, calls } = fake();
  const sanitize = mkSanitize();
  await sendSupportReply('u7', '   ', sanitize, fs);
  ok(sanitize.raws.length === 1 && sanitize.raws[0] === '   ', 'sanitize חייב להיקרא פעם אחת עם הטקסט הגולמי');
  ok(calls.addDoc.length === 0 && calls.setDoc.length === 0 && calls.increment.length === 0, 'טקסט ריק: נעשו קריאות-ענן למרות הפסילה');
}
// 2) הודעה תקינה — addDoc פעם אחת, from='admin', text מנוקה, at בתבנית-ISO
{
  const { fs, calls } = fake();
  await sendSupportReply('u7', ' שלום ', mkSanitize(), fs);
  ok(calls.addDoc.length === 1, 'addDoc לא נקרא פעם אחת');
  const colArgs = calls.addDoc[0].col.__col;
  ok(colArgs[0] === fs.db && colArgs[1] === 'supportChats' && colArgs[2] === 'u7' && colArgs[3] === 'messages', 'collection(db, supportChats, u7, messages) — חיווט שגוי');
  const body = calls.addDoc[0].body;
  ok(body.from === 'admin', "from חייב להיות 'admin' (צד-התמיכה)");
  ok(body.text === 'שלום', 'text חייב להיות המנוקה (פלט-sanitize)');
  ok(ISO_RE.test(body.at), 'at אינו בתבנית-ISO (בפועל: ' + body.at + ')');
}
// 3) מטא-השיחה — doc נכון, מפתחות מדויקים, סנטינל-increment, merge:true
{
  const { fs, calls } = fake();
  await sendSupportReply('u7', 'שלום', mkSanitize(), fs);
  ok(calls.setDoc.length === 1, 'setDoc לא נקרא פעם אחת');
  const refArgs = calls.setDoc[0].ref.__ref;
  ok(refArgs[0] === fs.db && refArgs[1] === 'supportChats' && refArgs[2] === 'u7', 'doc(db, supportChats, u7) — חיווט שגוי');
  const meta = calls.setDoc[0].body;
  ok(Object.keys(meta).sort().join(',') === 'lastAt,lastFrom,lastText,unreadUser', 'מפתחות-המטא חייבים להיות בדיוק lastText+lastAt+lastFrom+unreadUser');
  ok(meta.lastFrom === 'admin' && meta.lastText === 'שלום', 'lastFrom/lastText שגויים');
  ok(calls.increment.length === 1 && calls.increment[0] === 1, 'increment חייב להיקרא פעם אחת עם 1');
  ok(meta.unreadUser && meta.unreadUser.__inc === 1, 'unreadUser חייב להיות הסנטינל של increment(1), לא מספר');
  ok(calls.setDoc[0].options && calls.setDoc[0].options.merge === true, 'setDoc חייב לרוץ עם {merge:true}');
}
// 4) תקציר נגזם ל-120; ההודעה-עצמה נשארת מלאה
{
  const { fs, calls } = fake();
  const long = 'א'.repeat(150);
  await sendSupportReply('u7', long, mkSanitize(), fs);
  ok(calls.addDoc[0].body.text.length === 150, 'text בהודעה חייב להישאר מלא (150)');
  const lastText = calls.setDoc[0].body.lastText;
  ok(lastText.length === 120 && lastText === long.slice(0, 120), 'lastText חייב להיגזם ל-120 התווים הראשונים');
}
// 5) אותה חותמת-זמן לשתי הכתיבות
{
  const { fs, calls } = fake();
  await sendSupportReply('u7', 'שלום', mkSanitize(), fs);
  ok(calls.addDoc[0].body.at === calls.setDoc[0].body.lastAt, 'at של ההודעה חייב להיות זהה ל-lastAt של המטא (now אחד)');
}
// 6) סדר: addDoc לפני setDoc; דחיית-addDoc מבעבעת ו-setDoc לא נקרא
{
  const { fs, calls } = fake();
  await sendSupportReply('u7', 'שלום', mkSanitize(), fs);
  ok(calls.order.join(',') === 'addDoc,setDoc', 'הסדר חייב להיות addDoc ואז setDoc');
  const { fs: fs2, calls: calls2 } = fake({ rejectAdd: 'permission-denied' });
  let threw = null;
  try { await sendSupportReply('u7', 'שלום', mkSanitize(), fs2); } catch (e) { threw = e.message; }
  ok(threw === 'permission-denied', 'כשל-addDoc נבלע במקום להיזרק');
  ok(calls2.setDoc.length === 0, 'אחרי כשל-addDoc אסור ל-setDoc לרוץ');
}
if (f) process.exit(1);
console.log('✓ send-support-reply: 6 דוגמאות-חוזה — ירוק (זיוף-Firestore, אפס ענן)');
