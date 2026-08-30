import { readFileAsDataUrl as __pure_readFileAsDataUrl, MAX_EMBED_BYTES } from './read-file-as-data-url.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_read_file_as_data_url_T = {
  k1: "הקובץ גדול מדי להטמעה (מקסימום ",
  k2: "MB) — הוסיפו קישור במקום",
};
const readFileAsDataUrl = (...a) => __pure_readFileAsDataUrl(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_read_file_as_data_url_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

chk('קבוע: MAX_EMBED_BYTES=3145728', MAX_EMBED_BYTES === 3145728);

// 1) מעל התקרה (ברירת-מחדל) ⇒ זריקה, השקע לא נקרא
let calls1 = 0;
let e1 = '';
try {
  await readFileAsDataUrl({ size: 3145729 }, async () => { calls1++; return 'x'; });
} catch (e) { e1 = e.message; }
chk('1 ‏3MB+1 ⇒ זריקה עברית והשקע לא נקרא',
  e1 === 'הקובץ גדול מדי להטמעה (מקסימום 3MB) — הוסיפו קישור במקום' && calls1 === 0);

// 2) בדיוק התקרה ⇒ עובר, השקע נקרא פעם אחת עם הקובץ עצמו
const file2 = { size: 3145728 };
const calls2 = [];
const out2 = await readFileAsDataUrl(file2, async (x) => { calls2.push(x); return 'data:application/pdf;base64,AA=='; });
chk('2 בדיוק התקרה ⇒ תוצאת-השקע',
  out2 === 'data:application/pdf;base64,AA==' && calls2.length === 1 && calls2[0] === file2);

// 3) maxBytes מותאם ⇒ ההודעה נגזרת מהתקרה
let e3 = '';
try {
  await readFileAsDataUrl({ size: 2000000 }, async () => 'x', 1048576);
} catch (e) { e3 = e.message; }
chk("3 ‏maxBytes=1MB ⇒ 'מקסימום 1MB'",
  e3 === 'הקובץ גדול מדי להטמעה (מקסימום 1MB) — הוסיפו קישור במקום');

// 4) עיגול: 2.5MB ⇒ 'מקסימום 3MB'
let e4 = '';
try {
  await readFileAsDataUrl({ size: 3000000 }, async () => 'x', 2621440);
} catch (e) { e4 = e.message; }
chk("4 ‏2.5MB מתעגל ל-'מקסימום 3MB'",
  e4 === 'הקובץ גדול מדי להטמעה (מקסימום 3MB) — הוסיפו קישור במקום');

// 5) דחיית-השקע מבעבעת
let e5 = '';
try {
  await readFileAsDataUrl({ size: 10 }, async () => { throw new Error('קריאת הקובץ נכשלה'); });
} catch (e) { e5 = e.message; }
chk('5 דחיית-השקע מבעבעת', e5 === 'קריאת הקובץ נכשלה');

if (f) process.exit(1);
console.log('✓ read-file-as-data-url: 5 דוגמאות-חוזה (שער-גודל + שקע-קורא) — ירוק');
