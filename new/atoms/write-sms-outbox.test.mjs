import { writeSmsOutbox as __pure_writeSmsOutbox } from './write-sms-outbox.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_write_sms_outbox_T = {
  k1: "smsOutbox",
  k2: "pending",
};
const writeSmsOutbox = (...a) => __pure_writeSmsOutbox(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_write_sms_outbox_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const db = { __db: true };
const colRef = { __col: true };

// 1+2+3) נתיב + ארבעת-השדות + at=זמן-הכתיבה
{
  const scopedCalls = [];
  const colCalls = [];
  const addCalls = [];
  const fs = {
    collection: (...a) => { colCalls.push(a); return colRef; },
    addDoc: (...a) => { addCalls.push(a); return Promise.resolve({ id: 's1' }); },
  };
  const before = Date.now();
  await writeSmsOutbox('0501234567', 'תזכורת: חוג מחר ב-17:00', db,
    (c) => { scopedCalls.push(c); return 'orgs/demo/' + c; }, fs);
  const after = Date.now();

  chk('1 נתיב: scopedCol(smsOutbox) + collection + addDoc',
    scopedCalls.length === 1 && scopedCalls[0] === 'smsOutbox' &&
    colCalls.length === 1 && colCalls[0][0] === db && colCalls[0][1] === 'orgs/demo/smsOutbox' &&
    addCalls.length === 1 && addCalls[0][0] === colRef);

  const body = addCalls[0][1];
  chk('2 ארבעת-השדות + status=pending',
    body.to === '0501234567' && body.text === 'תזכורת: חוג מחר ב-17:00' &&
    body.status === 'pending' && Object.keys(body).length === 4);

  const at = Date.parse(body.at);
  chk('3 at = זמן-הכתיבה ISO', Number.isFinite(at) && at >= before - 1000 && at <= after + 1000);
}

// 4) addDoc דוחה ⇒ זריקה (כשל-רך = החלטת-הקורא)
{
  let threw = null;
  try {
    await writeSmsOutbox('0501234567', 'טקסט', db, (c) => c, {
      collection: () => colRef,
      addDoc: () => Promise.reject(new Error('permission-denied')),
    });
  } catch (e) { threw = e; }
  chk('4 כשל-הוספה זורק', threw instanceof Error && threw.message === 'permission-denied');
}

if (f) process.exit(1);
console.log('✓ write-sms-outbox: 4 דוגמאות-חוזה (נתיב+שדות+at+זריקה) — ירוק');
