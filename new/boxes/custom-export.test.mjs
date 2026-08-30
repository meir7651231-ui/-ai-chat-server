/** בדיקת-קצה · קופסת "דו"ח מותאם" — מוכיחה את דוגמאות-החוזה (custom-export.contract.md)
 *  דרך הקופסה בלבד. DoD: node custom-export.test.mjs ⇒ exit 0. */
import { expFieldDefs, overrideColumn, buildCustomExport } from './custom-export.mjs';
const CUSTOM_EXPORT_TERMS = {
  k1: "memorial",
  k2: "anniversary",
  k3: "bday",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
let f = 0;
const bad = (m) => { console.error('✗ ' + m); f = 1; };
const cfg = { terms: {}, modules: {}, features: {} };

// ── דוגמה 1: הגדרות-שדות לחוגים — מלא (חסר=פעיל) 14, מקוצר 7 ──
const full = expFieldDefs(cfg, 'courses');
if (full.length !== 14) bad('חוגים-מלא: ' + full.length + ' ≠ 14');
if (full[0].key !== 'name' || full[0].label !== 'שם החוג') bad('חוגים-מלא ראשון: ' + JSON.stringify(full[0]));
const brief = expFieldDefs({ ...cfg, features: { 'reports.custom.full': false } }, 'courses');
if (brief.length !== 7) bad('חוגים-מקוצר: ' + brief.length + ' ≠ 7');
if (expFieldDefs(cfg, 'events').length !== 8) bad('אירועים ≠ 8 שדות');

// ── דוגמה 2: תומכות — עם עין 17, בלי עין 11 (אין stage/names/…) ──
const supDefs = expFieldDefs(cfg, 'supporters');
if (supDefs.length !== 17) bad('תומכות-עם-עין: ' + supDefs.length + ' ≠ 17');
const noAyin = expFieldDefs({ ...cfg, features: { 'supporters.ayin': false } }, 'supporters');
if (noAyin.length !== 11) bad('תומכות-בלי-עין: ' + noAyin.length + ' ≠ 11');
if (noAyin.some((d) => ['stage', 'names', 'eyesTotal', 'paid', 'answers', 'next'].includes(d.key))) bad('שדות-עין דלפו כשהעין כבויה');
// כיבוי מודול-האב supporters מכבה גם את תת-הדגל (NAV_MODULE_KEYS)
const modOff = expFieldDefs({ ...cfg, modules: { supporters: false } }, 'supporters');
if (modOff.length !== 11) bad('מודול-כבוי לא כיבה את העין: ' + modOff.length);

// ── חוגים: שורת-נתונים מלאה דרך הקופסה ──
const db = {
  families: [{ id: 'f1', name: 'כהן', phone: '02-000', members: [{ id: 'm1', first: 'רות', phone: '' }] }],
  rooms: [{ id: 'r1', name: 'אולם' }],
  teachers: [{ id: 't1', name: 'שרה', phone: '050' }],
  courses: [{ id: 'c1', name: 'ציור', teacherId: 't1', roomId: 'r1', weekday: 2, time: '16:00', model: 'punch', price: 120, maxStudents: 10, notes: '' }],
  enrollments: [{ id: 'e1', courseId: 'c1', memberId: 'm1', payments: [{ date: '2025-01-05', amount: 100 }], absences: [{ date: '2025-01-12' }], totalDue: 400 }],
  events: [{ id: 'v1', type: CUSTOM_EXPORT_TERMS.k1, title: 'אזכרה לסבא', date: '2024-03-24', time: '', famId: 'f1', notes: '', done: false }],
  supporters: [],
  usdRate: 3.7,
};
const jan = { from: '2025-01-01', to: '2025-01-31' };
const cr = buildCustomExport(cfg, db, 'courses', jan, ['name', 'teacher', 'schedule', 'occ', 'students', 'pays', 'abs']);
if (cr.length !== 2) bad('חוגים: ' + cr.length + ' שורות ≠ 2');
const want = ['ציור', 'שרה 050', 'יום שלישי 16:00', '1/10', 'רות', '1 תשלומים · ₪100', '1 חיסורים'];
if (JSON.stringify(cr[1]) !== JSON.stringify(want)) bad('שורת-חוג: ' + JSON.stringify(cr[1]));

// ── דוגמה 3: אזכרה עברית-חוזרת — דין-אדר + חסם-רפאים ──
const ev = buildCustomExport(cfg, db, 'events', { from: '2025-03-01', to: '2025-03-31' }, ['title', 'type', 'hdate', 'gdate', 'fam', 'done']);
if (ev.length !== 2) bad('אזכרה: ' + ev.length + ' שורות ≠ 2 (דין-אדר: אדר-ב⇒אדר)');
else if (JSON.stringify(ev[1]) !== JSON.stringify(['אזכרה לסבא', 'אזכרה', 'י״ד אדר תשפ״ה', '14/03/2025', 'כהן', 'לא'])) bad('שורת-אזכרה: ' + JSON.stringify(ev[1]));
const ghost = buildCustomExport(cfg, db, 'events', { from: '2023-03-01', to: '2023-03-31' }, ['title']);
if (ghost.length !== 1) bad('שורת-רפאים לפני ev.date: ' + (ghost.length - 1));

// ── דוגמה 4: תומכות — סינון-טווח, donsAll כולל hist, מדולגת-בלי-פעילות ──
const sdb = {
  ...db,
  supporters: [
    { id: 's1', name: 'לוי', phone: '', email: '', donations: [{ date: '2025-01-10', amount: 200, cur: '₪' }, { date: '2025-01-20', amount: 50, cur: '$' }, { date: '2023-05-01', amount: 999, cur: '₪' }], count: 3, ils: 1199, usd: 50, hist: [{ d: '2022-01-01', a: 100, c: '₪' }], last: '2025-01-20', notes: '' },
    { id: 's2', name: 'רדומה', donations: [{ date: '2020-01-01', amount: 10, cur: '₪' }] },
    { id: 's3', name: 'גולן', donations: [], ayin: { stage: 'eyes', names: [{ name: 'דוד', eyes: 5, done: true }, { name: 'חנה', eyes: '', done: false }], answers: [{ date: '2025-01-15', note: 'כן' }], log: [], lastTouch: '', paid: false, nextTalk: '2025-02-01', nextTalkTime: '10:00' } },
  ],
};
const sr = buildCustomExport(cfg, sdb, 'supporters', jan, ['name', 'dons', 'donsAll', 'tier']);
if (sr.length !== 3) bad('תומכות: ' + (sr.length - 1) + ' שורות ≠ 2 (הרדומה מדולגת)');
if (JSON.stringify(sr[1]) !== JSON.stringify(['לוי', '2 תרומות · ₪200 + $50', '4 תרומות · ₪1299 + $50', 'ארד'])) bad('שורת-לוי: ' + JSON.stringify(sr[1]));
const ay = buildCustomExport(cfg, sdb, 'supporters', jan, ['name', 'stage', 'names', 'eyesTotal', 'paid', 'answers', 'next']);
const ayRow = ay.find((r) => r[0] === 'גולן');
if (!ayRow) bad('גולן (תשובה-בטווח) נעדר');
else if (JSON.stringify(ayRow) !== JSON.stringify(['גולן', 'רישום', 'דוד ·5 ✓ · חנה', '5', 'לא', 'כן', '01/02/2025 10:00'])) bad('שורת-עין: ' + JSON.stringify(ayRow));

// ── דוגמה 5: overrideColumn — כותרת חסינה, אי-מוטציה, colIdx<0 ──
const rows = [['א', 'ב'], ['1', '2']];
const od = overrideColumn(rows, 1, { 0: 'X', 1: 'Y' });
if (JSON.stringify(od) !== JSON.stringify([['א', 'ב'], ['1', 'Y']])) bad('override: ' + JSON.stringify(od));
if (rows[1][1] !== '2') bad('override מוטט את המקור');
if (overrideColumn(rows, -1, { 1: 'Z' }) !== rows) bad('colIdx<0 ≠ כניסה-כיציאה');

// ── קצוות: אפס-שדות ⇒ כותרת-ריקה בלבד; טווח-פתוח כולל הכול ──
if (JSON.stringify(buildCustomExport(cfg, db, 'courses', jan, [])) !== '[[]]') bad('אפס-שדות');
const open = buildCustomExport(cfg, sdb, 'supporters', { from: '', to: '' }, ['name']);
if (open.length !== 4) bad('טווח-פתוח: ' + (open.length - 1) + ' ≠ 3 (גבול ריק = בלי-סינון; גם הרדומה נכנסת)');

/* 🛡 מגן-הכרעה: הכרעות-הקופסה verbatim במקור-הקופסה (דפוס theme.test) */
import { readFileSync } from 'node:fs';
import { NAV_MODULE_KEYS } from '../atoms/nav-module-keys.mjs';
import { HEB_CAL } from '../atoms/heb-cal-data.mjs';
const src = readFileSync(new URL('./custom-export.mjs', import.meta.url), 'utf8');
for (const m of ['families', 'courses', 'calendar', 'diary', 'supporters', 'reports', 'tzedaka', 'shop', 'shop7'])
  if (!NAV_MODULE_KEYS.includes(m)) bad('מגן: NAV_MODULE_KEYS חסר ' + m);   // הכרעה 19: המגן על ערך-הדאטה
if (!src.includes("new Set([CUSTOM_EXPORT_TERMS.k1, CUSTOM_EXPORT_TERMS.k2, CUSTOM_EXPORT_TERMS.k3])")) bad('מגן: HEBREW_RECURRING שונה');
if (HEB_CAL.hebYearOffset !== 3761 || HEB_CAL.scanWindowDays !== 440 || !src.includes('HEB_CAL.hebYearOffset')) bad('מגן: עוגני-scanHebYear שונו');   // הכרעה 19
if (!src.includes('supScoreAtom(sp, rate, nowMs, supTotalIls, supLast, supCount)')) bad('מגן: שקע-nowMs של supScore שונה');

if (f) process.exit(1);
console.log('✓ קופסת-הדו"ח-המותאם: הגדרות-שדות (14/7·17/11) · שורת-חוג · דין-אדר+חסם-רפאים · תומכות (טווח/hist/עין) · override · מגן-הכרעה — ירוק');
