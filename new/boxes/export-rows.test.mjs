/** בדיקת-קצה: קופסת שורות-הייצוא — דרך הקופסה בלבד. מוכיחה את דוגמאות-החוזה. */
import assert from 'node:assert';
import { familiesImportFormatRows, supportersImportFormatRows, eventsCsvRows } from './export-rows.mjs';

let f = 0;
const t = (name, fn) => { try { fn(); } catch (e) { console.error(`✗ ${name}: ${e.message}`); f = 1; } };

// ── משפחות · 13 עמודות + דין-אלמן (exportRows.ts:33-44) ──
t('משפחות: כותרת + דין-אלמן (נו״ן-סופית)', () => {
  const rows = familiesImportFormatRows({ families: [
    { name: 'כהן', fatherId: '1', phone: '050', mother: 'שרה', motherId: '2', phone2: '02', city: 'צפת', address: 'רח 1', maritalStatus: 'אלמן', community: 'חסידי', notes: 'הערה' },
    { name: 'לוי', maritalStatus: 'אלמנה' },
    { name: 'פרץ' },
  ] });
  assert.deepStrictEqual(rows[0], ['שם', 'ת"ז אב', 'טלפון', 'שם האם', 'ת"ז אם', 'טלפון 2', 'עיר', 'כתובת', '', 'אלמן', 'קהילה', '', 'הערות']);
  assert.strictEqual(rows[1][9], 'אלמן');
  assert.strictEqual(rows[2][9], ''); // ⚠️ המקור: includes('אלמן') בנו״ן-סופית — 'אלמנה' לא נתפס (נשמר כלשונו)
  assert.strictEqual(rows[3][9], ''); // maritalStatus חסר ⇒ (|| '')
  assert.strictEqual(rows.length, 4);
});

// ── תומכות · 7 עמודות (exportRows.ts:47-53) ──
t('תומכות: כותרת + סדר-שדות', () => {
  const rows = supportersImportFormatRows({ supporters: [
    { name: 'רוזן', phone: '054', email: 'a@b', idNum: '9', address: 'תל חי', cat: 'קבע', forWho: 'עילוי' },
  ] });
  assert.deepStrictEqual(rows[0], ['שם', 'טלפון', 'אימייל', 'ת"ז', 'כתובת', 'קטגוריה', 'עבור']);
  assert.deepStrictEqual(rows[1], ['רוזן', '054', 'a@b', '9', 'תל חי', 'קבע', 'עילוי']);
});

// ── אירועים · 9 עמודות, מיון, עברי/לועזי, עדיפות, termOf (exportRows.ts:56-76) ──
const db = {
  families: [{ id: 'f1', name: 'כהן' }],
  events: [
    { title: 'ב', type: 'call', date: '2026-08-24', time: '10:00', famId: 'f1', priority: 'red', notes: 'נ', done: true },
    { title: 'א', type: 'custom', customType: 'ברית', date: '', famId: 'zz', priority: 'x', done: false },
  ],
};
t('אירועים: בלי config — כותרת "משפחה" + כל התאים', () => {
  const rows = eventsCsvRows(db);
  assert.deepStrictEqual(rows[0], ['כותרת', 'סוג אירוע', 'תאריך עברי', 'תאריך לועזי', 'שעה', 'משפחה', 'עדיפות', 'הערות', 'בוצע']);
  // מיון: date='' ראשון (localeCompare עולה)
  assert.deepStrictEqual(rows[1], ['א', 'ברית', '', '', '', '', 'x', '', 'לא']);
  assert.deepStrictEqual(rows[2], ['ב', 'טלפון', 'י״א אלול תשפ״ו', '24/08/2026', '10:00', 'כהן', 'דחוף (אדום)', 'נ', 'כן']);
});
t('אירועים: termOf דורס את הכותרת', () => {
  assert.strictEqual(eventsCsvRows(db, { terms: { 'entity.family': 'בית אב' } })[0][5], 'בית אב');
  assert.strictEqual(eventsCsvRows(db, { terms: { 'entity.family': '  ' } })[0][5], 'משפחה'); // דריסת-רווחים = אין דריסה
});
t('אירועים: אדר תשפ״ו', () => {
  const rows = eventsCsvRows({ families: [], events: [{ title: 'פ', type: 'org', date: '2026-03-03', priority: 'green', done: false }] });
  assert.strictEqual(rows[1][2], 'י״ד אדר תשפ״ו');
  assert.strictEqual(rows[1][1], 'אירוע');
  assert.strictEqual(rows[1][6], 'רגיל (ירוק)');
});

/* 🛡 מגן-הכרעה: החיווט חתום verbatim בקובץ-הקופסה (דפוס theme.test). */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./export-rows.mjs', import.meta.url), 'utf8');
for (const dec of [
  'hebDateFull(iso, gem, (y) => gemYear(y, gem), hebParts)', // הכרעה 1: שרשרת-התאריך-העברי
  'eventsCsvRowsWire(db, config, termOf, hebFull, EV_META)', // הכרעות 2-3: מילון-הסוגים + termOf, סדר-שקעים כבמקור
  "from '../atoms/ev-meta.mjs'", // מילון-התוויות = האטום, לא עותק מקומי
]) {
  if (!src.includes(dec)) { console.error(`✗ מגן-הכרעה: חסר בקופסה: ${dec}`); f = 1; }
}
if (/from\s+'(?!\.\.\/atoms\/|node:)/.test(src)) { console.error('✗ מגן: הקופסה מייבאת שלא מ-atoms'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת שורות-הייצוא: משפחות 13ע · תומכות 7ע · אירועים 9ע (מיון/עברי/termOf) + מגן-הכרעה — ירוק');
