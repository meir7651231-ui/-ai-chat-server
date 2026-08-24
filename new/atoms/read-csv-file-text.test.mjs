import { readCsvFileText } from './read-csv-file-text.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// 1) עדות-צנרת: אותו buffer עובר למפענח, פעם אחת בדיוק
const B = new ArrayBuffer(4);
const decodeCalls = [];
const fakeDecode = (buf) => { decodeCalls.push(buf); return 'a,b\nc,d'; };
const out1 = await readCsvFileText({ arrayBuffer: async () => B }, fakeDecode);
chk('1 צנרת: תוצאה + מפענח נקרא פעם אחת עם B עצמו',
  out1 === 'a,b\nc,d' && decodeCalls.length === 1 && decodeCalls[0] === B);

// 2) מפענח אמיתי-מינימלי: הבייטים [104,105] ⇒ 'hi'
const bytes = new Uint8Array([104, 105]);
const out2 = await readCsvFileText(
  { arrayBuffer: async () => bytes.buffer },
  (buf) => new TextDecoder('utf-8').decode(buf),
);
chk("2 בייטים [104,105] ⇒ 'hi'", out2 === 'hi');

// 3) arrayBuffer שנדחה ⇒ מבעבע
let e3 = '';
try {
  await readCsvFileText({ arrayBuffer: async () => { throw new Error('קריאה נכשלה'); } }, fakeDecode);
} catch (e) { e3 = e.message; }
chk('3 דחיית arrayBuffer מבעבעת', e3 === 'קריאה נכשלה');

// 4) שגיאת-מפענח ⇒ מבעבעת
let e4 = '';
try {
  await readCsvFileText({ arrayBuffer: async () => B }, () => { throw new Error('קידוד זר'); });
} catch (e) { e4 = e.message; }
chk('4 שגיאת-מפענח מבעבעת', e4 === 'קידוד זר');

if (f) process.exit(1);
console.log('✓ read-csv-file-text: 4 דוגמאות-חוזה (צנרת-שקע + ביעבוע) — ירוק');
