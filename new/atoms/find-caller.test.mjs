import { findCaller } from './find-caller.mjs';
let f = 0;
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// phoneKey-מזויף לפי חוזה החוט המשותף: ספרות בלבד, ניכוי 00/972 ואפסים מובילים
const phoneKey = (raw) => {
  let d = (raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('972')) d = d.slice(3);
  return d.replace(/^0+/, '');
};

const db = {
  families: [
    { id: 'f1', name: 'כהן', phone: '0501234567', phone2: '' },
    { id: 'f2', name: 'לוי', phone: '0468880009', members: [{ id: 'm1', first: 'דוד', phone: '0529990001' }] },
  ],
  supporters: [
    { id: 's0', name: 'כפול', phone: '0501234567' }, // אותו מספר כמו f1 — למבחן-העדיפות
    { id: 's1', name: 'רוזן', phone: '0537770002' },
  ],
  volunteers: [{ id: 'v1', name: 'גל', phone: '0546660003' }],
  tzCoordinators: [{ id: 'c1', name: 'רות', phone: '0585550004' }],
};

// 1) משפחה — נרמול בינ"ל
eq(findCaller(db, '+972 50-123-4567', phoneKey),
  { kind: 'family', name: 'כהן', phone: '0501234567', id: 'f1', view: 'families', famId: 'f1' }, 'התאמת-משפחה שגויה');

// 2) בן-משפחה — name = first · שם-המשפחה
eq(findCaller(db, '052-999-0001', phoneKey),
  { kind: 'member', name: 'דוד · לוי', phone: '0529990001', id: 'm1', view: 'families', famId: 'f2' }, 'התאמת-בן-משפחה שגויה');

// 3) עדיפות: משפחה לפני תורם באותו מספר
if (findCaller(db, '0501234567', phoneKey)?.kind !== 'family') { console.error('✗ העדיפות משפחה-לפני-תורם נשברה'); f = 1; }

// 4) תורם ⇒ supporters, בלי famId
eq(findCaller(db, '0537770002', phoneKey),
  { kind: 'supporter', name: 'רוזן', phone: '0537770002', id: 's1', view: 'supporters' }, 'התאמת-תורם שגויה');

// 5) מתנדב ⇒ shop7 · רכז ⇒ tzedaka
if (findCaller(db, '0546660003', phoneKey)?.view !== 'shop7') { console.error('✗ מתנדב לא ניתב ל-shop7'); f = 1; }
if (findCaller(db, '0585550004', phoneKey)?.view !== 'tzedaka') { console.error('✗ רכז לא ניתב ל-tzedaka'); f = 1; }

// 6) מפתח קצר (<6) ⇒ null
const dbShort = { families: [{ id: 'f9', name: 'קצר', phone: '12345' }], supporters: [] };
eq(findCaller(dbShort, '12345', phoneKey), null, 'מספר-קצר לא החזיר null');

// 7) בלי volunteers/tzCoordinators + לא-מוכר ⇒ null בלי קריסה
eq(findCaller({ families: [], supporters: [] }, '0500000009', phoneKey), null, 'מערכים-חסרים הפילו/החזירו-ערך');

if (f) process.exit(1);
console.log('✓ find-caller: 7 דוגמאות-חוזה — ירוק');
