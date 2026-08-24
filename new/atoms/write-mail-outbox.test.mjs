import { writeMailOutbox } from './write-mail-outbox.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const colRef = { __col: true };

// 1+2+3) נתיב + חמשת-השדות + at=זמן-הכתיבה
{
  const scopedCalls = [];
  const colCalls = [];
  const addCalls = [];
  const fs = {
    collection: (...a) => { colCalls.push(a); return colRef; },
    addDoc: (...a) => { addCalls.push(a); return Promise.resolve({ id: 'm1' }); },
  };
  const before = Date.now();
  await writeMailOutbox('a@b.com', 'קבלה R-123', 'תודה על תרומתך', db,
    (c) => { scopedCalls.push(c); return 'orgs/demo/' + c; }, fs);
  const after = Date.now();

  chk('1 נתיב: scopedCol(mailOutbox) + collection + addDoc',
    scopedCalls.length === 1 && scopedCalls[0] === 'mailOutbox' &&
    colCalls.length === 1 && colCalls[0][0] === db && colCalls[0][1] === 'orgs/demo/mailOutbox' &&
    addCalls.length === 1 && addCalls[0][0] === colRef);

  const body = addCalls[0][1];
  chk('2 חמשת-השדות + status=pending',
    body.to === 'a@b.com' && body.subject === 'קבלה R-123' && body.text === 'תודה על תרומתך' &&
    body.status === 'pending' && Object.keys(body).length === 5);

  const at = Date.parse(body.at);
  chk('3 at = זמן-הכתיבה ISO', Number.isFinite(at) && at >= before - 1000 && at <= after + 1000);
}

// 4) addDoc דוחה ⇒ זריקה (כשל-רך = החלטת-הקורא)
{
  let threw = null;
  try {
    await writeMailOutbox('a@b.com', 'נושא', 'גוף', db, (c) => c, {
      collection: () => colRef,
      addDoc: () => Promise.reject(new Error('permission-denied')),
    });
  } catch (e) { threw = e; }
  chk('4 כשל-הוספה זורק', threw instanceof Error && threw.message === 'permission-denied');
}

if (f) process.exit(1);
console.log('✓ write-mail-outbox: 4 דוגמאות-חוזה (נתיב+שדות+at+זריקה) — ירוק');
