import { sendTeamMessage } from './send-team-message.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
const fake = (opts = {}) => {
  const calls = { addDoc: [], collection: [] };
  const fs = {
    db: { __db: true },
    collection: (...args) => { calls.collection.push(args); return { __col: args }; },
    addDoc: async (col, body) => {
      calls.addDoc.push({ col, body });
      if (opts.reject) throw new Error(opts.reject);
    },
  };
  return { fs, calls };
};
const mkSanitize = () => {
  const raws = [];
  const sanitize = (raw) => { raws.push(raw); return (raw ?? '').trim(); };
  sanitize.raws = raws;
  return sanitize;
};

// 1) טקסט שנפסל בניקוי ⇒ יציאה שקטה
{
  const { fs, calls } = fake();
  const sanitize = mkSanitize();
  await sendTeamMessage('kehila', 'a@b.c', 'ענת', '  ', sanitize, fs);
  ok(sanitize.raws.length === 1 && sanitize.raws[0] === '  ', 'sanitize חייב להיקרא פעם אחת עם הגולמי');
  ok(calls.addDoc.length === 0, 'טקסט ריק: addDoc נקרא למרות הפסילה');
}
// 2) הודעה תקינה — חיווט + גוף מדויקים
{
  const { fs, calls } = fake();
  await sendTeamMessage('kehila', 'anat@org.il', 'ענת', ' בוקר טוב ', mkSanitize(), fs);
  ok(calls.addDoc.length === 1, 'addDoc לא נקרא פעם אחת');
  const colArgs = calls.addDoc[0].col.__col;
  ok(colArgs[0] === fs.db && colArgs[1] === 'teamChats' && colArgs[2] === 'kehila' && colArgs[3] === 'messages', 'collection(db, teamChats, kehila, messages) — חיווט שגוי');
  const body = calls.addDoc[0].body;
  ok(Object.keys(body).sort().join(',') === 'at,name,sender,text', 'מפתחות-הגוף חייבים להיות בדיוק sender+name+text+at');
  ok(body.sender === 'anat@org.il' && body.name === 'ענת', 'sender/name שגויים');
  ok(body.text === 'בוקר טוב', 'text חייב להיות המנוקה (פלט-sanitize)');
  ok(ISO_RE.test(body.at), 'at אינו בתבנית-ISO (בפועל: ' + body.at + ')');
}
// 3) תקרות-גודל: sender⇒120, name⇒60
{
  const { fs, calls } = fake();
  const sender = 's'.repeat(130);
  const name = 'נ'.repeat(70);
  await sendTeamMessage('kehila', sender, name, 'היי', mkSanitize(), fs);
  const body = calls.addDoc[0].body;
  ok(body.sender.length === 120 && body.sender === sender.slice(0, 120), 'sender חייב להיגזם ל-120 הראשונים');
  ok(body.name.length === 60 && body.name === name.slice(0, 60), 'name חייב להיגזם ל-60 הראשונים');
}
// 4) sender=null / name=undefined ⇒ '' (אין קריסה, אין שדה חסר)
{
  const { fs, calls } = fake();
  await sendTeamMessage('kehila', null, undefined, 'היי', mkSanitize(), fs);
  const body = calls.addDoc[0].body;
  ok(body.sender === '' && body.name === '', "sender/name חסרים חייבים להפוך ל-''");
}
// 5) דחיית-addDoc מבעבעת
{
  const { fs } = fake({ reject: 'offline' });
  let threw = null;
  try { await sendTeamMessage('kehila', 'a@b.c', 'ענת', 'היי', mkSanitize(), fs); }
  catch (e) { threw = e.message; }
  ok(threw === 'offline', 'כשל-addDoc נבלע במקום להיזרק');
}
if (f) process.exit(1);
console.log('✓ send-team-message: 5 דוגמאות-חוזה — ירוק (זיוף-Firestore, אפס ענן)');
